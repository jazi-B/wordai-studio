import { jsPDF } from 'jspdf';
import { Document as DocxDocument, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

// ========== PDF Export ==========
export async function exportToPdf(title: string, textContent: string): Promise<Uint8Array> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 25.4; // 1 inch
  const maxWidth = pageWidth - 2 * margin;
  const lineHeight = 7;
  let y = margin;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  const titleLines = doc.splitTextToSize(title, maxWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 9 + 5;

  // Body
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  const paragraphs = textContent.split('\n');

  for (const para of paragraphs) {
    const lines = doc.splitTextToSize(para, maxWidth);
    for (const line of lines) {
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    }
    y += 3; // paragraph spacing
  }

  return doc.output('arraybuffer') as unknown as Uint8Array;
}

// ========== DOCX Export ==========
export async function exportToDocx(title: string, textContent: string): Promise<Uint8Array> {
  const paragraphs: Paragraph[] = [];

  // Title
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: title, bold: true, size: 36, font: 'Calibri' })],
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    })
  );

  // Body paragraphs
  const lines = textContent.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('## ')) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed.replace('## ', ''), bold: true, size: 28, font: 'Calibri' })],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 120 },
        })
      );
    } else if (trimmed.startsWith('### ')) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed.replace('### ', ''), bold: true, size: 24, font: 'Calibri' })],
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 },
        })
      );
    } else if (trimmed.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed, size: 24, font: 'Calibri' })],
          spacing: { after: 120 },
        })
      );
    } else {
      paragraphs.push(new Paragraph({ children: [] }));
    }
  }

  const doc = new DocxDocument({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }, // 1 inch = 1440 twips
          },
        },
        children: paragraphs,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return new Uint8Array(buffer);
}

// ========== Plain Text Export ==========
export function exportToText(title: string, textContent: string): string {
  return `${title}\n${'='.repeat(title.length)}\n\n${textContent}`;
}

// ========== Markdown Export ==========
export function exportToMarkdown(title: string, textContent: string): string {
  return `# ${title}\n\n${textContent}`;
}
