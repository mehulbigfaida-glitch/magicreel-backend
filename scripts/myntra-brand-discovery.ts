import puppeteer, { Browser, Page } from 'puppeteer';
import axios from 'axios';

const BASE = 'https://www.myntra.com';
const START_URLS = [`${BASE}/brands-men`, `${BASE}/brands-women`, `${BASE}/brands-kids`, `${BASE}/top-myntra-brands`];
const MAX_PAGES = Number(process.env.MYNTRA_DISCOVERY_MAX_PAGES || 600);
const OUT = process.env.MYNTRA_DISCOVERY_OUT || 'myntra_brand_universe.csv';

function key(value: string): string {
  return value.toLowerCase().normalize('NFKC').replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
}
function csv(value: string): string { return `"${value.replace(/"/g, '""')}"`; }
function cleanBrandText(value: string): string { return value.replace(/\s+/g, ' ').replace(/\(\s*[\d,]+\s*\)\s*$/g, '').trim(); }

function addBrand(brands: Map<string, { brand: string; url: string; source: string }>, value: unknown, url: string, source: string) {
  if (typeof value !== 'string') return;
  const brand = cleanBrandText(value), k = key(brand);
  if (k.length < 2 || brand.length > 100) return;
  if (/^(brand|brands|clear all|view all|input|search for brand)$/i.test(brand)) return;
  brands.set(k, brands.get(k) || { brand, url, source });
}

function harvestBrandObjects(node: unknown, brands: Map<string, { brand: string; url: string; source: string }>, url: string, source: string, depth = 0): void {
  if (depth > 12 || node == null) return;
  if (Array.isArray(node)) { for (const item of node) harvestBrandObjects(item, brands, url, source, depth + 1); return; }
  if (typeof node !== 'object') return;
  const obj = node as Record<string, unknown>;
  const keys = Object.keys(obj).map(k => k.toLowerCase());
  if (keys.some(k => k.includes('brand'))) {
    for (const [k, v] of Object.entries(obj)) {
      const lk = k.toLowerCase();
      if (lk === 'brandname' || lk === 'brand' || lk === 'name' || lk === 'value' || lk === 'label' || lk === 'displayname') {
        if (typeof v === 'string') addBrand(brands, v, url, source);
      }
    }
  }
  for (const value of Object.values(obj)) harvestBrandObjects(value, brands, url, source, depth + 1);
}

async function collectGatewayBrands(url: string, brands: Map<string, { brand: string; url: string; source: string }>): Promise<boolean> {
  const slug = new URL(url).pathname.replace(/^\//, '');
  const apiUrl = `${BASE}/gateway/v2/search/${encodeURIComponent(slug)}`;
  try {
    const response = await axios.get(apiUrl, {
      params: { p: 1, rows: 50, o: 0, plaEnabled: 'false' }, timeout: 30000, validateStatus: () => true,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151.0.0.0 Safari/537.36', Accept: 'application/json, text/plain, */*', Referer: url, 'x-requested-with': 'browser', 'x-myntraweb': 'Yes' }
    });
    if (response.status !== 200 || typeof response.data !== 'object') {
      console.log(JSON.stringify({ gateway: 'unavailable', url: apiUrl, status: response.status }));
      return false;
    }
    const before = brands.size;
    harvestBrandObjects(response.data, brands, url, apiUrl);
    console.log(JSON.stringify({ gateway: 'ok', url: apiUrl, addedBrands: brands.size - before, topLevelKeys: Object.keys(response.data as object).slice(0, 20) }));
    return true;
  } catch (error: any) {
    console.log(JSON.stringify({ gateway: 'error', url: apiUrl, error: error?.message || String(error) }));
    return false;
  }
}

async function expandBrandFilter(page: Page): Promise<void> {
  const clicked = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('button, a, span, div, li'));
    const target = nodes.find(el => /^\+\s*[\d,]+\s+more$/i.test((el.textContent || '').trim()));
    if (target) { (target as HTMLElement).click(); return true; }
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
      if (/^Input:\s*Search for Brand$/i.test(line) || /^\+\s*[\d,]+\s+more$/i.test(line)) continue;
      if (/^(FILTERS|Categories|Color|Discount Range|Sort by|CLEAR ALL|Clear All)$/i.test(line)) continue;
      if (/^\d[\d,]*\s+more$/i.test(line) || /^\*?$/.test(line)) continue;
      if (/^.+\(\s*[\d,]+\s*\)$/.test(line)) result.push(line);
    }
    return result;
  });
}

async function collectFromPage(page: Page, url: string) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForNetworkIdle({ idleTime: 1200, timeout: 15000 }).catch(() => undefined);
  const title = await page.title().catch(() => '');
  const h1 = await page.$eval('h1', el => (el.textContent || '').trim()).catch(() => '');
  if (/site maintenance/i.test(title) || /oops! something went wrong/i.test(h1)) throw new Error(`Myntra returned maintenance page (title=${title}, h1=${h1})`);
  await expandBrandFilter(page);
  return {
    filterEntries: await collectBrandFilterText(page),
    links: await page.evaluate(() => Array.from(document.querySelectorAll('a')).map(a => ({ text: (a.textContent || '').trim(), href: (a as HTMLAnchorElement).href })).filter(x => x.text))
  };
}

async function main() {
  const browser: Browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151.0.0.0 Safari/537.36');
  const brands = new Map<string, { brand: string; url: string; source: string }>();
  const seen = new Set<string>();
  const queue = [...START_URLS];
  try {
    while (queue.length && seen.size < MAX_PAGES) {
      const url = queue.shift()!;
      if (seen.has(url)) continue;
      seen.add(url);
      const gatewayWorked = await collectGatewayBrands(url, brands);
      try {
        const data = await collectFromPage(page, url);
        for (const entry of data.filterEntries) addBrand(brands, entry, url, url);
        for (const link of data.links) {
          const href = link.href.split('#')[0], text = cleanBrandText(link.text);
          if (!text || text.length > 100 || !href.startsWith(BASE)) continue;
          const path = new URL(href).pathname;
          const excluded = /\/(products|shop|search|men|women|kids|home|beauty|sports|brandlisting|top-myntra-brands|brands-men|brands-women|brands-kids)/i.test(path);
          if (!excluded && /^[\p{L}\p{N}][\p{L}\p{N}&.'()\- ]{1,70}$/u.test(text)) addBrand(brands, text, href, url);
          if (/brands|brand/i.test(path) && !seen.has(href) && queue.length < MAX_PAGES * 2) queue.push(href);
        }
      } catch (error: any) {
        if (!gatewayWorked) console.log(JSON.stringify({ html: 'unavailable', url, error: error?.message || String(error) }));
      }
    }
    const fs = await import('node:fs/promises');
    const rows = [['canonical_brand', 'myntra_url', 'discovery_source', 'brand_key'], ...Array.from(brands.values()).sort((a,b) => a.brand.localeCompare(b.brand)).map(x => [x.brand, x.url, x.source, key(x.brand)])];
    await fs.writeFile(OUT, rows.map(r => r.map(csv).join(',')).join('\n') + '\n', 'utf8');
    console.log(JSON.stringify({ pagesVisited: seen.size, brands: brands.size, output: OUT }, null, 2));
  } finally { await browser.close(); }
}
main().catch(err => { console.error(err); process.exit(1); });
