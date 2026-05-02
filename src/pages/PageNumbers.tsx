import { useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { ToolPageShell } from "@/components/ToolPageShell";
import { FileDropzone } from "@/components/FileDropzone";
import { FAQ } from "@/components/FAQ";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Loader2, Hash } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const faqs = [
  {
    question: "Where will the page numbers appear?",
    answer:
      "You can choose between bottom-center, bottom-right, bottom-left, top-center, top-right, or top-left. The default is bottom-center.",
  },
  {
    question: "Will it modify the original file?",
    answer:
      "No. You'll download a new PDF with numbers added; the original stays untouched.",
  },
  {
    question: "Is processing private?",
    answer:
      "Yes. All work happens in your browser — nothing is uploaded.",
  },
];

type Position = "bc" | "br" | "bl" | "tc" | "tr" | "tl";

const PageNumbers = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [position, setPosition] = useState<Position>("bc");
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);

  const handleAdd = async () => {
    if (!files[0]) return;
    setProcessing(true);
    setProgress(10);
    try {
      const bytes = await files[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();
      const total = pages.length;
      pages.forEach((page, i) => {
        const text = `${i + 1} / ${total}`;
        const size = 11;
        const width = font.widthOfTextAtSize(text, size);
        const { width: pw, height: ph } = page.getSize();
        const margin = 24;
        let x = pw / 2 - width / 2;
        let y = margin;
        if (position[0] === "t") y = ph - margin - size;
        if (position[1] === "l") x = margin;
        if (position[1] === "r") x = pw - margin - width;
        page.drawText(text, { x, y, size, font, color: rgb(0.3, 0.3, 0.3) });
      });
      setProgress(80);
      const out = await pdf.save();
      const blob = new Blob([out as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = files[0].name.replace(/\.pdf$/i, "") + "-numbered.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setProgress(100);
      toast({ title: "Page numbers added", description: "File downloaded." });
    } catch (e) {
      console.error(e);
      toast({ title: "Failed to add page numbers", variant: "destructive" });
    } finally {
      setProcessing(false);
      setTimeout(() => setProgress(0), 1500);
    }
  };

  return (
    <ToolPageShell
      title="Add Page Numbers to PDF — Free Online | PDFMaster Tools"
      description="Add page numbers to PDF files online for free. Choose position and download instantly. Browser-based and private."
      h1="Add Page Numbers to PDF"
      intro="Number every page of your PDF in the position you choose."
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
            <Label>Position</Label>
            <Select value={position} onValueChange={(v) => setPosition(v as Position)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bc">Bottom center</SelectItem>
                <SelectItem value="bl">Bottom left</SelectItem>
                <SelectItem value="br">Bottom right</SelectItem>
                <SelectItem value="tc">Top center</SelectItem>
                <SelectItem value="tl">Top left</SelectItem>
                <SelectItem value="tr">Top right</SelectItem>
              </SelectContent>
            </Select>
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
              <><Hash className="h-4 w-4" /> Add Page Numbers</>
            )}
          </Button>
        </div>
      }
      seoContent={
        <>
          <h2>Why Add Page Numbers to a PDF</h2>
          <p>
            Page numbers are essential for reports, theses, contracts, and any
            multi-page document where readers need to reference specific sections.
            Adding them after the fact — when your source file didn't include them —
            normally requires opening Word, Adobe Acrobat, or another paid editor.
            With this tool you can do it in seconds, right in your browser, with zero
            uploads. The numbers appear in a clean grey "current / total" format.
          </p>
        </>
      }
      faqSection={<FAQ items={faqs} />}
    />
  );
};

export default PageNumbers;
