import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { ToolPageShell } from "@/components/ToolPageShell";
import { FileDropzone } from "@/components/FileDropzone";
import { FAQ } from "@/components/FAQ";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download, Loader2, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const faqs = [
  {
    question: "Will my PDF formatting be preserved in Word?",
    answer:
      "This tool extracts text content into an editable Word document. Complex layouts, embedded images, columns, and tables may not be preserved exactly. For text-heavy PDFs, results are excellent.",
  },
  {
    question: "Is my PDF uploaded to a server?",
    answer:
      "No. Conversion runs entirely in your browser. Your PDF and the resulting Word file never leave your device.",
  },
  {
    question: "What format is the output file?",
    answer:
      "The tool generates a standard .docx file compatible with Microsoft Word, Google Docs, LibreOffice, and Apple Pages.",
  },
  {
    question: "Can I convert scanned PDFs?",
    answer:
      "Scanned PDFs contain images, not text, so this text-extraction tool can't read them. You'd need an OCR (optical character recognition) tool first.",
  },
];

const PdfToWord = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);

  const handleConvert = async () => {
    if (!files[0]) return;
    setProcessing(true);
    setProgress(5);
    try {
      const file = files[0];
      const bytes = await file.arrayBuffer();
      const pdfDoc = await pdfjsLib.getDocument({ data: bytes }).promise;

      const paragraphs: Paragraph[] = [
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun(file.name.replace(/\.pdf$/i, ""))],
        }),
      ];

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const content = await page.getTextContent();

        // Group text items into lines by approximate Y position
        const lines = new Map<number, string[]>();
        for (const item of content.items as any[]) {
          if (!("str" in item)) continue;
          const y = Math.round(item.transform[5]);
          const arr = lines.get(y) || [];
          arr.push(item.str);
          lines.set(y, arr);
        }

        const sorted = Array.from(lines.entries()).sort((a, b) => b[0] - a[0]);
        for (const [, parts] of sorted) {
          const text = parts.join(" ").replace(/\s+/g, " ").trim();
          if (text) paragraphs.push(new Paragraph({ children: [new TextRun(text)] }));
        }
        paragraphs.push(new Paragraph({ children: [new TextRun("")] }));
        setProgress(10 + Math.round((i / pdfDoc.numPages) * 80));
      }

      const doc = new Document({ sections: [{ children: paragraphs }] });
      const blob = await Packer.toBlob(doc);
      setProgress(95);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, "") + ".docx";
      a.click();
      URL.revokeObjectURL(url);
      setProgress(100);
      toast({ title: "Conversion complete", description: "Word file has been downloaded." });
    } catch (e) {
      console.error(e);
      toast({
        title: "Conversion failed",
        description: "Could not extract text. The PDF may be scanned, encrypted, or corrupted.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
      setTimeout(() => setProgress(0), 1500);
    }
  };

  return (
    <ToolPageShell
      title="PDF to Word Converter — Free Online Tool | PDFMaster Tools"
      description="Convert PDF to editable Word .docx file online for free. Browser-based, secure, no signup required."
      h1="PDF to Word Converter"
      intro="Extract text from your PDF into an editable Microsoft Word (.docx) document."
      faqSchema={faqs}
      toolUI={
        <div className="space-y-6">
          <div className="flex gap-3 bg-accent/50 border border-border rounded-lg p-4 text-sm">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">About this converter</p>
              <p className="text-muted-foreground">
                This tool extracts <strong>text content</strong> into a clean .docx file.
                Complex layouts, columns, tables, and images are not preserved. Best for
                text-heavy documents like articles, reports, and resumes.
              </p>
            </div>
          </div>

          <FileDropzone
            files={files}
            onFiles={(f) => setFiles([f[0]])}
            onRemove={() => setFiles([])}
            cta="Drop a PDF here or click to upload"
            subtitle="One file at a time • Max 50MB"
          />

          {processing && <Progress value={progress} />}

          <Button
            size="lg"
            className="w-full"
            disabled={!files[0] || processing}
            onClick={handleConvert}
          >
            {processing ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Converting...</>
            ) : (
              <><Download className="h-4 w-4" /> Convert to Word & Download</>
            )}
          </Button>
        </div>
      }
      seoContent={
        <>
          <h2>How to Convert PDF to Word Online</h2>
          <p>
            PDFs are excellent for sharing finished documents but frustrating to edit. When
            you need to update a resume, revise a report, or repurpose content from a
            published article, converting to Microsoft Word format opens up full editing
            capability. PDFMaster's free PDF to Word converter extracts the text from your
            PDF and packages it into a clean, editable .docx file you can open in Word,
            Google Docs, LibreOffice, or any compatible editor.
          </p>
          <h3>Step-by-Step Conversion</h3>
          <p>
            <strong>1. Upload your PDF.</strong> Drag and drop or click to select. The
            file is read locally — nothing is uploaded.
          </p>
          <p>
            <strong>2. Click Convert.</strong> The tool extracts text from each page,
            preserving line and paragraph order, and builds a Word document.
          </p>
          <p>
            <strong>3. Download.</strong> Your .docx file downloads automatically and is
            ready to edit.
          </p>
          <h3>What This Tool Does Well</h3>
          <p>
            Text extraction works excellently for articles, books, reports, contracts,
            essays, and any text-driven document. The output preserves words and reading
            order, giving you a clean foundation to edit, format, and rework as needed.
          </p>
          <h3>Limitations to Be Aware Of</h3>
          <p>
            Because this is a browser-based extraction tool (not a full layout converter),
            complex visual elements aren't carried over: multi-column layouts get
            linearized, embedded images aren't included, tables become loose text, and
            scanned PDFs (which contain images, not text) can't be processed without OCR.
            For pixel-perfect layout conversion, dedicated server-based tools are needed,
            but for the vast majority of "I just need the text in Word" use cases this
            converter is fast, free, and completely private.
          </p>
        </>
      }
      faqSection={<FAQ items={faqs} />}
    />
  );
};

export default PdfToWord;
