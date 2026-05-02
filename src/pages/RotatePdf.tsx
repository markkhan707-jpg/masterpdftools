import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { ToolPageShell } from "@/components/ToolPageShell";
import { FileDropzone } from "@/components/FileDropzone";
import { FAQ } from "@/components/FAQ";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download, Loader2, RotateCw, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const faqs = [
  {
    question: "Can I rotate just one page or all pages?",
    answer:
      "This tool rotates every page of the PDF by the angle you choose. To rotate specific pages only, use Split PDF first to extract them.",
  },
  {
    question: "Does rotating reduce quality?",
    answer:
      "No. Rotation only changes page metadata, not the underlying content. Quality is preserved exactly.",
  },
  {
    question: "Are my files uploaded?",
    answer:
      "No. Rotation runs entirely in your browser. Your PDF never leaves your device.",
  },
];

const RotatePdf = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [angle, setAngle] = useState<90 | 180 | 270>(90);
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);

  const handleRotate = async () => {
    if (!files[0]) return;
    setProcessing(true);
    setProgress(10);
    try {
      const bytes = await files[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pages = pdf.getPages();
      pages.forEach((p) => {
        const current = p.getRotation().angle;
        p.setRotation(degrees((current + angle) % 360));
      });
      setProgress(80);
      const out = await pdf.save();
      const blob = new Blob([out as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = files[0].name.replace(/\.pdf$/i, "") + "-rotated.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setProgress(100);
      toast({ title: "Rotation complete", description: "File downloaded." });
    } catch (e) {
      console.error(e);
      toast({ title: "Rotation failed", variant: "destructive" });
    } finally {
      setProcessing(false);
      setTimeout(() => setProgress(0), 1500);
    }
  };

  return (
    <ToolPageShell
      title="Rotate PDF — Free Online PDF Rotator | PDFMaster Tools"
      description="Rotate PDF pages 90, 180, or 270 degrees online for free. Browser-based, secure, no signup required."
      h1="Rotate PDF Online"
      intro="Rotate every page of your PDF clockwise or counter-clockwise. Fast, free, and private."
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

          <div className="grid grid-cols-3 gap-3">
            <Button
              variant={angle === 270 ? "default" : "outline"}
              onClick={() => setAngle(270)}
            >
              <RotateCcw className="h-4 w-4" /> 90° Left
            </Button>
            <Button
              variant={angle === 180 ? "default" : "outline"}
              onClick={() => setAngle(180)}
            >
              180°
            </Button>
            <Button
              variant={angle === 90 ? "default" : "outline"}
              onClick={() => setAngle(90)}
            >
              <RotateCw className="h-4 w-4" /> 90° Right
            </Button>
          </div>

          {processing && <Progress value={progress} />}

          <Button
            size="lg"
            className="w-full"
            disabled={!files[0] || processing}
            onClick={handleRotate}
          >
            {processing ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Rotating...</>
            ) : (
              <><Download className="h-4 w-4" /> Rotate & Download</>
            )}
          </Button>
        </div>
      }
      seoContent={
        <>
          <h2>How to Rotate a PDF Online</h2>
          <p>
            Sometimes scanned or downloaded PDFs come in the wrong orientation —
            sideways, upside down, or rotated incorrectly by a scanner. The Rotate PDF
            tool lets you fix that with a single click. Choose 90° left, 180°, or 90°
            right and download the corrected file instantly. Because rotation only
            updates the page metadata, file size and quality stay exactly the same.
          </p>
          <h3>When to Use This Tool</h3>
          <ul>
            <li>Fixing scanned documents that came out sideways</li>
            <li>Correcting photos of receipts saved as PDFs</li>
            <li>Reorienting landscape pages to portrait for printing</li>
            <li>Preparing PDFs for proper display on tablets and e-readers</li>
          </ul>
        </>
      }
      faqSection={<FAQ items={faqs} />}
    />
  );
};

export default RotatePdf;
