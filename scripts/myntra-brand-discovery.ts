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

async function collectFromPage(page: Page, url: string) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForNetworkIdle({ idleTime: 1200, timeout: 15000 }).catch(() => undefined);
  return page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a')) as HTMLAnchorElement[];
    return links.map(a => ({ text: (a.textContent || '').trim(), href: a.href })).filter(x => x.text);
  });
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
      let links: { text: string; href: string }[] = [];
      try { links = await collectFromPage(page, url); } catch { continue; }

      for (const link of links) {
        const href = link.href.split('#')[0];
        const text = link.text.replace(/\s+/g, ' ').trim();
        if (!text || text.length > 100) continue;
        if (!href.startsWith(BASE)) continue;

        // Brand surfaces generally use /<brand> or /brand/<slug>; product/category links are excluded.
        const path = new URL(href).pathname;
        const excluded = /\/(products|shop|search|men|women|kids|home|beauty|sports|brandlisting|top-myntra-brands|brands-men|brands-women|brands-kids)/i.test(path);
        if (!excluded && /^[\p{L}\p{N}][\p{L}\p{N}&.'()\- ]{1,70}$/u.test(text)) {
          const k = key(text);
          if (k.length >= 2 && !brands.has(k)) brands.set(k, { brand: text, url: href, source: url });
        }

        // Continue following Myntra brand/category pagination and brand-index links.
        if (/brands|brand/i.test(path) && !seen.has(href) && queue.length < MAX_PAGES * 2) queue.push(href);
      }

      // Also harvest visible filter chips, which are frequently rendered as buttons/spans rather than anchors.
      const visibleNames = await page.evaluate(() => Array.from(document.querySelectorAll('[class*="brand"], [class*="Brand"]')).map(e => (e.textContent || '').trim()).filter(t => t && t.length < 80).slice(0, 500));
      for (const text of visibleNames) {
        const k = key(text);
        if (k.length >= 2 && !/^(brand|brands|clear all|view all)$/i.test(text) && !brands.has(k)) brands.set(k, { brand: text, url, source: url });
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
