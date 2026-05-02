import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolPageShell } from "@/components/ToolPageShell";
import { FileDropzone } from "@/components/FileDropzone";
import { FAQ } from "@/components/FAQ";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, ArrowDown, Download, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const faqs = [
  {
    question: "How do I merge PDF files for free?",
    answer:
      "Upload two or more PDF files, drag them into the order you want, then click Merge PDFs. Your combined file will download instantly. No signup or payment required.",
  },
  {
    question: "Is there a limit on the number of PDFs I can merge?",
    answer:
      "There is no hard limit, but very large combined files may use significant browser memory. For best performance, keep total size under 50MB.",
  },
  {
    question: "Are my PDF files uploaded to a server?",
    answer:
      "No. Merging happens entirely in your browser using the pdf-lib library. Your files never leave your device, ensuring complete privacy.",
  },
  {
    question: "Will the page order be preserved?",
    answer:
      "Yes. The pages from each PDF are appended in the exact order you arrange the files. Use the up/down arrows to reorder before merging.",
  },
];

const MergePdf = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);

  const addFiles = (newFiles: File[]) => setFiles((p) => [...p, ...newFiles]);
  const removeFile = (i: number) => setFiles((p) => p.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const next = [...files];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setFiles(next);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast({ title: "Add at least 2 PDFs", description: "You need 2 or more files to merge." });
      return;
    }
    setProcessing(true);
    setProgress(5);
    try {
      const merged = await PDFDocument.create();
      for (let i = 0; i < files.length; i++) {
        const bytes = await files[i].arrayBuffer();
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = await merged.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
        setProgress(10 + Math.round(((i + 1) / files.length) * 80));
      }
      const out = await merged.save();
      setProgress(95);
      const blob = new Blob([out], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setProgress(100);
      toast({ title: "Merge complete", description: "Your merged PDF has been downloaded." });
    } catch (e) {
      console.error(e);
      toast({
        title: "Merge failed",
        description: "One of your files may be corrupted or password-protected.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
      setTimeout(() => setProgress(0), 1500);
    }
  };

  return (
    <ToolPageShell
      title="Merge PDF — Combine PDF Files Online Free | PDFMaster Tools"
      description="Merge PDF files online for free. Combine multiple PDFs into one document in seconds. Secure, fast, no signup."
      h1="Merge PDF Files Online"
      intro="Combine multiple PDFs into a single document. Drag, drop, reorder, and merge — all in your browser."
      faqSchema={faqs}
      toolUI={
        <div className="space-y-6">
          <FileDropzone
            multiple
            files={[]}
            onFiles={addFiles}
            cta="Drop PDF files here or click to upload"
            subtitle="Select 2 or more PDFs • Max 50MB each"
          />

          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">{files.length} file(s) — drag to reorder:</p>
              {files.map((f, i) => (
                <div
                  key={`${f.name}-${i}`}
                  className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3"
                >
                  <span className="text-xs font-mono w-6 text-muted-foreground">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{f.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(f.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => move(i, -1)} disabled={i === 0}>
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => move(i, 1)}
                      disabled={i === files.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => removeFile(i)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {processing && <Progress value={progress} />}

          <Button
            size="lg"
            className="w-full"
            disabled={files.length < 2 || processing}
            onClick={handleMerge}
          >
            {processing ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Merging...</>
            ) : (
              <><Download className="h-4 w-4" /> Merge PDFs & Download</>
            )}
          </Button>
        </div>
      }
      seoContent={
        <>
          <h2>How to Merge PDF Files Online</h2>
          <p>
            Combining several PDF documents into one unified file is one of the most common
            office tasks. Whether you need to bundle invoices, consolidate research papers,
            or compile a multi-section report, merging PDFs eliminates the hassle of
            sending multiple attachments and makes your documents easier to share, store,
            and print. PDFMaster's online Merge PDF tool makes this process effortless,
            free, and completely private.
          </p>
          <h3>Step-by-Step: Merging PDFs</h3>
          <p>
            <strong>1. Upload your PDFs.</strong> Click the upload area or drag and drop
            two or more PDF files. You can add files in batches — each new upload appends
            to the existing list.
          </p>
          <p>
            <strong>2. Arrange the order.</strong> Use the up and down arrows to put the
            files in the order you want them combined. The pages of each PDF are appended
            sequentially in the order shown.
          </p>
          <p>
            <strong>3. Click Merge.</strong> Press the "Merge PDFs &amp; Download" button.
            The tool processes everything locally in your browser and immediately downloads
            the combined file as <code>merged.pdf</code>.
          </p>
          <h3>Why Merge PDFs in Your Browser?</h3>
          <p>
            Most online merge tools upload your files to remote servers, where they may be
            cached, logged, or scanned. For confidential documents — contracts, medical
            records, tax returns — this is a significant privacy risk. PDFMaster uses{" "}
            <code>pdf-lib</code> to perform all merging directly in your browser using
            JavaScript. Your files never leave your device, are never transmitted over the
            internet, and disappear from memory when you close the tab.
          </p>
          <h3>Common Use Cases</h3>
          <p>
            Combine multiple scanned pages into a single contract; assemble monthly
            invoices into a quarterly report; merge separate book chapters into one
            manuscript; bundle application forms with supporting documents; consolidate
            meeting notes from multiple sessions; combine receipts for expense
            reimbursement; or join exported pages from different sources into a unified
            archive.
          </p>
        </>
      }
      faqSection={<FAQ items={faqs} />}
    />
  );
};

export default MergePdf;
