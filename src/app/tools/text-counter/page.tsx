"use client";

import { useMemo, useState } from "react";
import { Sparkles, Trash2 } from "lucide-react";

import { ToolShell } from "@/components/tools/tool-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getTextStats } from "@/lib/text/counter-utils";

const sampleText = `Dev Swiss Knife is a minimal developer toolbox.

It helps developers format JSON, decode JWTs, compare code, test regex, convert data, and handle everyday utilities in one clean workspace.`;

export default function TextCounterPage() {
    const [input, setInput] = useState(sampleText);

    const stats = useMemo(() => getTextStats(input), [input]);

    function handleClear() {
        setInput("");
    }

    function handleLoadSample() {
        setInput(sampleText);
    }

    return (
        <ToolShell
            title="Word / Character Counter"
            description="Count words, characters, lines, paragraphs, sentences, spaces, and estimated reading time."
        >
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                <section className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-medium text-foreground">Input Text</h2>
                            <p className="text-sm text-muted-foreground">
                                Paste any text and see live stats instantly.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
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

                            <CopyButton value={input} />
                        </div>
                    </div>

                    <Textarea
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        spellCheck={false}
                        placeholder="Paste or type text here..."
                        className="min-h-[480px] resize-none rounded-2xl bg-background/70 text-sm leading-7"
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
                </section>

                <section className="space-y-4">
                    <div>
                        <h2 className="text-sm font-medium text-foreground">Live Stats</h2>
                        <p className="text-sm text-muted-foreground">
                            Updated as you type.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                        <StatCard label="Words" value={stats.words} />
                        <StatCard label="Characters" value={stats.characters} />
                        <StatCard
                            label="Characters without spaces"
                            value={stats.charactersNoSpaces}
                        />
                        <StatCard label="Lines" value={stats.lines} />
                        <StatCard label="Paragraphs" value={stats.paragraphs} />
                        <StatCard label="Sentences" value={stats.sentences} />
                        <StatCard label="Spaces" value={stats.spaces} />
                        <StatCard
                            label="Reading time"
                            value={
                                stats.readingTimeMinutes === 0
                                    ? "0 min"
                                    : `${stats.readingTimeMinutes} min`
                            }
                        />
                    </div>
                </section>
            </div>
        </ToolShell>
    );
}

type StatCardProps = {
    label: string;
    value: number | string;
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