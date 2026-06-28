"use client";

import { useState, useEffect } from "react";
import { Sparkles, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UploadDropzone } from "@/components/document/upload-dropzone";
import { RiskFlagsPanel } from "@/components/panels/risk-flags-panel";
import { sampleRiskFlags } from "@/lib/mock/risk-flags";
import type { RiskFlag } from "@/lib/types";

type Stage = "upload" | "parsing" | "results";

const parseSteps = [
  "Extracting text…",
  "Identifying SPA clauses…",
  "Comparing against Law 13 of 2008…",
  "Cross-checking RERA precedents…",
  "Scoring risk severity…",
];

interface UploadedFile {
  name: string;
  size: number;
}

export function SpaAuditFlow() {
  const [stage, setStage] = useState<Stage>("upload");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [flags, setFlags] = useState<RiskFlag[]>([]);

  useEffect(() => {
    if (stage !== "parsing") return;
    if (stepIdx >= parseSteps.length) {
      const timer = window.setTimeout(() => {
        setFlags(sampleRiskFlags);
        setStage("results");
      }, 500);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => setStepIdx((i) => i + 1), 800);
    return () => window.clearTimeout(timer);
  }, [stage, stepIdx]);

  function startAudit() {
    if (files.length === 0) {
      setFiles([{ name: "Sample-SPA.pdf", size: 1_240_000 }]);
    }
    setStepIdx(0);
    setStage("parsing");
  }

  function reset() {
    setFiles([]);
    setFlags([]);
    setStage("upload");
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">SPA audit</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload a Sale & Purchase Agreement. We&apos;ll flag risky clauses with severity, rationale, and a recommended action.
        </p>
      </header>

      {stage === "upload" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upload your SPA</CardTitle>
            <CardDescription>Or skip and use a sample to see how the audit works.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <UploadDropzone
              files={files}
              onFiles={(f) => setFiles(f)}
              onRemove={(i) => setFiles(files.filter((_, idx) => idx !== i))}
              label="Drop your SPA PDF here, or click to browse"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">No PDFs are stored. Parsing runs in this browser session.</span>
              <Button onClick={startAudit}>
                <Sparkles className="h-4 w-4" />
                {files.length > 0 ? "Audit SPA" : "Use a sample SPA"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {stage === "parsing" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Auditing your SPA</CardTitle>
            <CardDescription>This usually takes a few seconds.</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {parseSteps.map((label, i) => {
                const state = i < stepIdx ? "done" : i === stepIdx ? "running" : "pending";
                return (
                  <li key={label} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center">
                      {state === "done" && <span className="h-2 w-2 rounded-full bg-[oklch(0.65_0.18_145)]" />}
                      {state === "running" && (
                        <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                      )}
                      {state === "pending" && <span className="h-2 w-2 rounded-full bg-muted" />}
                    </div>
                    <span
                      className={
                        state === "running"
                          ? "text-sm font-medium text-foreground"
                          : state === "done"
                          ? "text-sm text-muted-foreground line-through"
                          : "text-sm text-muted-foreground"
                      }
                    >
                      {label}
                    </span>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>
      )}

      {stage === "results" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileSearch className="h-4 w-4" />
              {files[0]?.name ?? "Sample SPA"} · {flags.length} flags found
            </div>
            <Button variant="outline" size="sm" onClick={reset}>
              Audit another SPA
            </Button>
          </div>
          <RiskFlagsPanel flags={flags} />
        </div>
      )}
    </div>
  );
}
