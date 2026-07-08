"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp, Code2, Sparkles, Trash2 } from "lucide-react";

import { ToolShell } from "@/components/tools/tool-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createDiff, type DiffMode } from "@/lib/diff/diff-utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const sampleOriginal = `function calculateTotal(items) {
  let total = 0;

  for (const item of items) {
    total += item.price;
  }

  return total;
}`;

const sampleChanged = `function calculateTotal(items) {
  let total = 0;

  for (const item of items) {
    total += item.price * item.quantity;
  }

  return Number(total.toFixed(2));
}`;

export default function CodeDiffPage() {
    const [originalText, setOriginalText] = useState(sampleOriginal);
    const [changedText, setChangedText] = useState(sampleChanged);
    const [mode, setMode] = useState<DiffMode>("lines");

    const diffResult = useMemo(
        () => createDiff(originalText, changedText, mode),
        [originalText, changedText, mode]
    );

    function handleLoadSample() {
        setOriginalText(sampleOriginal);
        setChangedText(sampleChanged);
        setMode("lines");
    }

    function handleSwap() {
        setOriginalText(changedText);
        setChangedText(originalText);
    }

    function handleClear() {
        setOriginalText("");
        setChangedText("");
    }

    return (
        <ToolShell
            title="Code Diff Checker"
            description="Compare two code snippets or text blocks and inspect added, removed, and unchanged sections."
        >
            <div className="space-y-6">
                <section className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-sm font-medium text-foreground">
                                Original Text
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Paste the old version here.
                            </p>
                        </div>

                        <Textarea
                            value={originalText}
                            onChange={(event) => setOriginalText(event.target.value)}
                            spellCheck={false}
                            placeholder="Paste original code here..."
                            className="min-h-[340px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
                        />
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h2 className="text-sm font-medium text-foreground">
                                Changed Text
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Paste the new version here.
                            </p>
                        </div>

                        <Textarea
                            value={changedText}
                            onChange={(event) => setChangedText(event.target.value)}
                            spellCheck={false}
                            placeholder="Paste changed code here..."
                            className="min-h-[340px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
                        />
                    </div>
                </section>

                <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-background/50 p-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <Select
                            value={mode}
                            onValueChange={(value) => setMode(value as DiffMode)}
                        >
                            <SelectTrigger className="w-[180px] rounded-full bg-background/70">
                                <SelectValue placeholder="Diff mode" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="lines">Line diff</SelectItem>
                                <SelectItem value="words">Word diff</SelectItem>
                                <SelectItem value="characters">Character diff</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleLoadSample}
                            className="rounded-full"
                        >
                            <Sparkles className="mr-2 h-4 w-4" />
                            Sample
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleSwap}
                            className="rounded-full"
                        >
                            <ArrowDownUp className="mr-2 h-4 w-4" />
                            Swap
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleClear}
                            className="rounded-full text-muted-foreground"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Clear
                        </Button>
                    </div>

                    <CopyButton value={diffResult.unifiedText} label="Copy Diff" />
                </section>

                <section className="grid gap-3 sm:grid-cols-4">
                    <StatCard label="Added" value={diffResult.stats.added} />
                    <StatCard label="Removed" value={diffResult.stats.removed} />
                    <StatCard label="Unchanged" value={diffResult.stats.unchanged} />
                    <StatCard label="Total Changes" value={diffResult.stats.totalChanges} />
                </section>

                <section className="space-y-4">
                    <div>
                        <h2 className="flex items-center text-sm font-medium text-foreground">
                            <Code2 className="mr-2 h-4 w-4" />
                            Diff Output
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Added content is highlighted in green. Removed content is highlighted in red.
                        </p>
                    </div>

                    <div
                        className="min-h-[300px] overflow-auto rounded-2xl border border-border bg-background/70 p-4 font-mono text-sm leading-7"
                        dangerouslySetInnerHTML={{
                            __html:
                                diffResult.html ||
                                `<span class="text-muted-foreground">Diff output will appear here.</span>`,
                        }}
                    />
                </section>
            </div>
        </ToolShell>
    );
}

type StatCardProps = {
    label: string;
    value: number;
};

function StatCard({ label, value }: StatCardProps) {
    return (
        <div className="rounded-2xl border border-border bg-background/60 p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                {value}
            </p>
        </div>
    );
}