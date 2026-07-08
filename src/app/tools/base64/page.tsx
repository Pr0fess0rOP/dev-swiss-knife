"use client";

import { useState } from "react";
import { ArrowDownUp, Sparkles, Trash2 } from "lucide-react";

import { ToolShell } from "@/components/tools/tool-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { decodeBase64, encodeBase64 } from "@/lib/base64/base64-utils";

const sampleText = "Dev Swiss Knife makes everyday developer tools simple.";

export default function Base64Page() {
    const [input, setInput] = useState(sampleText);
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");

    function handleEncode() {
        const result = encodeBase64(input);

        if (!result.success) {
            setError(result.error);
            setOutput("");
            return;
        }

        setError("");
        setOutput(result.value);
    }

    function handleDecode() {
        const result = decodeBase64(input);

        if (!result.success) {
            setError(result.error);
            setOutput("");
            return;
        }

        setError("");
        setOutput(result.value);
    }

    function handleSwap() {
        setInput(output);
        setOutput(input);
        setError("");
    }

    function handleClear() {
        setInput("");
        setOutput("");
        setError("");
    }

    function handleLoadSample() {
        setInput(sampleText);
        setOutput("");
        setError("");
    }

    return (
        <ToolShell
            title="Base64 Encoder / Decoder"
            description="Encode plain text into Base64 or decode Base64 back into readable text."
        >
            <div className="grid gap-6 lg:grid-cols-2">
                <section className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-medium text-foreground">Input</h2>
                            <p className="text-sm text-muted-foreground">
                                Paste plain text or Base64 text here.
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
                        placeholder="Paste text here..."
                        className="min-h-[360px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
                    />

                    <div className="flex flex-wrap items-center gap-3">
                        <Button type="button" onClick={handleEncode} className="rounded-full">
                            Encode
                        </Button>

                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleDecode}
                            className="rounded-full"
                        >
                            Decode
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
                                Encoded or decoded output appears here.
                            </p>
                        </div>

                        <CopyButton value={output} />
                    </div>

                    <Textarea
                        value={output}
                        readOnly
                        spellCheck={false}
                        placeholder="Output will appear here..."
                        className="min-h-[360px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
                    />
                </section>
            </div>
        </ToolShell>
    );
}