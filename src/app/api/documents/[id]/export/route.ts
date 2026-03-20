import { NextRequest, NextResponse } from 'next/server';
import { exportToPdf, exportToDocx, exportToText, exportToMarkdown } from '@/lib/exportService';

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();
    const { title = 'Untitled Document', content = '', format = 'pdf' } = body;

    switch (format) {
      case 'pdf': {
        const pdfBytes = await exportToPdf(title, content);
        return new Response(pdfBytes.buffer as ArrayBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${title}.pdf"`,
          },
        });
      }

      case 'docx': {
        const docxBytes = await exportToDocx(title, content);
        return new Response(docxBytes.buffer as ArrayBuffer, {
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': `attachment; filename="${title}.docx"`,
          },
        });
      }

      case 'txt': {
        const text = exportToText(title, content);
        return new Response(text, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Content-Disposition': `attachment; filename="${title}.txt"`,
          },
        });
      }

      case 'md': {
        const md = exportToMarkdown(title, content);
        return new Response(md, {
          headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'Content-Disposition': `attachment; filename="${title}.md"`,
          },
        });
      }

      default:
        return NextResponse.json({ error: `Unsupported format: ${format}` }, { status: 400 });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Export failed';
    console.error('Export Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
