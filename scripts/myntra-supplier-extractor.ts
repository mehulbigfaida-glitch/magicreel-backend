import fs from 'node:fs';
import path from 'node:path';
import puppeteer, { Page } from 'puppeteer';

type Lead = {
  productCode: string; brand: string; productName: string; category: string; productUrl: string;
  seller: string; supplierCompany: string; supplierEmail: string; supplierPhone: string;
  supplierAddress: string; extractionStatus: string; evidenceText: string;
};

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const PHONE_RE = /(?:\+?91[\s-]?)?[6-9]\d{9}\b/g;
const csvEscape = (v: string) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const readUrls = (file: string) => fs.readFileSync(file, 'utf8').split(/\r?\n/).map(x => x.trim().replace(/^"|"$/g, '')).filter(x => /^https?:\/\/www\.myntra\.com\//i.test(x));
const firstMatch = (text: string, regex: RegExp) => text.match(regex)?.[0]?.trim() ?? '';

function parsePageUrl(url: string) {
  const parts = new URL(url).pathname.split('/').filter(Boolean);
  const buyIndex = parts.lastIndexOf('buy');
  return {
    productCode: buyIndex > 0 ? parts[buyIndex - 1] : '',
    brandSlug: buyIndex > 2 ? parts[buyIndex - 2] : '',
    category: buyIndex > 0 ? parts[0] : '',
  };
}

async function clickSupplierInfo(page: Page) {
  const clicked = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('button, a, div, span'));
    const target = elements.find(el => /view supplier information|supplier information/i.test(el.textContent || '')) as HTMLElement | undefined;
    if (!target) return false;
    target.click();
    return true;
  });
  if (clicked) await new Promise(r => setTimeout(r, 500));
  return clicked;
}

async function extract(page: Page, url: string): Promise<Lead> {
  const parsed = parsePageUrl(url);
  const base: Lead = { productCode: parsed.productCode, brand: parsed.brandSlug.replace(/[-_]/g, ' '), productName: '', category: parsed.category, productUrl: url, seller: '', supplierCompany: '', supplierEmail: '', supplierPhone: '', supplierAddress: '', extractionStatus: 'failed', evidenceText: '' };
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1200));
    await clickSupplierInfo(page);
    const text = await page.evaluate(() => document.body?.innerText || '');
    const lines = text.split(/\r?\n/).map(x => x.trim()).filter(Boolean);
    base.evidenceText = lines.filter(x => /supplier|seller|product code|contact|email|phone|pvt|private|limited|address/i.test(x)).slice(0, 40).join(' | ');
    const productCodeLine = lines.find(x => /Product Code:/i.test(x));
    const sellerLine = lines.find(x => /^Seller:/i.test(x));
    if (productCodeLine) base.productCode = firstMatch(productCodeLine, /\d{5,}/) || base.productCode;
    if (sellerLine) base.seller = sellerLine.replace(/^Seller:\s*/i, '').trim();
    base.productName = (await page.title()).replace(/\s*[-|].*Myntra.*$/i, '').trim();
    base.supplierEmail = Array.from(new Set(text.match(EMAIL_RE) ?? []))[0] ?? '';
    base.supplierPhone = Array.from(new Set(text.match(PHONE_RE) ?? []))[0] ?? '';
    const contactIndex = lines.findIndex(x => /Contact Brand|Supplier Information|pre-sales product queries/i.test(x));
    if (contactIndex >= 0) {
      const window = lines.slice(contactIndex, Math.min(lines.length, contactIndex + 30));
      base.supplierCompany = window.find(x => /private limited|pvt\.? ltd|limited|llp|industries|enterprises|retail|fashion|apparels|textiles/i.test(x) && !/^Seller:/i.test(x)) || '';
      base.supplierAddress = window.find(x => /address|road|street|nagar|mumbai|delhi|bengaluru|bangalore|pune|surat|jaipur|kolkata|hyderabad|noida|gurugram/i.test(x) && x.length > 20) || '';
    }
    if (!base.supplierCompany) base.supplierCompany = base.seller;
    base.extractionStatus = base.supplierEmail || base.supplierPhone || base.supplierCompany ? 'ok' : 'no_contact_data';
  } catch (error) {
    base.extractionStatus = `error:${error instanceof Error ? error.message.slice(0, 120) : 'unknown'}`;
  }
  return base;
}

async function main() {
  const [, , inputFile, outputFile] = process.argv;
  if (!inputFile || !outputFile) throw new Error('Usage: npx ts-node scripts/myntra-supplier-extractor.ts input.csv output.csv');
  const urls = readUrls(path.resolve(inputFile));
  if (!urls.length) throw new Error('No Myntra product URLs found in input CSV.');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  await page.setUserAgent('MagicReel supplier research experiment; public business information only');
  const rows: Lead[] = [];
  for (let i = 0; i < urls.length; i++) {
    console.log(`[${i + 1}/${urls.length}] ${urls[i]}`);
    rows.push(await extract(page, urls[i]));
    await new Promise(r => setTimeout(r, 1500));
  }
  await browser.close();
  const header = ['productCode','brand','productName','category','productUrl','seller','supplierCompany','supplierEmail','supplierPhone','supplierAddress','extractionStatus','evidenceText'];
  const csv = [header.join(','), ...rows.map(row => header.map(key => csvEscape(row[key as keyof Lead])).join(','))].join('\n');
  fs.mkdirSync(path.dirname(path.resolve(outputFile)), { recursive: true });
  fs.writeFileSync(path.resolve(outputFile), `${csv}\n`, 'utf8');
  console.log(`Completed: ${rows.length} products`);
  console.log(`Unique supplier/company values: ${new Set(rows.map(r => r.supplierCompany.toLowerCase()).filter(Boolean)).size}`);
  console.log(`Rows with email or phone: ${rows.filter(r => r.supplierEmail || r.supplierPhone).length}`);
}
main().catch(error => { console.error(error); process.exit(1); });
