import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolPageShell } from "@/components/ToolPageShell";
import { FileDropzone } from "@/components/FileDropzone";
import { FAQ } from "@/components/FAQ";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Download, Loader2, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const faqs = [
  {
    question: "How do I specify which pages to delete?",
    answer:
      "Use a comma-separated list with single pages or ranges, e.g., '1, 3-5, 8'.",
  },
  {
    question: "Can I undo a deletion?",
    answer:
      "The downloaded file has the pages removed. Your original file is not modified — keep it as a backup.",
  },
  {
    question: "Are my files uploaded?",
    answer: "No. All processing happens in your browser.",
  },
];

function parsePagesToDelete(input: string, pageCount: number): Set<number> {
  const set = new Set<number>();
  for (const part of input.split(",").map((s) => s.trim()).filter(Boolean)) {
    if (part.includes("-")) {
      const [a, b] = part.split("-").map((n) => parseInt(n.trim(), 10));
      if (!isNaN(a) && !isNaN(b) && a >= 1 && b <= pageCount && a <= b) {
        for (let i = a; i <= b; i++) set.add(i - 1);
      }
    } else {
      const n = parseInt(part, 10);
      if (!isNaN(n) && n >= 1 && n <= pageCount) set.add(n - 1);
    }
  }
  return set;
}

const DeletePages = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [pages, setPages] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);

  const handleFiles = async (incoming: File[]) => {
    const f = incoming[0];
    setFiles([f]);
    try {
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setPageCount(pdf.getPageCount());
    } catch {
      toast({ title: "Could not read PDF", variant: "destructive" });
      setFiles([]);
    }
  };

  const handleDelete = async () => {
    if (!files[0]) return;
    const toDelete = parsePagesToDelete(pages, pageCount);
    if (!toDelete.size) {
      toast({
        title: "Invalid pages",
        description: `Enter pages between 1 and ${pageCount}, e.g. "1, 3-5".`,
        variant: "destructive",
      });
      return;
    }
    if (toDelete.size === pageCount) {
      toast({ title: "Cannot delete all pages", variant: "destructive" });
      return;
    }
    setProcessing(true);
    setProgress(10);
    try {
      const bytes = await files[0].arrayBuffer();
      const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const out = await PDFDocument.create();
      const keep = Array.from({ length: pageCount }, (_, i) => i).filter(
        (i) => !toDelete.has(i)
      );
      const copied = await out.copyPages(src, keep);
      copied.forEach((p) => out.addPage(p));
      setProgress(80);
      const data = await out.save();
      const blob = new Blob([data as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = files[0].name.replace(/\.pdf$/i, "") + "-trimmed.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setProgress(100);
      toast({
        title: "Pages deleted",
        description: `${toDelete.size} page(s) removed; ${keep.length} kept.`,
      });
    } catch (e) {
      console.error(e);
      toast({ title: "Delete failed", variant: "destructive" });
    } finally {
      setProcessing(false);
      setTimeout(() => setProgress(0), 1500);
    }
  };

  return (
    <ToolPageShell
      title="Delete PDF Pages — Remove Pages from PDF Free | PDFMaster Tools"
      description="Delete unwanted pages from a PDF online for free. Browser-based, secure, no signup required."
      h1="Delete Pages from PDF"
      intro="Remove specific pages from your PDF and download the trimmed file."
      faqSchema={faqs}
      toolUI={
        <div className="space-y-6">
          <FileDropzone
            files={files}
            onFiles={handleFiles}
            onRemove={() => {
              setFiles([]);
              setPageCount(0);
            }}
            cta="Drop a PDF here or click to upload"
            subtitle="One file at a time • Max 50MB"
          />

          {pageCount > 0 && (
            <div className="space-y-2">
              <Label htmlFor="pages">Pages to delete (PDF has {pageCount} pages)</Label>
              <Input
                id="pages"
                placeholder={`e.g., 1, 3-5, ${pageCount}`}
                value={pages}
                onChange={(e) => setPages(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Comma-separated list of single pages or ranges.
              </p>
            </div>
          )}

          {processing && <Progress value={progress} />}

          <Button
            size="lg"
            className="w-full"
            disabled={!files[0] || !pages || processing}
            onClick={handleDelete}
          >
            {processing ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Deleting...</>
            ) : (
              <><Trash2 className="h-4 w-4" /> Delete & Download</>
            )}
          </Button>
        </div>
      }
      seoContent={
        <>
          <h2>How to Delete Pages from a PDF</h2>
          <p>
            Need to remove a blank scan, a draft page, or confidential information
            before sharing a PDF? The Delete PDF Pages tool lets you specify exactly
            which pages to remove using simple range syntax. The tool keeps everything
            else intact — fonts, images, formatting, and embedded media are preserved
            in the downloaded file. Your original PDF stays untouched on your device.
          </p>
        </>
      }
      faqSection={<FAQ items={faqs} />}
    />
  );
};

export default DeletePages;
