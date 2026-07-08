"use client";

import { useState } from "react";
import { ArrowDownUp, Sparkles, Trash2, Type } from "lucide-react";

import { ToolShell } from "@/components/tools/tool-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    convertCase,
    caseTypes,
    type CaseType,
} from "@/lib/text/case-utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const sampleText = "Dev Swiss Knife case converter tool";

export default function CaseConverterPage() {
    const [input, setInput] = useState(sampleText);
    const [caseType, setCaseType] = useState<CaseType>("camel");
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");

    function handleConvert() {
        const result = convertCase(input, caseType);

        if (!result.success) {
            setError(result.error);
            setOutput("");
            return;
        }

        setError("");
        setOutput(result.value);
    }

    function handleConvertAll() {
        if (!input.trim()) {
            setError("Please enter text to convert.");
            setOutput("");
            return;
        }

        const convertedValues = caseTypes
            .map((caseOption) => {
                const result = convertCase(input, caseOption.value);

                if (!result.success) {
                    return `${caseOption.label}: Error`;
                }

                return `${caseOption.label}: ${result.value}`;
            })
            .join("\n");

        setError("");
        setOutput(convertedValues);
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
            title="Case Converter"
            description="Convert text between camelCase, PascalCase, snake_case, kebab-case, title case, and more."
        >
            <div className="grid gap-6 lg:grid-cols-2">
                <section className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-medium text-foreground">Input Text</h2>
                            <p className="text-sm text-muted-foreground">
                                Paste any phrase, variable name, or sentence.
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
                            value={caseType}
                            onValueChange={(value) => setCaseType(value as CaseType)}
                        >
                            <SelectTrigger className="rounded-full bg-background/70">
                                <SelectValue placeholder="Select case type" />
                            </SelectTrigger>

                            <SelectContent>
                                {caseTypes.map((caseOption) => (
                                    <SelectItem key={caseOption.value} value={caseOption.value}>
                                        {caseOption.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex flex-wrap items-center gap-3">
                            <Button type="button" onClick={handleConvert} className="rounded-full">
                                <Type className="mr-2 h-4 w-4" />
                                Convert
                            </Button>

                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleConvertAll}
                                className="rounded-full"
                            >
                                Convert All
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
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
                                Converted text appears here.
                            </p>
                        </div>

                        <CopyButton value={output} />
                    </div>

                    <Textarea
                        value={output}
                        readOnly
                        spellCheck={false}
                        placeholder="Converted output will appear here..."
                        className="min-h-[300px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
                    />
                </section>
            </div>
        </ToolShell>
    );
}