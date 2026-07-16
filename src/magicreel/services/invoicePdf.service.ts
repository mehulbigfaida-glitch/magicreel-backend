import puppeteer from "puppeteer";
import { uploadInvoicePdf } from "../../utils/uploadInvoicePdf";
import { buildInvoiceHtml } from "../templates/invoice.html";

interface InvoiceData {
  invoiceNo: string;
  date: string;
  customerName: string;
  customerAddress?: string;
  customerGSTIN?: string;
  placeOfSupply: string;
  description: string;
  amount: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  total: number;
}

export async function generateInvoicePDF(data: InvoiceData) {
  const html = buildInvoiceHtml(data);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setContent(html, {
    waitUntil: "networkidle0",
  });

  const pdfUint8 = await page.pdf({
  format: "A4",
  printBackground: true,
});

const pdf = Buffer.from(pdfUint8);

await browser.close();

const pdfUrl = await uploadInvoicePdf(
  pdf,
  data.invoiceNo
);

return {
  pdfBuffer: pdf,
  pdfUrl,
};
}