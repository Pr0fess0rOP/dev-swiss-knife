"use client";

import { useState } from "react";
import { Hash, Sparkles, Trash2 } from "lucide-react";

import { ToolShell } from "@/components/tools/tool-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    generateHash,
    hashAlgorithms,
    type HashAlgorithm,
} from "@/lib/crypto/hash-utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const sampleText = "Dev Swiss Knife";

export default function HashGeneratorPage() {
    const [input, setInput] = useState(sampleText);
    const [algorithm, setAlgorithm] = useState<HashAlgorithm>("SHA-256");
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    async function handleGenerateHash() {
        setIsGenerating(true);

        const result = await generateHash(input, algorithm);

        if (!result.success) {
            setError(result.error);
            setOutput("");
            setIsGenerating(false);
            return;
        }

        setError("");
        setOutput(result.hash);
        setIsGenerating(false);
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
            title="Hash Generator"
            description="Generate SHA-256, SHA-384, and SHA-512 hashes directly in your browser."
        >
            <div className="grid gap-6 lg:grid-cols-2">
                <section className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-medium text-foreground">Input Text</h2>
                            <p className="text-sm text-muted-foreground">
                                Paste the text you want to hash.
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
                        className="min-h-[300px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
                    />

                    <div className="grid gap-3 sm:grid-cols-[220px_1fr]">
                        <Select
                            value={algorithm}
                            onValueChange={(value) => setAlgorithm(value as HashAlgorithm)}
                        >
                            <SelectTrigger className="rounded-full bg-background/70">
                                <SelectValue placeholder="Select algorithm" />
                            </SelectTrigger>

                            <SelectContent>
                                {hashAlgorithms.map((hashAlgorithm) => (
                                    <SelectItem key={hashAlgorithm} value={hashAlgorithm}>
                                        {hashAlgorithm}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                type="button"
                                onClick={handleGenerateHash}
                                disabled={isGenerating}
                                className="rounded-full"
                            >
                                <Hash className="mr-2 h-4 w-4" />
                                {isGenerating ? "Generating..." : "Generate Hash"}
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
                            <h2 className="text-sm font-medium text-foreground">Hash Output</h2>
                            <p className="text-sm text-muted-foreground">
                                Your {algorithm} hash appears here.
                            </p>
                        </div>

                        <CopyButton value={output} />
                    </div>

                    <Textarea
                        value={output}
                        readOnly
                        spellCheck={false}
                        placeholder="Generated hash will appear here..."
                        className="min-h-[300px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
                    />

                    {output ? (
                        <div className="rounded-2xl border border-border bg-background/60 p-4 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">Algorithm:</span>{" "}
                            {algorithm}
                            <br />
                            <span className="font-medium text-foreground">Length:</span>{" "}
                            {output.length} hex characters
                        </div>
                    ) : null}
                </section>
            </div>
        </ToolShell>
    );
}