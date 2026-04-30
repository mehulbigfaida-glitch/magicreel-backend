import puppeteer from "puppeteer";
import { uploadInvoicePdf } from "../../utils/uploadInvoicePdf";

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
  const html = `
    <html>
      <body style="font-family: Arial; padding:40px;">
        <h2>MagicReel (by AMJIS)</h2>
        <p>
          AMJIS<br/>
          129-B, AWCL Complex, VIT College Road,<br/>
          Wadala (East), Mumbai - 400037<br/>
          GSTIN: 27AASHM8403M1ZI
        </p>

        <h3>TAX INVOICE</h3>
        <p>Invoice No: ${data.invoiceNo}</p>
        <p>Date: ${data.date}</p>

        <hr/>

        <h4>Bill To:</h4>
        <p>${data.customerName}</p>

        <table width="100%" border="1" cellspacing="0" cellpadding="8">
          <tr>
            <th>Description</th>
            <th>SAC</th>
            <th>Amount</th>
          </tr>
          <tr>
            <td>${data.description}</td>
            <td>998314</td>
            <td>₹${data.amount}</td>
          </tr>
        </table>

        <h3>Total: ₹${data.total}</h3>
      </body>
    </html>
  `;

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