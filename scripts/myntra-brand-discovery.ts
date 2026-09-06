import puppeteer, { Browser, Page } from 'puppeteer';

const BASE = 'https://www.myntra.com';
const START_URLS = [
  `${BASE}/brands-men`,
  `${BASE}/brands-women`,
  `${BASE}/brands-kids`,
  `${BASE}/top-myntra-brands`,
];

const MAX_PAGES = Number(process.env.MYNTRA_DISCOVERY_MAX_PAGES || 600);
const OUT = process.env.MYNTRA_DISCOVERY_OUT || 'myntra_brand_universe.csv';

function key(value: string): string {
  return value.toLowerCase().normalize('NFKC').replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
}

function csv(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function cleanBrandText(value: string): string {
  return value.replace(/\s+/g, ' ').replace(/\(\s*[\d,]+\s*\)\s*$/g, '').trim();
}

async function expandBrandFilter(page: Page): Promise<void> {
  // Myntra initially renders only a few brand options and a "+ N more" control.
  // Expand that control so the complete filter list becomes available in the DOM.
  const clicked = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('button, a, span, div, li'));
    const target = nodes.find(el => /^\+\s*[\d,]+\s+more$/i.test((el.textContent || '').trim()));
    if (target) {
      (target as HTMLElement).click();
      return true;
    }
    return false;
  });
  if (clicked) await new Promise(resolve => setTimeout(resolve, 1200));
}

async function collectBrandFilterText(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const body = document.body.innerText || '';
    const lines = body.split(/\n+/).map(x => x.trim()).filter(Boolean);
    const brandIndex = lines.findIndex(x => /^Brand$/i.test(x));
    if (brandIndex < 0) return [];

    const result: string[] = [];
    for (let i = brandIndex + 1; i < lines.length; i++) {
      const line = lines[i];
      if (/^Price$/i.test(line)) break;
      if (/^Input:\s*Search for Brand$/i.test(line)) continue;
      if (/^\+\s*[\d,]+\s+more$/i.test(line)) continue;
      if (/^(FILTERS|Categories|Color|Discount Range|Sort by|CLEAR ALL|Clear All)$/i.test(line)) continue;
      if (/^\d[\d,]*\s+more$/i.test(line)) continue;
      if (/^\*?$/.test(line)) continue;
      // Brand filter entries generally end with an item count in parentheses.
      if (/^.+\(\s*[\d,]+\s*\)$/.test(line)) result.push(line);
    }
    return result;
  });
}

async function collectFromPage(page: Page, url: string) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForNetworkIdle({ idleTime: 1200, timeout: 15000 }).catch(() => undefined);
  await expandBrandFilter(page);

  const filterEntries = await collectBrandFilterText(page);
  const links = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a')) as HTMLAnchorElement[];
    return anchors.map(a => ({ text: (a.textContent || '').trim(), href: a.href })).filter(x => x.text);
  });

  return { filterEntries, links };
}

async function main() {
  const browser: Browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  await page.setUserAgent('Mozilla/5.0 (compatible; MagicReel-MyntraResearch/1.0; +https://magicreel.ai)');

  const brands = new Map<string, { brand: string; url: string; source: string }>();
  const seen = new Set<string>();
  const queue = [...START_URLS];

  try {
    while (queue.length && seen.size < MAX_PAGES) {
      const url = queue.shift()!;
      if (seen.has(url)) continue;
      seen.add(url);

      let data: { filterEntries: string[]; links: { text: string; href: string }[] };
      try { data = await collectFromPage(page, url); } catch { continue; }

      // Primary source: the Myntra Brand filter itself. This is the authoritative
      // brand universe exposed by the category page and does not depend on anchor links.
      for (const entry of data.filterEntries) {
        const brand = cleanBrandText(entry);
        const k = key(brand);
        if (k.length >= 2 && !brands.has(k)) {
          brands.set(k, { brand, url, source: url });
        }
      }

      // Secondary source: any explicit brand links/index links on the page.
      for (const link of data.links) {
        const href = link.href.split('#')[0];
        const text = cleanBrandText(link.text);
        if (!text || text.length > 100 || !href.startsWith(BASE)) continue;
        const path = new URL(href).pathname;
        const excluded = /\/(products|shop|search|men|women|kids|home|beauty|sports|brandlisting|top-myntra-brands|brands-men|brands-women|brands-kids)/i.test(path);
        if (!excluded && /^[\p{L}\p{N}][\p{L}\p{N}&.'()\- ]{1,70}$/u.test(text)) {
          const k = key(text);
          if (k.length >= 2 && !brands.has(k)) brands.set(k, { brand: text, url: href, source: url });
        }
        if (/brands|brand/i.test(path) && !seen.has(href) && queue.length < MAX_PAGES * 2) queue.push(href);
      }
    }

    const fs = await import('node:fs/promises');
    const rows = [
      ['canonical_brand', 'myntra_url', 'discovery_source', 'brand_key'],
      ...Array.from(brands.values()).sort((a,b) => a.brand.localeCompare(b.brand)).map(x => [x.brand, x.url, x.source, key(x.brand)]),
    ];
    await fs.writeFile(OUT, rows.map(r => r.map(csv).join(',')).join('\n') + '\n', 'utf8');
    console.log(JSON.stringify({ pagesVisited: seen.size, brands: brands.size, output: OUT }, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
