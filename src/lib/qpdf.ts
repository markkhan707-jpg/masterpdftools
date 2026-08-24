// qpdf (the industry-standard PDF transformation engine) compiled to WebAssembly.
// Used for true, lossless decryption of encrypted PDFs — including AES-256 (R6),
// AES-128 (R4) and legacy RC4 — while preserving vector text, fonts and structure.
//
// Everything runs locally in the browser; no file or password ever leaves the device.

// @ts-expect-error - no bundled types
import createQpdfModule from "@jspawn/qpdf-wasm/qpdf.mjs";
import qpdfWasmUrl from "@jspawn/qpdf-wasm/qpdf.wasm?url";

interface QpdfModule {
  FS: {
    writeFile: (path: string, data: Uint8Array) => void;
    readFile: (path: string) => Uint8Array;
    unlink: (path: string) => void;
  };
  callMain: (args: string[]) => number;
}

const createModule = async (): Promise<QpdfModule> => {
  const logs: string[] = [];
  const mod = await createQpdfModule({
    noInitialRun: true,
    locateFile: (path: string) => (path.endsWith(".wasm") ? qpdfWasmUrl : path),
    print: (line: string) => logs.push(line),
    printErr: (line: string) => logs.push(line),
  });
  (mod as any).__logs = logs;
  return mod as QpdfModule;
};

export class QpdfPasswordError extends Error {
  constructor(message = "Invalid password") {
    super(message);
    this.name = "QpdfPasswordError";
  }
}

/**
 * Run qpdf with the given arguments against a single input file.
 * Returns the bytes written to the output path.
 */
const runQpdf = async (input: Uint8Array, args: (inPath: string, outPath: string) => string[]) => {
  const mod = await createModule();
  const inPath = "/input.pdf";
  const outPath = "/output.pdf";
  mod.FS.writeFile(inPath, input);

  let code = 0;
  try {
    code = mod.callMain(args(inPath, outPath));
  } catch (e: any) {
    // Emscripten throws ExitStatus for non-zero exits.
    code = typeof e?.status === "number" ? e.status : 2;
  }

  const logs: string = ((mod as any).__logs || []).join("\n").toLowerCase();

  // qpdf exit code 3 = warnings only (output is still written and valid).
  if (code !== 0 && code !== 3) {
    if (logs.includes("password")) throw new QpdfPasswordError();
    throw new Error(((mod as any).__logs || []).join("\n") || `qpdf exited with code ${code}`);
  }

  try {
    return mod.FS.readFile(outPath);
  } catch {
    if (logs.includes("password")) throw new QpdfPasswordError();
    throw new Error("qpdf produced no output");
  }
};

/**
 * Fully decrypt a PDF, removing the user (open) password, the owner password
 * and all permission restrictions. Lossless — text stays selectable.
 */
export const qpdfDecrypt = async (input: ArrayBuffer | Uint8Array, password = "") => {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  return await runQpdf(bytes, (inPath, outPath) => [
    `--password=${password}`,
    "--decrypt",
    "--stream-data=preserve",
    "--object-streams=preserve",
    inPath,
    outPath,
  ]);
};

/**
 * Encrypt a PDF with AES-256 using qpdf's reference implementation.
 */
export const qpdfEncryptAes256 = async (
  input: ArrayBuffer | Uint8Array,
  userPassword: string,
  ownerPassword: string,
  opts?: { allowPrinting?: boolean; allowModify?: boolean; allowExtract?: boolean }
) => {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  return await runQpdf(bytes, (inPath, outPath) => [
    "--encrypt",
    userPassword,
    ownerPassword,
    "256",
    `--print=${opts?.allowPrinting === false ? "none" : "full"}`,
    `--modify=${opts?.allowModify ? "all" : "none"}`,
    `--extract=${opts?.allowExtract ? "y" : "n"}`,
    "--",
    inPath,
    outPath,
  ]);
};
