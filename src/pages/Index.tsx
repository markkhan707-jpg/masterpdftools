import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { AdSlot } from "@/components/AdSlot";
import { FAQ } from "@/components/FAQ";
import { Button } from "@/components/ui/button";
import {
  Combine,
  Scissors,
  Minimize2,
  FileType2,
  Zap,
  ShieldCheck,
  Heart,
  ArrowRight,
} from "lucide-react";

const tools = [
  {
    to: "/merge-pdf",
    icon: Combine,
    title: "Merge PDF",
    description: "Combine multiple PDFs into one file in seconds.",
    color: "tool-merge",
  },
  {
    to: "/split-pdf",
    icon: Scissors,
    title: "Split PDF",
    description: "Extract pages or split a PDF into multiple files.",
    color: "tool-split",
  },
  {
    to: "/compress-pdf",
    icon: Minimize2,
    title: "Compress PDF",
    description: "Reduce PDF file size while keeping quality.",
    color: "tool-compress",
  },
  {
    to: "/pdf-to-word",
    icon: FileType2,
    title: "PDF to Word",
    description: "Extract PDF text into an editable .docx file.",
    color: "tool-convert",
  },
];

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Files are processed instantly in your browser — no waiting in queues.",
  },
  {
    icon: ShieldCheck,
    title: "100% Secure",
    description: "Your files never leave your device. Everything runs locally in your browser.",
  },
  {
    icon: Heart,
    title: "Free Forever",
    description: "All tools are completely free. No signup, no watermark, no limits.",
  },
];

const faqs = [
  {
    question: "Are these PDF tools really free?",
    answer:
      "Yes. Every tool on PDFMaster is 100% free with no hidden fees, no signups, and no watermarks added to your files.",
  },
  {
    question: "Is it safe to upload my PDFs?",
    answer:
      "Absolutely. All processing happens directly in your browser using JavaScript. Your files are never uploaded to any server.",
  },
  {
    question: "What is the maximum file size I can process?",
    answer:
      "You can process PDFs up to 50MB. For very large files, browser performance depends on your device's memory.",
  },
  {
    question: "Do I need to install any software?",
    answer:
      "No installation required. PDFMaster works entirely in your web browser on Windows, macOS, Linux, iOS, and Android.",
  },
];

