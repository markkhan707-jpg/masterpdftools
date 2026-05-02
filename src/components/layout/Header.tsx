import { Link, NavLink } from "react-router-dom";
import { FileText, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const primaryTools = [
  { to: "/merge-pdf", label: "Merge PDF" },
  { to: "/split-pdf", label: "Split PDF" },
  { to: "/compress-pdf", label: "Compress PDF" },
  { to: "/pdf-to-word", label: "PDF to Word" },
];

const moreTools = [
  { to: "/organize-pdf", label: "Organize PDF" },
  { to: "/rotate-pdf", label: "Rotate PDF" },
  { to: "/delete-pages", label: "Delete Pages" },
  { to: "/crop-pdf", label: "Crop PDF" },
  { to: "/page-numbers", label: "Page Numbers" },
  { to: "/watermark-pdf", label: "Watermark PDF" },
  { to: "/sign-pdf", label: "Sign PDF" },
  { to: "/protect-pdf", label: "Protect PDF" },
  { to: "/unlock-pdf", label: "Unlock PDF" },
  { to: "/jpg-to-pdf", label: "JPG to PDF" },
  { to: "/pdf-to-jpg", label: "PDF to JPG" },
  { to: "/grayscale-pdf", label: "Grayscale PDF" },
  { to: "/extract-text", label: "Extract Text" },
  { to: "/html-to-pdf", label: "HTML to PDF" },
];

const allTools = [...primaryTools, ...moreTools];

export const Header = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FileText className="h-5 w-5" />
          </span>
          <span>PDFMaster<span className="text-primary"> Tools</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {primaryTools.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-md transition-colors hover:text-primary ${
                  isActive ? "text-primary" : "text-foreground/70"
                }`
              }
            >
              {t.label}
            </NavLink>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger className="px-3 py-2 text-sm font-medium rounded-md text-foreground/70 hover:text-primary inline-flex items-center gap-1 outline-none">
              More <ChevronDown className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {moreTools.map((t) => (
                <DropdownMenuItem key={t.to} asChild>
                  <Link to={t.to}>{t.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="hidden md:block">
          <Button asChild variant="default" size="sm">
            <Link to="/merge-pdf">Get Started</Link>
          </Button>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {allTools.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-md ${
                    isActive ? "bg-accent text-primary" : "text-foreground/80"
                  }`
                }
              >
                {t.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
