import { NextRequest, NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { OfferPDF } from "@/components/OfferPDF";
import { createElement } from "react";

export async function POST(req: NextRequest) {
  try {
    const { items, shipping } = await req.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ message: "Date invalide" }, { status: 400 });
    }

    // Randăm componenta ca stream PDF (Node Readable)
    // Folosim createElement pentru compatibilitate .ts
    const nodeStream = await renderToStream(createElement(OfferPDF, { items, shipping }) as any);

    // Covertim stream (fie Node Readable, fie Web ReadableStream, fie Response-like)
    async function streamToBuffer(stream: any): Promise<Buffer> {
      // Already a Buffer
      if (Buffer.isBuffer(stream)) return stream;

      // Node async iterable (Readable)
      if (stream && typeof stream[Symbol.asyncIterator] === 'function') {
        const chunks: Buffer[] = [];
        for await (const chunk of stream) {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
        return Buffer.concat(chunks);
      }

      // Web ReadableStream (has getReader)
      if (stream && typeof stream.getReader === 'function') {
        const reader = stream.getReader();
        const chunks: Uint8Array[] = [];
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (!value) continue;
          chunks.push(value instanceof Uint8Array ? value : new Uint8Array(value));
        }
        return Buffer.concat(chunks.map((c) => Buffer.from(c)));
      }

      // Response-like with arrayBuffer()
      if (stream && typeof stream.arrayBuffer === 'function') {
        const ab = await stream.arrayBuffer();
        return Buffer.from(ab);
      }

      throw new Error('Unsupported stream type for PDF generation');
    }

    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await streamToBuffer(nodeStream as any);
    } catch (err: any) {
      console.error('PDF stream conversion failed. Stream keys:', Object.keys(nodeStream || {}), 'err:', err);
      throw err;
    }

    return new NextResponse(pdfBuffer as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=Oferta_Prynt.pdf`,
      },
    });

  } catch (error: any) {
    console.error("PDF Error:", error);
    return NextResponse.json({ message: "Eroare generare PDF" }, { status: 500 });
  }
}