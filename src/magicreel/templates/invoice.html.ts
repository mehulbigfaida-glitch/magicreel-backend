interface InvoiceTemplateData {
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

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export function buildInvoiceHtml(data: InvoiceTemplateData) {
  const taxableValue =
    data.total -
    (data.cgst ?? 0) -
    (data.sgst ?? 0) -
    (data.igst ?? 0);

  const hasIGST = (data.igst ?? 0) > 0;

  return `
<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8" />

<style>

*{
box-sizing:border-box;
}

body{
font-family:Arial,Helvetica,sans-serif;
margin:0;
padding:40px;
font-size:13px;
color:#222;
background:#fff;
}

.container{
border:1px solid #dcdcdc;
padding:30px;
}

.header{
display:flex;
justify-content:space-between;
align-items:flex-start;
border-bottom:2px solid #000;
padding-bottom:20px;
margin-bottom:25px;
}

.logo h1{
margin:0;
font-size:34px;
letter-spacing:1px;
}

.logo h2{
margin:4px 0;
font-size:16px;
font-weight:500;
color:#555;
}

.logo p{
margin:3px 0;
font-size:12px;
color:#666;
}

.company{
text-align:right;
font-size:12px;
line-height:1.6;
}

.section-title{
font-size:20px;
font-weight:bold;
margin-bottom:15px;
}

.info{
display:flex;
justify-content:space-between;
margin-bottom:25px;
gap:30px;
}

.card{
width:48%;
border:1px solid #d9d9d9;
padding:15px;
border-radius:6px;
}

.card h3{
margin-top:0;
margin-bottom:12px;
font-size:15px;
}

.card p{
margin:4px 0;
}

table{
width:100%;
border-collapse:collapse;
margin-top:15px;
}

th{
background:#f5f5f5;
font-weight:bold;
}

th,
td{
border:1px solid #d8d8d8;
padding:10px;
text-align:left;
}

.right{
text-align:right;
}

.summary{
width:360px;
margin-left:auto;
margin-top:25px;
}

.summary table td{
border:none;
padding:6px 0;
}

.summary .grand{
font-size:16px;
font-weight:bold;
border-top:2px solid #000;
padding-top:10px;
}

.footer{
margin-top:40px;
padding-top:20px;
border-top:1px solid #dcdcdc;
font-size:12px;
color:#666;
line-height:1.8;
}

</style>

</head>

<body>

<div class="container">

<div class="header">

<div class="logo">

<h1>MAGICREEL</h1>

<h2>AI Fashion Workspace</h2>

<p>A Product of AMJIS</p>

</div>

<div class="company">

<strong>AMJIS</strong><br>

129-B, AWCL Complex<br>

VIT College Road<br>

Wadala (East)<br>

Mumbai - 400037<br>

Maharashtra, India<br><br>

GSTIN : 27AASHM8403M1ZI<br>

Email : admin@magicreel.in<br>

Website : www.magicreel.in

</div>

</div>

<div class="section-title">

TAX INVOICE

</div>

<div class="info">

<div class="card">

<h3>Invoice Details</h3>

<p><strong>Invoice No:</strong> ${data.invoiceNo}</p>

<p><strong>Date:</strong> ${data.date}</p>

<p><strong>Place of Supply:</strong> ${data.placeOfSupply}</p>

</div>

<div class="card">

<h3>Bill To</h3>

<p><strong>${data.customerName}</strong></p>

<p>${data.customerAddress ?? "-"}</p>

${
  data.customerGSTIN
    ? `<p><strong>GSTIN:</strong> ${data.customerGSTIN}</p>`
    : ""
}

</div>

</div>

<table>

<thead>

<tr>

<th style="width:8%">#</th>

<th>Description</th>

<th style="width:15%">HSN/SAC</th>

<th style="width:10%">Qty</th>

<th class="right" style="width:17%">Rate</th>

<th class="right" style="width:18%">Amount</th>

</tr>

</thead>

<tbody>

<tr>

<td>1</td>

<td>${data.description}</td>

<td>998315</td>

<td>1</td>

<td class="right">₹ ${formatCurrency(data.amount)}</td>

<td class="right">₹ ${formatCurrency(data.amount)}</td>

</tr>

</tbody>

</table>

<div class="summary">

<table>

<tr>

<td>Taxable Value</td>

<td class="right">₹ ${formatCurrency(taxableValue)}</td>

</tr>

${
  hasIGST
    ? `
<tr>
<td>IGST (18%)</td>
<td class="right">₹ ${formatCurrency(data.igst ?? 0)}</td>
</tr>
`
    : `
<tr>
<td>CGST (9%)</td>
<td class="right">₹ ${formatCurrency(data.cgst ?? 0)}</td>
</tr>

<tr>
<td>SGST (9%)</td>
<td class="right">₹ ${formatCurrency(data.sgst ?? 0)}</td>
</tr>
`
}

<tr class="grand">

<td>Grand Total</td>

<td class="right">

₹ ${formatCurrency(data.total)}

</td>

</tr>

</table>

</div>

<div class="footer">

<strong>Payment Method:</strong> Razorpay

<br>

This is a computer generated GST Invoice.

No signature is required.

<br><br>

Thank you for choosing <strong>MagicReel</strong>.

</div>

</div>

</body>

</html>
`;
}