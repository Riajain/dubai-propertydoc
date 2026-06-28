"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ChevronRight, Check, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UploadDropzone } from "@/components/document/upload-dropzone";
import { Badge } from "@/components/ui/badge";
import { cn, formatAed } from "@/lib/utils";

type Step = 0 | 1 | 2;

interface UploadedFile {
  name: string;
  size: number;
}

interface Extracted {
  name: string;
  developer: string;
  community: string;
  bedrooms: number;
  bua: number;
  price: number;
  pricePerSqft: number;
  serviceCharge: number;
  handover: string;
}

const stepLabels = ["Upload documents", "Review extraction", "Add to library"];

const extractionSteps = [
  "Reading brochure…",
  "Parsing SPA clauses…",
  "Extracting payment schedule…",
  "Building property profile…",
];

const sampleExtracted: Extracted = {
  name: "Marina Heights Residence 12",
  developer: "Damac Properties",
  community: "Dubai Marina",
  bedrooms: 2,
  bua: 1340,
  price: 3_450_000,
  pricePerSqft: 2575,
  serviceCharge: 19.4,
  handover: "2027-03-31",
};

export function OnboardWizard() {
  const [step, setStep] = useState<Step>(0);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [extracting, setExtracting] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [extracted, setExtracted] = useState<Extracted | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!extracting) return;
    if (stepIdx >= extractionSteps.length) {
      const timer = window.setTimeout(() => {
        setExtracted(sampleExtracted);
        setExtracting(false);
        setStep(1);
      }, 400);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => setStepIdx((i) => i + 1), 750);
    return () => window.clearTimeout(timer);
  }, [extracting, stepIdx]);

  function startExtract() {
    if (files.length === 0) {
      setFiles([
        { name: "marina-heights-brochure.pdf", size: 2_120_000 },
        { name: "marina-heights-spa.pdf", size: 3_650_000 },
      ]);
    }
    setStepIdx(0);
    setExtracting(true);
  }

  function confirm() {
    setConfirmed(true);
    setStep(2);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Onboard a property</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Drop in brochures, SPAs, and payment plans. We&apos;ll extract a Property Dashboard so you can start chatting with it.
        </p>
      </header>

      <Stepper step={step} />

      {step === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">1. Upload documents</CardTitle>
            <CardDescription>Brochure, SPA, payment plan, market report. Anything you have.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <UploadDropzone
              multiple
              files={files}
              onFiles={(f) => setFiles((prev) => [...prev, ...f])}
              onRemove={(i) => setFiles(files.filter((_, idx) => idx !== i))}
              label="Drop one or more property PDFs here"
            />
            {extracting ? (
              <ol className="space-y-2 rounded-lg border bg-muted/30 p-4">
                {extractionSteps.map((label, i) => {
                  const state = i < stepIdx ? "done" : i === stepIdx ? "running" : "pending";
                  return (
                    <li key={label} className="flex items-center gap-3 text-sm">
                      <div className="flex h-5 w-5 items-center justify-center">
                        {state === "done" && <Check className="h-3.5 w-3.5 text-[oklch(0.65_0.18_145)]" />}
                        {state === "running" && <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />}
                        {state === "pending" && <span className="h-2 w-2 rounded-full bg-muted" />}
                      </div>
                      <span className={state === "done" ? "text-muted-foreground line-through" : ""}>{label}</span>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">No documents uploaded? We&apos;ll use a sample.</span>
                <Button onClick={startExtract}>
                  <Sparkles className="h-4 w-4" /> Extract data
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {step === 1 && extracted && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">2. Review extraction</CardTitle>
            <CardDescription>Edit any field that needs correcting before saving.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Property name" value={extracted.name} onChange={(v) => setExtracted({ ...extracted, name: v })} />
              <Field label="Developer" value={extracted.developer} onChange={(v) => setExtracted({ ...extracted, developer: v })} />
              <Field label="Community" value={extracted.community} onChange={(v) => setExtracted({ ...extracted, community: v })} />
              <Field label="Bedrooms" value={String(extracted.bedrooms)} onChange={(v) => setExtracted({ ...extracted, bedrooms: Number(v) || 0 })} />
              <Field label="BUA (sqft)" value={String(extracted.bua)} onChange={(v) => setExtracted({ ...extracted, bua: Number(v) || 0 })} />
              <Field label="Price (AED)" value={String(extracted.price)} onChange={(v) => setExtracted({ ...extracted, price: Number(v) || 0 })} />
              <Field label="Price / sqft" value={String(extracted.pricePerSqft)} onChange={(v) => setExtracted({ ...extracted, pricePerSqft: Number(v) || 0 })} />
              <Field label="Service charge / sqft" value={String(extracted.serviceCharge)} onChange={(v) => setExtracted({ ...extracted, serviceCharge: Number(v) || 0 })} />
              <Field label="Handover (YYYY-MM-DD)" value={extracted.handover} onChange={(v) => setExtracted({ ...extracted, handover: v })} />
            </div>
            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button onClick={confirm}>
                Save to library
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && extracted && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[oklch(0.65_0.18_145)]/15 text-[oklch(0.45_0.16_145)]">
                <Check className="h-4 w-4" />
              </div>
              <CardTitle className="text-base">Added to your library</CardTitle>
            </div>
            <CardDescription>This is a prototype — state lives in memory and resets on refresh.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg border bg-card p-4">
              <Building2 className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <div className="font-semibold">{extracted.name}</div>
                <div className="text-xs text-muted-foreground">
                  {extracted.developer} · {extracted.community} · {extracted.bedrooms}BR · {extracted.bua.toLocaleString()} sqft
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge variant="outline">{formatAed(extracted.price)}</Badge>
                  <Badge variant="outline">AED {extracted.pricePerSqft.toLocaleString()}/sqft</Badge>
                  <Badge variant="outline">SC {extracted.serviceCharge}/sqft</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Button variant="outline" asChild>
                <Link href="/library">View library</Link>
              </Button>
              <Button asChild>
                <Link href="/doc/creek-brochure">Open a sample doc</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* keep confirmed reference to satisfy linter */}
      <span className="sr-only">{confirmed ? "saved" : "pending"}</span>
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <ol className="mb-6 flex items-center gap-2 text-sm">
      {stepLabels.map((label, i) => {
        const isActive = i === step;
        const isDone = i < step;
        return (
          <li key={label} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : isDone
                  ? "bg-[oklch(0.65_0.18_145)]/20 text-[oklch(0.45_0.16_145)]"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {isDone ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <span
              className={cn(
                "text-xs",
                isActive ? "font-medium text-foreground" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
            {i < stepLabels.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
          </li>
        );
      })}
    </ol>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
