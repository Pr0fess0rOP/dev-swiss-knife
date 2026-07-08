"use client";

import { useMemo, useState } from "react";
import { FileCode2, Minimize2, Sparkles, Trash2 } from "lucide-react";

import { ToolShell } from "@/components/tools/tool-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeCss } from "@/lib/css/css-utils";

const sampleCss = `/* Dev Swiss Knife sample CSS */

.card {
  padding: 16px;
  margin: 12px;
  padding: 16px;
  color: #2F2A24;
  color: #111111;
}

.button {
  background: #D6C3A5;
  color: #2F2A24;
  border-radius: 999px;
}

.card {
  border: 1px solid #E6DED1;
  background: #FFFDF9;
}

.hero-title {
  font-size: 48px;
  line-height: 1.1;
  line-height: 1.2;
}`;

type CssCleanerClientProps = {
    title: string;
    description: string;
};

export function CssCleanerClient({ title, description }: CssCleanerClientProps) {
    const [input, setInput] = useState(sampleCss);
    const [outputMode, setOutputMode] = useState<"minified" | "formatted">(
        "minified"
    );

    const result = useMemo(() => analyzeCss(input), [input]);

    const output =
        result.success && outputMode === "minified"
            ? result.minifiedCss
            : result.success
                ? result.formattedCss
                : "";

    function handleLoadSample() {
        setInput(sampleCss);
    }

    function handleClear() {
        setInput("");
    }

    function formatBytes(bytes: number): string {
        if (bytes < 1024) return `${bytes} B`;
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return (
        <ToolShell title={title} description={description}>
            <div className="grid gap-6 lg:grid-cols-2">
                <section className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-medium text-foreground">CSS Input</h2>
                            <p className="text-sm text-muted-foreground">
                                Paste CSS to minify and inspect for redundant rules.
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
                        placeholder=".button { color: red; }"
                        className="min-h-[520px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
                    />

                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleClear}
                        className="rounded-full text-muted-foreground"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear
                    </Button>

                    {!result.success ? (
                        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                            {result.error}
                        </div>
                    ) : null}
                </section>

                <section className="space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-medium text-foreground">Output</h2>
                            <p className="text-sm text-muted-foreground">
                                Switch between minified and formatted CSS.
                            </p>
                        </div>

                        <CopyButton value={output} />
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button
                            type="button"
                            variant={outputMode === "minified" ? "default" : "outline"}
                            onClick={() => setOutputMode("minified")}
                            className="rounded-full"
                        >
                            <Minimize2 className="mr-2 h-4 w-4" />
                            Minified
                        </Button>

                        <Button
                            type="button"
                            variant={outputMode === "formatted" ? "default" : "outline"}
                            onClick={() => setOutputMode("formatted")}
                            className="rounded-full"
                        >
                            <FileCode2 className="mr-2 h-4 w-4" />
                            Formatted
                        </Button>
                    </div>

                    <Textarea
                        value={output}
                        readOnly
                        spellCheck={false}
                        placeholder="Minified or formatted CSS will appear here..."
                        className="min-h-[300px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
                    />

                    {result.success ? (
                        <>
                            <div className="grid gap-3 sm:grid-cols-4">
                                <StatCard label="Original" value={formatBytes(result.originalSize)} />
                                <StatCard label="Minified" value={formatBytes(result.minifiedSize)} />
                                <StatCard label="Saved" value={formatBytes(result.savedBytes)} />
                                <StatCard label="Reduced" value={`${result.savedPercent}%`} />
                            </div>

                            <div className="rounded-2xl border border-border bg-background/60 p-4">
                                <div className="mb-4">
                                    <h2 className="text-sm font-medium text-foreground">
                                        Redundancy Report
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Duplicate selectors and repeated declarations found in the CSS.
                                    </p>
                                </div>

                                {result.issues.length > 0 ? (
                                    <div className="space-y-3">
                                        {result.issues.map((issue, index) => (
                                            <div
                                                key={`${issue.type}-${issue.selector}-${index}`}
                                                className="rounded-2xl border border-border bg-card/70 p-4"
                                            >
                                                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                                    <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground">
                                                        {issue.type}
                                                    </span>

                                                    <span className="font-mono text-xs text-muted-foreground">
                                                        {issue.selector}
                                                    </span>
                                                </div>

                                                <p className="text-sm font-medium text-foreground">
                                                    {issue.message}
                                                </p>

                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {issue.detail}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-2xl border border-border bg-card/70 p-4 text-sm text-muted-foreground">
                                        No obvious duplicate selectors or repeated declarations found.
                                    </div>
                                )}
                            </div>
                        </>
                    ) : null}
                </section>
            </div>
        </ToolShell>
    );
}

type StatCardProps = {
    label: string;
    value: string;
};

function StatCard({ label, value }: StatCardProps) {
    return (
        <div className="rounded-2xl border border-border bg-background/60 p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                {value}
            </p>
        </div>
    );
}