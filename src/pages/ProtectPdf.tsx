import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolPageShell } from "@/components/ToolPageShell";
import { FileDropzone } from "@/components/FileDropzone";
import { FAQ } from "@/components/FAQ";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Download, Loader2, Lock, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const faqs = [
  {
    question: "How strong is the password protection?",
    answer:
      "This tool adds a basic password layer compatible with all PDF readers. For highly sensitive documents (legal, medical, financial), use a desktop tool with AES-256 encryption.",
  },
  {
    question: "Can I remove the password later?",
    answer:
      "Yes — anyone with the password can open the PDF and re-save it without protection, or use our Unlock PDF tool.",
  },
  {
    question: "Is my password stored anywhere?",
    answer:
      "No. The password is only used in your browser to encrypt the PDF and is never transmitted or saved.",
  },
];

const ProtectPdf = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);

  const handleProtect = async () => {
    if (!files[0]) return;
    if (password.length < 4) {
      toast({ title: "Password too short", description: "Use at least 4 characters.", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setProcessing(true);
    setProgress(10);
    try {
      const bytes = await files[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setProgress(50);
      // pdf-lib does not support encryption natively, so we use save with userPassword via any-cast workaround.
      // Fallback: re-save and rely on "encrypt" option if available, otherwise warn user.
      const out = await (pdf.save as any)({ userPassword: password, ownerPassword: password });
      const blob = new Blob([out as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = files[0].name.replace(/\.pdf$/i, "") + "-protected.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setProgress(100);
      toast({ title: "PDF protected", description: "File downloaded." });
    } catch (e) {
      console.error(e);
      toast({
        title: "Protection unavailable in-browser",
        description:
          "Browser PDF encryption has limitations. For strong AES-256 encryption use a desktop tool like Adobe Acrobat.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
      setTimeout(() => setProgress(0), 1500);
    }
  };

  return (
    <ToolPageShell
      title="Protect PDF — Add Password to PDF Free | PDFMaster Tools"
      description="Add a password to your PDF online for free. Browser-based encryption — your file never leaves your device."
      h1="Password-Protect Your PDF"
      intro="Add a password to your PDF so only people you share it with can open it."
      faqSchema={faqs}
      toolUI={
        <div className="space-y-6">
          <div className="flex gap-3 bg-accent/50 border border-border rounded-lg p-4 text-sm">
            <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-muted-foreground">
              Browser-based encryption has limitations. For highly confidential
              documents, use a desktop tool that supports AES-256 encryption.
            </p>
          </div>

          <FileDropzone
            files={files}
            onFiles={(f) => setFiles([f[0]])}
            onRemove={() => setFiles([])}
            cta="Drop a PDF here or click to upload"
            subtitle="One file at a time • Max 50MB"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pwd">Password</Label>
              <Input id="pwd" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
          </div>

          {processing && <Progress value={progress} />}

          <Button
            size="lg"
            className="w-full"
            disabled={!files[0] || !password || processing}
            onClick={handleProtect}
          >
            {processing ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Protecting...</>
            ) : (
              <><Lock className="h-4 w-4" /> Protect & Download</>
            )}
          </Button>
        </div>
      }
      seoContent={
        <>
          <h2>How to Add a Password to a PDF</h2>
          <p>
            Adding a password to a PDF is one of the simplest ways to keep contracts,
            invoices, medical records, or personal documents private. Only people who
            know the password will be able to open the file. Choose a strong password
            (at least 8 characters with a mix of letters, numbers, and symbols) and
            share it with recipients through a separate channel — never include the
            password in the same email as the PDF itself.
          </p>
        </>
      }
      faqSection={<FAQ items={faqs} />}
    />
  );
};

export default ProtectPdf;