const Index = () => (
  <Layout>
    <Seo
      title="PDFMaster Tools — Free Online PDF Tools: Merge, Split, Compress, Convert"
      description="All-in-one free PDF tools. Merge, split, compress, and convert PDFs instantly in your browser. Fast, secure, no signup required."
      faqSchema={faqs}
    />

    {/* Hero */}
    <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <div className="container mx-auto px-4 py-16 md:py-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-6">
          <Heart className="h-3 w-3" /> 100% Free • No Signup
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-3xl mx-auto leading-tight">
          All-in-One Free <span className="text-primary">PDF Tools</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Merge, Split, Compress & Convert PDFs instantly — right in your browser.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {tools.map((t) => (
            <Button key={t.to} asChild variant="outline" size="lg">
              <Link to={t.to}>
                <t.icon className="h-4 w-4" />
                {t.title}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </section>

    {/* Tools Grid */}
    <section id="tools" className="container mx-auto px-4 py-16 md:py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Choose Your Tool</h2>
        <p className="text-muted-foreground">Powerful PDF utilities at your fingertips.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {tools.map((t) => (
          <Link key={t.to} to={t.to} className="tool-card group block">
            <div
              className="h-12 w-12 rounded-xl flex items-center justify-center mb-4 text-white"
              style={{ backgroundColor: `hsl(var(--${t.color}))` }}
            >
              <t.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{t.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t.description}</p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
              Try it <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </section>

    <div className="container mx-auto px-4">
      <AdSlot label="Ad — Banner (728x90)" />
    </div>

    {/* Features */}
    <section className="container mx-auto px-4 py-16 md:py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Why Choose PDFMaster?</h2>
        <p className="text-muted-foreground">Built for speed, security, and simplicity.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {features.map((f) => (
          <div key={f.title} className="text-center p-6">
            <div className="h-14 w-14 rounded-2xl bg-accent text-primary mx-auto mb-4 flex items-center justify-center">
              <f.icon className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </section>

    {/* SEO Content */}
    <section className="bg-secondary/30 border-y border-border py-16 md:py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h2>The Complete Guide to Working with PDF Files Online</h2>
          <p>
            PDF (Portable Document Format) has become the universal standard for sharing
            documents across platforms, devices, and operating systems. Whether you're a
            student combining research papers, a business professional preparing reports, or
            someone managing personal documents, you need reliable PDF tools you can trust.
            PDFMaster Tools provides a complete suite of free, browser-based PDF utilities
            that work without installing software, creating accounts, or compromising your
            privacy.
          </p>

          <h3>How to Merge PDF Files Online</h3>
          <p>
            Merging PDFs is one of the most common tasks people need to perform. Whether
            you're combining invoices for monthly accounting, joining scanned pages into a
            single document, or assembling a portfolio, the process should be simple. With
            PDFMaster's <Link to="/merge-pdf">Merge PDF tool</Link>, you can drag and drop
            multiple PDF files, reorder them by simply dragging cards into the right
            sequence, and download the combined result in seconds. There's no limit on how
            many files you can merge in a session, and because everything happens locally in
            your browser, sensitive documents like contracts and tax forms never leave your
            device.
          </p>

          <h3>How to Compress PDFs Online Without Losing Quality</h3>
          <p>
            Large PDF files are a common headache — email providers reject attachments over
            a certain size, cloud storage fills up quickly, and uploads slow to a crawl.
            PDFMaster's <Link to="/compress-pdf">Compress PDF tool</Link> reduces file size
            by optimizing embedded images, stripping unnecessary metadata, and re-encoding
            content streams. You can choose between Low, Medium, and High compression
            levels depending on whether you prioritize quality or smaller file size. Most
            image-heavy PDFs can be reduced by 40–70% with virtually no visible quality
            loss, making them easier to email, upload, and archive.
          </p>

          <h3>Splitting PDFs and Extracting Specific Pages</h3>
          <p>
            Sometimes you only need a few pages from a long PDF — a single chapter from an
            ebook, a specific receipt from a bank statement, or a particular slide from a
            presentation. The <Link to="/split-pdf">Split PDF tool</Link> lets you extract
            individual pages or split a document into multiple files using flexible page
            ranges (e.g., 1-3, 5, 8-10). This is far more efficient than printing and
            re-scanning, and the output preserves the original PDF's formatting, fonts, and
            embedded images perfectly.
          </p>

          <h3>Converting PDF to Word for Easy Editing</h3>
          <p>
            PDFs are designed for sharing, not editing. When you need to modify content —
            update a resume, edit a report, or repurpose text from an article — converting
            to a Microsoft Word (.docx) file makes the job vastly easier. Our{" "}
            <Link to="/pdf-to-word">PDF to Word converter</Link> extracts text from your
            PDF and packages it into a clean, editable .docx file ready to open in Word,
            Google Docs, or LibreOffice.
          </p>

          <h3>Privacy and Security First</h3>
          <p>
            Most online PDF tools upload your files to remote servers, which raises serious
            concerns about data privacy — especially for contracts, medical records, and
            financial documents. PDFMaster takes a fundamentally different approach: every
            tool runs entirely in your browser using JavaScript and WebAssembly. Your files
            are never transmitted over the internet, never stored on our servers, and never
            seen by anyone but you. Close the tab and the files are gone. It's the safest
            way to work with sensitive PDFs online.
          </p>
        </article>
      </div>
    </section>

    {/* FAQ */}
    <section className="container mx-auto px-4 py-16 md:py-20">
      <FAQ items={faqs} />
    </section>
  </Layout>
);

export default Index;
