"use client";

import { useState } from "react";
import { ArrowDownUp, LinkIcon, Sparkles, Trash2 } from "lucide-react";

import { ToolShell } from "@/components/tools/tool-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { decodeUrl, encodeUrl } from "@/lib/url/url-utils";

const sampleText =
    "https://dev-swiss-knife.app/search?q=json formatter&category=developer tools";

export default function UrlEncoderDecoderPage() {
    const [input, setInput] = useState(sampleText);
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");

    function handleEncode() {
        const result = encodeUrl(input);

        if (!result.success) {
            setError(result.error);
            setOutput("");
            return;
        }

        setError("");
        setOutput(result.value);
    }

    function handleDecode() {
        const result = decodeUrl(input);

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
            title="URL Encoder / Decoder"
            description="Encode text into a URL-safe format or decode encoded URLs back into readable text."
        >
            <div className="grid gap-6 lg:grid-cols-2">
                <section className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-medium text-foreground">Input</h2>
                            <p className="text-sm text-muted-foreground">
                                Paste normal text, a URL, or encoded URL text.
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
                        placeholder="Paste URL or text here..."
                        className="min-h-[360px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
                    />

                    <div className="flex flex-wrap items-center gap-3">
                        <Button type="button" onClick={handleEncode} className="rounded-full">
                            <LinkIcon className="mr-2 h-4 w-4" />
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