import { cloudinary } from "../config/cloudinary";

export async function uploadInvoicePdf(
  pdfBuffer: Buffer,
  invoiceNumber: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "magicreel/invoices",
        resource_type: "raw",
        public_id: invoiceNumber,
        format: "pdf",
        overwrite: true,
      },
      (
        error: Error | undefined,
        result: {
          secure_url: string;
        } | undefined
      ) => {
        if (error || !result) {
          return reject(error);
        }

        resolve(result.secure_url);
      }
    );

    stream.end(pdfBuffer);
  });
}