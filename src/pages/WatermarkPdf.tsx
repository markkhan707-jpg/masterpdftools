import { useState } from "react";
import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";
import { ToolPageShell } from "@/components/ToolPageShell";
import { FileDropzone } from "@/components/FileDropzone";
import { FAQ } from "@/components/FAQ";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Download, Loader2, Stamp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const faqs = [
  {
    question: "Can I add an image watermark?",
    answer:
      "This tool adds text watermarks. For image watermarks (logos), we recommend a desktop PDF editor.",
  },
  {
    question: "Will the watermark appear on every page?",
    answer:
      "Yes, the diagonal watermark text is applied to every page of the PDF.",
  },
  {
    question: "Can the watermark be removed?",
    answer:
      "Watermarks added by this tool are part of the page content and cannot be easily removed by ordinary users.",
  },
];

const WatermarkPdf = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState([30]);
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);

  const handleAdd = async () => {
    if (!files[0]) return;
    if (!text.trim()) {
      toast({ title: "Watermark text required", variant: "destructive" });
      return;
    }
    setProcessing(true);
    setProgress(10);
    try {
      const bytes = await files[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const font = await pdf.embedFont(StandardFonts.HelveticaBold);
      const pages = pdf.getPages();
      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const size = Math.min(width, height) / 8;
        const w = font.widthOfTextAtSize(text, size);
        page.drawText(text, {
          x: width / 2 - w / 2,
          y: height / 2,
          size,
          font,
          color: rgb(0.7, 0.1, 0.1),
          opacity: opacity[0] / 100,
          rotate: degrees(45),
        });
      });
      setProgress(80);
      const out = await pdf.save();
      const blob = new Blob([out as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = files[0].name.replace(/\.pdf$/i, "") + "-watermarked.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setProgress(100);
      toast({ title: "Watermark added", description: "File downloaded." });
    } catch (e) {
      console.error(e);
      toast({ title: "Failed to add watermark", variant: "destructive" });
    } finally {
      setProcessing(false);
      setTimeout(() => setProgress(0), 1500);
    }
  };

  return (
    <ToolPageShell
      title="Watermark PDF — Add Text Watermark Free | PDFMaster Tools"
      description="Add a diagonal text watermark to every page of your PDF online. Free, browser-based, secure."
      h1="Add Watermark to PDF"
      intro="Stamp every page of your PDF with a custom diagonal text watermark."
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

          <div className="space-y-2">
            <Label htmlFor="text">Watermark text</Label>
            <Input
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={50}
              placeholder="e.g., CONFIDENTIAL"
            />
          </div>

          <div className="space-y-2">
            <Label>Opacity: {opacity[0]}%</Label>
            <Slider value={opacity} onValueChange={setOpacity} min={10} max={80} step={5} />
          </div>

          {processing && <Progress value={progress} />}

          <Button
            size="lg"
            className="w-full"
            disabled={!files[0] || processing}
            onClick={handleAdd}
          >
            {processing ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Adding...</>
            ) : (
              <><Stamp className="h-4 w-4" /> Add Watermark</>
            )}
          </Button>
        </div>
      }
      seoContent={
        <>
          <h2>How to Watermark a PDF Online</h2>
          <p>
            Watermarks are essential for marking documents as drafts, confidential,
            or copyrighted. PDFMaster's free Watermark PDF tool stamps your chosen
            text diagonally across every page in semi-transparent red — clearly
            visible without obscuring the content underneath. All processing is done
            locally in your browser, so even highly sensitive documents stay private.
          </p>
        </>
      }
      faqSection={<FAQ items={faqs} />}
    />
  );
};

export default WatermarkPdf;
