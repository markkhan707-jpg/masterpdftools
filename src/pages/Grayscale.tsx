import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { PDFDocument } from "pdf-lib";
import { ToolPageShell } from "@/components/ToolPageShell";
import { FileDropzone } from "@/components/FileDropzone";
import { FAQ } from "@/components/FAQ";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download, Loader2, Contrast } from "lucide-react";
import { toast } from "@/hooks/use-toast";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const faqs = [
  {
    question: "Why convert a PDF to grayscale?",
    answer:
      "Grayscale PDFs print much cheaper on color laser printers, are smaller in size, and look great for documents where color isn't needed.",
  },
  {
    question: "Will the file get smaller?",
    answer:
      "Often yes — pages are re-encoded as grayscale JPEGs, which usually reduces file size significantly.",
  },
  {
    question: "Is text still selectable?",
    answer:
      "No. Because pages are rasterized to images, the result is a visual copy. Use the original PDF for editing.",
  },
];

const Grayscale = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);

  const handleConvert = async () => {
    if (!files[0]) return;
    setProcessing(true);
    setProgress(5);
    try {
      const bytes = await files[0].arrayBuffer();
      const src = await pdfjsLib.getDocument({ data: bytes }).promise;
      const out = await PDFDocument.create();

      for (let i = 1; i <= src.numPages; i++) {
        const page = await src.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;

        // Convert to grayscale
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imgData.data;
        for (let p = 0; p < d.length; p += 4) {
          const g = d[p] * 0.299 + d[p + 1] * 0.587 + d[p + 2] * 0.114;
          d[p] = d[p + 1] = d[p + 2] = g;
        }
        ctx.putImageData(imgData, 0, 0);

        const jpgUrl = canvas.toDataURL("image/jpeg", 0.85);
        const jpgBytes = await (await fetch(jpgUrl)).arrayBuffer();
        const img = await out.embedJpg(jpgBytes);
        const newPage = out.addPage([viewport.width, viewport.height]);
        newPage.drawImage(img, { x: 0, y: 0, width: viewport.width, height: viewport.height });
        setProgress(10 + Math.round((i / src.numPages) * 80));
      }

      const data = await out.save();
      const blob = new Blob([data as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = files[0].name.replace(/\.pdf$/i, "") + "-grayscale.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setProgress(100);
      toast({ title: "Conversion complete", description: "Grayscale PDF downloaded." });
    } catch (e) {
      console.error(e);
      toast({ title: "Conversion failed", variant: "destructive" });
    } finally {
      setProcessing(false);
      setTimeout(() => setProgress(0), 1500);
    }
  };

  return (
    <ToolPageShell
      title="PDF to Grayscale — Convert PDF to Black & White Free | PDFMaster Tools"
      description="Convert color PDFs to grayscale online for free. Save ink on printing, reduce file size, browser-based."
      h1="PDF to Grayscale"
      intro="Convert a color PDF into grayscale (black & white) for cheaper printing and smaller files."
      faqSchema={faqs}
      toolUI={
        <div className="space-y-6">
          <FileDropzone
            files={files}
            onFiles={(f) => setFiles([f[0]])}
            onRemove={() => setFiles([])}
            cta="Drop a PDF here or click to upload"
            subtitle="One file at a time • Max 50MB"
          />

          {processing && <Progress value={progress} />}

          <Button size="lg" className="w-full" disabled={!files[0] || processing} onClick={handleConvert}>
            {processing ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Converting...</>
            ) : (
              <><Contrast className="h-4 w-4" /> Convert to Grayscale</>
            )}
          </Button>
        </div>
      }
      seoContent={
        <>
          <h2>Why Convert PDFs to Grayscale</h2>
          <p>
            Many office printers charge per color page or use ink faster on color
            output. Converting a PDF to grayscale before printing cuts cost and waste
            without losing readability. The tool rasterizes each page, applies a
            luminance-based grayscale conversion, and rebuilds the PDF — so the result
            looks like a clean photocopy.
          </p>
        </>
      }
      faqSection={<FAQ items={faqs} />}
    />
  );
};

export default Grayscale;
