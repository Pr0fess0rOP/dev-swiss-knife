"use client";

import { useEffect, useState } from "react";
import { Download, QrCode, Sparkles, Trash2 } from "lucide-react";

import { ToolShell } from "@/components/tools/tool-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    generateQrCode,
    type QrCodeOptions,
    type QrErrorCorrectionLevel,
} from "@/lib/qr/qr-utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const sampleText = "https://dev-swiss-knife.app";

const defaultOptions: QrCodeOptions = {
    size: 320,
    margin: 2,
    errorCorrectionLevel: "M",
    darkColor: "#2F2A24",
    lightColor: "#FFFDF9",
};

const errorCorrectionLevels: {
    label: string;
    value: QrErrorCorrectionLevel;
    description: string;
}[] = [
        {
            label: "Low",
            value: "L",
            description: "Smallest QR, least recovery.",
        },
        {
            label: "Medium",
            value: "M",
            description: "Good default.",
        },
        {
            label: "Quartile",
            value: "Q",
            description: "Better recovery.",
        },
        {
            label: "High",
            value: "H",
            description: "Best recovery, larger QR.",
        },
    ];

export default function QrGeneratorPage() {
    const [input, setInput] = useState(sampleText);
    const [options, setOptions] = useState<QrCodeOptions>(defaultOptions);
    const [dataUrl, setDataUrl] = useState("");
    const [error, setError] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    function updateOption<Key extends keyof QrCodeOptions>(
        key: Key,
        value: QrCodeOptions[Key]
    ) {
        setOptions((currentOptions) => ({
            ...currentOptions,
            [key]: value,
        }));
    }

    async function handleGenerate() {
        setIsGenerating(true);

        const result = await generateQrCode(input, options);

        if (!result.success) {
            setError(result.error);
            setDataUrl("");
            setIsGenerating(false);
            return;
        }

        setError("");
        setDataUrl(result.dataUrl);
        setIsGenerating(false);
    }

    function handleDownload() {
        if (!dataUrl) return;

        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "dev-swiss-knife-qr-code.png";
        link.click();
    }

    function handleLoadSample() {
        setInput(sampleText);
        setOptions(defaultOptions);
        setError("");
    }

    function handleClear() {
        setInput("");
        setDataUrl("");
        setError("");
    }

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            if (input.trim()) {
                void handleGenerate();
            }
        }, 300);

        return () => window.clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input, options]);

    return (
        <ToolShell
            title="QR Code Generator"
            description="Generate downloadable QR codes from text, URLs, emails, phone numbers, or any short content."
        >
            <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
                <section className="space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-medium text-foreground">QR Content</h2>
                            <p className="text-sm text-muted-foreground">
                                Enter the text or URL you want to encode.
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
                        placeholder="https://example.com"
                        className="min-h-[180px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
                    />

                    <div className="grid gap-4 rounded-2xl border border-border bg-background/50 p-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Size
                                </label>

                                <Input
                                    type="number"
                                    min={128}
                                    max={1024}
                                    value={options.size}
                                    onChange={(event) =>
                                        updateOption("size", Number(event.target.value))
                                    }
                                    className="rounded-full bg-background/70"
                                />

                                <p className="text-xs text-muted-foreground">
                                    Between 128 and 1024 pixels.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Margin
                                </label>

                                <Input
                                    type="number"
                                    min={0}
                                    max={10}
                                    value={options.margin}
                                    onChange={(event) =>
                                        updateOption("margin", Number(event.target.value))
                                    }
                                    className="rounded-full bg-background/70"
                                />

                                <p className="text-xs text-muted-foreground">
                                    Empty border around the code.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Error Correction
                            </label>

                            <Select
                                value={options.errorCorrectionLevel}
                                onValueChange={(value) =>
                                    updateOption(
                                        "errorCorrectionLevel",
                                        value as QrErrorCorrectionLevel
                                    )
                                }
                            >
                                <SelectTrigger className="rounded-full bg-background/70">
                                    <SelectValue placeholder="Error correction" />
                                </SelectTrigger>

                                <SelectContent>
                                    {errorCorrectionLevels.map((level) => (
                                        <SelectItem key={level.value} value={level.value}>
                                            {level.label} — {level.description}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Dark Color
                                </label>

                                <div className="flex items-center gap-3">
                                    <Input
                                        type="color"
                                        value={options.darkColor}
                                        onChange={(event) =>
                                            updateOption("darkColor", event.target.value)
                                        }
                                        className="h-10 w-14 rounded-xl bg-background/70 p-1"
                                    />

                                    <Input
                                        value={options.darkColor}
                                        onChange={(event) =>
                                            updateOption("darkColor", event.target.value)
                                        }
                                        className="rounded-full bg-background/70 font-mono"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Light Color
                                </label>

                                <div className="flex items-center gap-3">
                                    <Input
                                        type="color"
                                        value={options.lightColor}
                                        onChange={(event) =>
                                            updateOption("lightColor", event.target.value)
                                        }
                                        className="h-10 w-14 rounded-xl bg-background/70 p-1"
                                    />

                                    <Input
                                        value={options.lightColor}
                                        onChange={(event) =>
                                            updateOption("lightColor", event.target.value)
                                        }
                                        className="rounded-full bg-background/70 font-mono"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button
                            type="button"
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="rounded-full"
                        >
                            <QrCode className="mr-2 h-4 w-4" />
                            {isGenerating ? "Generating..." : "Generate QR"}
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

                <section className="space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-medium text-foreground">Preview</h2>
                            <p className="text-sm text-muted-foreground">
                                Generated QR code appears here.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <CopyButton value={input} label="Copy Text" />

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={!dataUrl}
                                onClick={handleDownload}
                                className="rounded-full"
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Download PNG
                            </Button>
                        </div>
                    </div>

                    <div className="flex min-h-[440px] items-center justify-center rounded-2xl border border-border bg-background/70 p-6">
                        {dataUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={dataUrl}
                                alt="Generated QR code"
                                className="max-h-[360px] max-w-full rounded-2xl border border-border bg-white p-4 shadow-sm"
                            />
                        ) : (
                            <div className="text-center">
                                <QrCode className="mx-auto h-10 w-10 text-muted-foreground" />
                                <p className="mt-3 text-sm text-muted-foreground">
                                    Your QR code will appear here.
                                </p>
                            </div>
                        )}
                    </div>

                    {dataUrl ? (
                        <div className="rounded-2xl border border-border bg-background/60 p-4 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">Size:</span>{" "}
                            {options.size}px
                            <br />
                            <span className="font-medium text-foreground">
                                Error correction:
                            </span>{" "}
                            {options.errorCorrectionLevel}
                            <br />
                            <span className="font-medium text-foreground">Content length:</span>{" "}
                            {input.length} characters
                        </div>
                    ) : null}
                </section>
            </div>
        </ToolShell>
    );
}