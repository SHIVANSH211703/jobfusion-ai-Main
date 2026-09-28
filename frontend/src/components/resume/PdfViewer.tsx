"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Minimize2,
  FileText,
  AlertTriangle,
  Loader2,
  FileQuestion,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import resumeService from "@/services/resume.service";
import { toast } from "sonner";
import type { PDFDocumentProxy, RenderTask, PDFPageProxy } from "pdfjs-dist";

interface PdfViewerProps {
  isOpen: boolean;
  onClose: () => void;
  resumeId: string;
  title: string;
  fileType?: string | null;
  fileUrl?: string | null;
  hasFile?: boolean;
}

export default function PdfViewer({
  isOpen,
  onClose,
  resumeId,
  title,
  fileType,
  fileUrl,
  hasFile,
}: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const isDocx =
    fileType?.toLowerCase() === "docx" ||
    fileType?.toLowerCase() === "doc" ||
    fileUrl?.endsWith(".docx") ||
    fileUrl?.endsWith(".doc");

  const isMissingFile = hasFile === false && !fileUrl;
  const shouldLoadPdf = isOpen && !isDocx && !isMissingFile;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDocLoaded, setIsDocLoaded] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const viewerAreaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);

  const showLoading = shouldLoadPdf && (isLoading || (!isDocLoaded && !errorMessage));

  // Handle Download
  const handleDownload = useCallback(async () => {
    try {
      setIsDownloading(true);
      const ext = fileType || (isDocx ? "docx" : "pdf");
      const filename = `${title.replace(/[^a-zA-Z0-9_-]/g, "_") || "Resume"}.${ext}`;
      await resumeService.downloadResumeFile(resumeId, filename);
      toast.success("Download started");
    } catch {
      toast.error("Failed to download resume file.");
    } finally {
      setIsDownloading(false);
    }
  }, [resumeId, title, fileType, isDocx]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Fullscreen not supported or blocked
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Load PDF Document
  useEffect(() => {
    if (!isOpen || !shouldLoadPdf) {
      return;
    }

    let isMounted = true;

    const loadPdf = async () => {
      setIsLoading(true);
      setIsDocLoaded(false);
      setErrorMessage(null);
      setCurrentPage(1);

      try {
        const [arrayBuffer, pdfjsLib] = await Promise.all([
          resumeService.getResumeFileArrayBuffer(resumeId),
          import("pdfjs-dist"),
        ]);

        if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
        }

        if (!isMounted) return;

        if (!arrayBuffer || arrayBuffer.byteLength === 0) {
          throw new Error("Received empty resume file from server.");
        }

        const uint8Data = new Uint8Array(arrayBuffer);
        const isPdfMagic =
          uint8Data[0] === 0x25 &&
          uint8Data[1] === 0x50 &&
          uint8Data[2] === 0x44 &&
          uint8Data[3] === 0x46 &&
          uint8Data[4] === 0x2d;

        if (!isPdfMagic) {
          try {
            const text = new TextDecoder().decode(uint8Data.slice(0, 1024));
            const json = JSON.parse(text);
            if (json.message) {
              throw new Error(json.message);
            }
          } catch (e: unknown) {
            if (e instanceof Error && e.message !== "Received empty resume file from server.") {
              throw e;
            }
          }
          throw new Error("File format is not a valid PDF document.");
        }

        const loadingTask = pdfjsLib.getDocument({
          data: uint8Data,
          cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
          cMapPacked: true,
        });

        const doc = await loadingTask.promise;
        if (!isMounted) return;

        pdfDocRef.current = doc;
        setNumPages(doc.numPages);
        setIsDocLoaded(true);
        setIsLoading(false);
      } catch (err: unknown) {
        if (!isMounted) return;
        setIsLoading(false);
        setIsDocLoaded(false);
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Unable to preview this PDF."
        );
      }
    };

    loadPdf();

    return () => {
      isMounted = false;
      if (pdfDocRef.current) {
        pdfDocRef.current.destroy();
        pdfDocRef.current = null;
      }
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // Ignore cancellation errors
        }
      }
    };
  }, [isOpen, resumeId, shouldLoadPdf]);

  // Calculate base scale to fit viewer area width
  const calculateBaseFit = useCallback(
    async (page: PDFPageProxy) => {
      if (!viewerAreaRef.current) return 1.0;
      const unscaledViewport = page.getViewport({ scale: 1.0 });
      const containerWidth = viewerAreaRef.current.clientWidth - 48; // padding
      if (containerWidth <= 0) return 1.0;

      // Fit to container width, capped at 1.4
      const fitScale = Math.min(containerWidth / unscaledViewport.width, 1.4);
      return Math.max(fitScale, 0.4);
    },
    []
  );

  // Render current page onto canvas
  const renderPage = useCallback(
    async (pageNum: number) => {
      if (!pdfDocRef.current || !canvasRef.current) return;

      try {
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch {
            // Ignore cancel
          }
        }

        const page = await pdfDocRef.current.getPage(pageNum);
        const fitScale = await calculateBaseFit(page);

        const currentEffectiveScale = fitScale * scale;
        const viewport = page.getViewport({ scale: currentEffectiveScale });

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        const transform =
          outputScale !== 1
            ? [outputScale, 0, 0, outputScale, 0, 0]
            : undefined;

        const renderContext = {
          canvasContext: context,
          viewport,
          transform,
        };

        const task = page.render(renderContext);
        renderTaskRef.current = task;
        await task.promise;
      } catch (err: unknown) {
        if (
          err &&
          typeof err === "object" &&
          "name" in err &&
          err.name === "RenderingCancelledException"
        ) {
          return;
        }
        // Non-fatal page render issue
      }
    },
    [scale, calculateBaseFit]
  );

  // Trigger render when page or scale changes
  useEffect(() => {
    if (isDocLoaded && !errorMessage && !isDocx && !isMissingFile) {
      renderPage(currentPage);
    }
  }, [isDocLoaded, currentPage, scale, errorMessage, isDocx, isMissingFile, renderPage]);

  // Handle window resize for dynamic base scale
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (isDocLoaded && !errorMessage) {
          renderPage(currentPage);
        }
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [currentPage, errorMessage, isDocLoaded, renderPage]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
      } else if (e.key === "ArrowRight" || e.key === "PageDown") {
        if (numPages) {
          setCurrentPage((prev) => Math.min(prev + 1, numPages));
        }
      } else if (e.key === "+" || e.key === "=") {
        setScale((prev) => Math.min(prev + 0.2, 2.5));
      } else if (e.key === "-") {
        setScale((prev) => Math.max(prev - 0.2, 0.6));
      } else if (e.key === "0") {
        setScale(1.0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, numPages, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Resume PDF Viewer"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        ref={containerRef}
        className="relative flex h-full w-full flex-col bg-card shadow-2xl transition-all sm:h-[94vh] sm:w-[96vw] sm:max-w-5xl sm:rounded-2xl sm:border sm:border-border/80 overflow-hidden"
      >
        {/* HEADER TOOLBAR */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/80 bg-card/95 px-3 sm:px-6 backdrop-blur">
          {/* Left: Document info */}
          <div className="flex items-center gap-2.5 min-w-0 mr-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-foreground sm:text-base">
                {title || "Resume.pdf"}
              </h2>
              {numPages && (
                <p className="text-[11px] text-muted-foreground hidden sm:block">
                  PDF Document • {numPages} {numPages === 1 ? "page" : "pages"}
                </p>
              )}
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Zoom Controls (hidden for non-PDF) */}
            {!isDocx && !isMissingFile && !errorMessage && (
              <div className="flex items-center rounded-lg border border-border/60 bg-muted/40 p-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground"
                  onClick={() => setScale((prev) => Math.max(prev - 0.2, 0.6))}
                  disabled={scale <= 0.6 || isLoading}
                  aria-label="Zoom out"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </Button>

                <button
                  type="button"
                  onClick={() => setScale(1.0)}
                  className="px-2 text-xs font-medium tabular-nums text-foreground/80 hover:text-foreground"
                  aria-label="Reset zoom"
                  title="Click to reset zoom"
                >
                  {Math.round(scale * 100)}%
                </button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground"
                  onClick={() => setScale((prev) => Math.min(prev + 0.2, 2.5))}
                  disabled={scale >= 2.5 || showLoading}
                  aria-label="Zoom in"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}

            {/* Reset Zoom icon on desktop */}
            {!isDocx && !isMissingFile && !errorMessage && scale !== 1.0 && (
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:inline-flex h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setScale(1.0)}
                aria-label="Reset zoom level"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}

            {/* Fullscreen Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hidden sm:inline-flex"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>

            {/* Download */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 rounded-lg text-xs"
              onClick={handleDownload}
              disabled={isDownloading}
              aria-label="Download resume"
            >
              {isDownloading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              <span className="hidden md:inline">Download</span>
            </Button>

            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={onClose}
              aria-label="Close PDF viewer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* MAIN VIEWER AREA */}
        <main
          ref={viewerAreaRef}
          className="relative flex-1 overflow-auto bg-muted/20 p-4 sm:p-8 flex items-center justify-center overscroll-contain"
        >
          {/* Loading State */}
          {showLoading && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center animate-in fade-in duration-300">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium text-muted-foreground">
                Loading resume...
              </p>
            </div>
          )}

          {/* Error State */}
          {!showLoading && errorMessage && (
            <div className="flex max-w-sm flex-col items-center justify-center gap-4 text-center py-12 px-6 rounded-2xl border border-destructive/20 bg-card shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Unable to preview this PDF
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  The document could not be rendered in the browser. You can still download the original file.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Resume</span>
                </Button>
                <Button size="sm" variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          )}

          {/* Missing File State */}
          {!isLoading && isMissingFile && (
            <div className="flex max-w-sm flex-col items-center justify-center gap-4 text-center py-12 px-6 rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <FileQuestion className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  No PDF attached
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  This resume was created in the builder and does not have an uploaded original file.
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          )}

          {/* Unsupported DOCX State */}
          {!isLoading && isDocx && (
            <div className="flex max-w-sm flex-col items-center justify-center gap-4 text-center py-12 px-6 rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  DOCX Preview Unavailable
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  In-browser preview is available for PDF files. Please download the DOCX file to view it in Word or your document reader.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download File</span>
                </Button>
                <Button size="sm" variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          )}

          {/* Active PDF Canvas */}
          {!isLoading && !errorMessage && !isDocx && !isMissingFile && (
            <div className="relative flex items-center justify-center transition-transform duration-100 ease-out">
              <canvas
                ref={canvasRef}
                className="rounded-lg shadow-xl border border-border/80 bg-white"
                style={{
                  maxWidth: "100%",
                }}
              />
            </div>
          )}
        </main>

        {/* FOOTER / PAGE CONTROLS */}
        {!isDocx && !isMissingFile && !errorMessage && numPages && numPages > 0 && (
          <footer className="flex h-12 shrink-0 items-center justify-center border-t border-border/80 bg-card/95 px-4 backdrop-blur">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage <= 1 || showLoading}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="text-xs font-medium tabular-nums text-foreground/80">
                Page {currentPage} of {numPages}
              </span>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, numPages))
                }
                disabled={currentPage >= numPages || showLoading}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
