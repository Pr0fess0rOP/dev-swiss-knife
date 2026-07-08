"use client";

import { useState } from "react";
import { ArrowDownUp, ListX, Sparkles, Trash2 } from "lucide-react";

import { ToolShell } from "@/components/tools/tool-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    removeDuplicateLines,
    type DuplicateLineOptions,
} from "@/lib/text/line-utils";

const sampleText = `apple
banana
orange
apple
grape
banana
Apple
kiwi
orange`;

const defaultOptions: DuplicateLineOptions = {
    trimLines: true,
    ignoreCase: false,
    removeEmptyLines: true,
    sortOutput: false,
};

export default function DuplicateLineRemoverPage() {
    const [input, setInput] = useState(sampleText);
    const [output, setOutput] = useState("");
    const [options, setOptions] = useState<DuplicateLineOptions>(defaultOptions);
    const [error, setError] = useState("");
    const [stats, setStats] = useState<{
        originalLineCount: number;
        finalLineCount: number;
        removedLineCount: number;
    } | null>(null);

    function updateOption<Key extends keyof DuplicateLineOptions>(
        key: Key,
        value: DuplicateLineOptions[Key]
    ) {
        setOptions((currentOptions) => ({
            ...currentOptions,
            [key]: value,
        }));
    }

    function handleRemoveDuplicates() {
        const result = removeDuplicateLines(input, options);

        if (!result.success) {
            setError(result.error);
            setOutput("");
            setStats(null);
            return;
        }

        setError("");
        setOutput(result.value);
        setStats({
            originalLineCount: result.originalLineCount,
            finalLineCount: result.finalLineCount,
            removedLineCount: result.removedLineCount,
        });
    }

    function handleSwap() {
        setInput(output);
        setOutput(input);
        setError("");
        setStats(null);
    }

    function handleClear() {
        setInput("");
        setOutput("");
        setError("");
        setStats(null);
    }

    function handleLoadSample() {
        setInput(sampleText);
        setOutput("");
        setError("");
        setStats(null);
    }

    return (
        <ToolShell
            title="Duplicate Line Remover"
            description="Remove repeated lines from text while optionally trimming, sorting, and ignoring case."
        >
            <div className="grid gap-6 lg:grid-cols-2">
                <section className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-medium text-foreground">Input Text</h2>
                            <p className="text-sm text-muted-foreground">
                                Paste a list, logs, imports, or multiline text.
                            </p>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleLoadSample}
                            className="rounded-full"
                        >
                            <Sparkles className="mr-2 h-4 w-4" />
                            Sample
                        </Button>
                    </div>

                    <Textarea
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        spellCheck={false}
                        placeholder="Paste multiline text here..."
                        className="min-h-[320px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
                    />

                    <div className="grid gap-3 rounded-2xl border border-border bg-background/50 p-4 sm:grid-cols-2">
                        <LineOption
                            label="Trim lines"
                            checked={options.trimLines}
                            onChange={(checked) => updateOption("trimLines", checked)}
                        />

                        <LineOption
                            label="Ignore case"
                            checked={options.ignoreCase}
                            onChange={(checked) => updateOption("ignoreCase", checked)}
                        />

                        <LineOption
                            label="Remove empty lines"
                            checked={options.removeEmptyLines}
                            onChange={(checked) => updateOption("removeEmptyLines", checked)}
                        />

                        <LineOption
                            label="Sort output"
                            checked={options.sortOutput}
                            onChange={(checked) => updateOption("sortOutput", checked)}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            type="button"
                            onClick={handleRemoveDuplicates}
                            className="rounded-full"
                        >
                            <ListX className="mr-2 h-4 w-4" />
                            Remove Duplicates
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleSwap}
                            disabled={!output}
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

                    {error ? (
                        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                            {error}
                        </div>
                    ) : null}
                </section>

                <section className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-medium text-foreground">Output</h2>
                            <p className="text-sm text-muted-foreground">
                                Cleaned unique lines appear here.
                            </p>
                        </div>

                        <CopyButton value={output} />
                    </div>

                    <Textarea
                        value={output}
                        readOnly
                        spellCheck={false}
                        placeholder="Output will appear here..."
                        className="min-h-[320px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
                    />

                    {stats ? (
                        <div className="grid gap-3 sm:grid-cols-3">
                            <StatCard label="Original" value={stats.originalLineCount} />
                            <StatCard label="Final" value={stats.finalLineCount} />
                            <StatCard label="Removed" value={stats.removedLineCount} />
                        </div>
                    ) : null}
                </section>
            </div>
        </ToolShell>
    );
}

type LineOptionProps = {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
};

function LineOption({ label, checked, onChange }: LineOptionProps) {
    return (
        <label className="flex cursor-pointer items-center gap-3 text-sm text-foreground">
            <input
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
                className="h-4 w-4 rounded border-border accent-[var(--primary)]"
            />
            {label}
        </label>
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
            <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
        </div>
    );
}