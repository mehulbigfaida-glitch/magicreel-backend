import fs from 'node:fs';
import path from 'node:path';
import { chromium, Page } from 'playwright';

// Usage:
//   npx ts-node scripts/myntra-supplier-extractor.ts input.csv output.csv
//
// input.csv must contain one Myntra product URL per row (header optional).
// This experiment only extracts publicly displayed business/supplier data.
// It does not bypass authentication, CAPTCHAs, robots controls, or access restrictions.

type Lead = {
  productCode: string;
  brand: string;
  productName: string;
  category: string;
  productUrl: string;
  seller: string;
  supplierCompany: string;
  supplierEmail: string;
  supplierPhone: string;
  supplierAddress: string;
  extractionStatus: string;
  evidenceText: string;
};

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const PHONE_RE = /(?:\+?91[\s-]?)?[6-9]\d{9}\b/g;

function csvEscape(value: string): string {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

function readUrls(file: string): string[] {
  const raw = fs.readFileSync(file, 'utf8');
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/^"|"$/g, ''))
    .filter((line) => /^https?:\/\/www\.myntra\.com\//i.test(line));
}

function firstMatch(text: string, regex: RegExp): string {
  const match = text.match(regex);
  return match?.[0]?.trim() ?? '';
}

function valueAfterLabel(text: string, label: string): string {
  const index = text.toLowerCase().indexOf(label.toLowerCase());
  if (index < 0) return '';
  const tail = text.slice(index + label.length);
  return tail.split(/\r?\n/)[0].trim().replace(/^[:\-]\s*/, '');
}

function parsePageUrl(url: string) {
  const parts = new URL(url).pathname.split('/').filter(Boolean);
  const buyIndex = parts.lastIndexOf('buy');
  const productCode = buyIndex > 0 ? parts[buyIndex - 1] : '';
  const brandSlug = buyIndex > 2 ? parts[buyIndex - 2] : '';
  const category = buyIndex > 0 ? parts[0] : '';
  return { productCode, brandSlug, category };
}

async function clickSupplierInfo(page: Page) {
  const candidates = [
    'text=View Supplier Information',
    'text=View supplier information',
    'text=Supplier Information',
  ];
  for (const selector of candidates) {
    const locator = page.locator(selector).first();
    if (await locator.count()) {
      try {
        await locator.click({ timeout: 3000 });
        await page.waitForTimeout(500);
        return true;
      } catch {
        // Continue with the other selectors; the page may expose the data without a click.
      }
    }
  }
  return false;
}

async function extract(page: Page, url: string): Promise<Lead> {
  const parsed = parsePageUrl(url);
  const base: Lead = {
    productCode: parsed.productCode,
    brand: parsed.brandSlug.replace(/[-_]/g, ' '),
    productName: '',
    category: parsed.category,
    productUrl: url,
    seller: '',
    supplierCompany: '',
    supplierEmail: '',
    supplierPhone: '',
    supplierAddress: '',
    extractionStatus: 'failed',
    evidenceText: '',
  };

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1200);
    await clickSupplierInfo(page);
    const text = await page.locator('body').innerText({ timeout: 10000 });
    base.evidenceText = text
      .split(/\r?\n/)
      .map((x) => x.trim())
      .filter(Boolean)
      .filter((x) => /supplier|seller|product code|contact|email|phone|pvt|private|limited/i.test(x))
      .slice(0, 40)
      .join(' | ');

    const lines = text.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
    const productCodeIndex = lines.findIndex((x) => /Product Code:/i.test(x));
    const sellerIndex = lines.findIndex((x) => /^Seller:/i.test(x));
    const titleIndex = lines.findIndex((x) => /^#\s*/.test(x));

    if (productCodeIndex >= 0) {
      base.productCode = firstMatch(lines[productCodeIndex], /\d{5,}/) || base.productCode;
    }
    if (sellerIndex >= 0) {
      base.seller = lines[sellerIndex].replace(/^Seller:\s*/i, '').trim();
    }
    if (titleIndex >= 0) {
      base.productName = lines[titleIndex].replace(/^#\s*/, '').trim();
    } else if (sellerIndex > 0) {
      base.productName = lines.slice(0, sellerIndex).find((x) => x.length > 5) ?? '';
    }

    const emails = Array.from(new Set(text.match(EMAIL_RE) ?? []));
    const phones = Array.from(new Set(text.match(PHONE_RE) ?? []));
    base.supplierEmail = emails[0] ?? '';
    base.supplierPhone = phones[0] ?? '';

    const contactIndex = lines.findIndex((x) => /Contact Brand|Supplier Information|pre-sales product queries/i.test(x));
    if (contactIndex >= 0) {
      const window = lines.slice(contactIndex, Math.min(lines.length, contactIndex + 30));
      const companyCandidate = window.find((x) => /private limited|pvt\.? ltd|limited|llp|industries|enterprises|retail|fashion|apparels|textiles/i.test(x));
      if (companyCandidate && !/^Seller:/i.test(companyCandidate)) base.supplierCompany = companyCandidate;
      const addressCandidate = window.find((x) => /address|road|street|nagar|mumbai|delhi|bengaluru|bangalore|pune|surat|jaipur|kolkata|hyderabad|noida|gurugram/i.test(x) && x.length > 20);
      if (addressCandidate) base.supplierAddress = addressCandidate;
    }

    // If Myntra exposes the seller as the only business identity, preserve it rather than guessing.
    if (!base.supplierCompany) base.supplierCompany = base.seller;

    base.extractionStatus = base.supplierEmail || base.supplierPhone || base.supplierCompany ? 'ok' : 'no_contact_data';
    return base;
  } catch (error) {
    base.extractionStatus = `error:${error instanceof Error ? error.message.slice(0, 120) : 'unknown'}`;
    return base;
  }
}

async function main() {
  const [, , inputFile, outputFile] = process.argv;
  if (!inputFile || !outputFile) {
    console.error('Usage: npx ts-node scripts/myntra-supplier-extractor.ts input.csv output.csv');
    process.exit(1);
  }

  const urls = readUrls(path.resolve(inputFile));
  if (!urls.length) throw new Error('No Myntra product URLs found in input CSV.');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    userAgent: 'MagicReel supplier research experiment; public business information only',
  });
  const page = await context.newPage();
  page.setDefaultNavigationTimeout(30000);

  const rows: Lead[] = [];
  for (let i = 0; i < urls.length; i += 1) {
    console.log(`[${i + 1}/${urls.length}] ${urls[i]}`);
    rows.push(await extract(page, urls[i]));
    // Keep the experiment deliberately conservative. Do not hammer Myntra.
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  await browser.close();

  const header = [
    'productCode', 'brand', 'productName', 'category', 'productUrl', 'seller',
    'supplierCompany', 'supplierEmail', 'supplierPhone', 'supplierAddress',
    'extractionStatus', 'evidenceText',
  ];
  const csv = [
    header.join(','),
    ...rows.map((row) => header.map((key) => csvEscape(row[key as keyof Lead])).join(',')),
  ].join('\n');

  fs.mkdirSync(path.dirname(path.resolve(outputFile)), { recursive: true });
  fs.writeFileSync(path.resolve(outputFile), `${csv}\n`, 'utf8');

  const uniqueCompanies = new Set(rows.map((r) => r.supplierCompany.toLowerCase()).filter(Boolean)).size;
  const usableContacts = rows.filter((r) => r.supplierEmail || r.supplierPhone).length;
  console.log(`\nCompleted: ${rows.length} products`);
  console.log(`Unique supplier/company values: ${uniqueCompanies}`);
  console.log(`Rows with email or phone: ${usableContacts}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
