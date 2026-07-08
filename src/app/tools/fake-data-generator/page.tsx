"use client";

import { useState } from "react";
import { DatabaseZap, Download, RefreshCw, Trash2 } from "lucide-react";

import { ToolShell } from "@/components/tools/tool-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    generateFakeData,
    type FakeDataFormat,
    type FakeDataOptions,
    type FakeDataType,
} from "@/lib/fake-data/fake-data-utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const defaultOptions: FakeDataOptions = {
    type: "users",
    count: 10,
    format: "json",
};

const fakeDataTypes: { label: string; value: FakeDataType }[] = [
    { label: "Users", value: "users" },
    { label: "Companies", value: "companies" },
    { label: "Products", value: "products" },
    { label: "Addresses", value: "addresses" },
];

export default function FakeDataGeneratorPage() {
    const [options, setOptions] = useState<FakeDataOptions>(defaultOptions);
    const [seedInput, setSeedInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");
    const [stats, setStats] = useState<{
        rowCount: number;
        fields: string[];
    } | null>(null);

    function updateOption<Key extends keyof FakeDataOptions>(
        key: Key,
        value: FakeDataOptions[Key]
    ) {
        setOptions((currentOptions) => ({
            ...currentOptions,
            [key]: value,
        }));
    }

    function handleGenerate() {
        const seed = seedInput.trim() ? Number(seedInput) : undefined;

        if (seedInput.trim() && !Number.isFinite(seed)) {
            setError("Seed must be a valid number.");
            setOutput("");
            setStats(null);
            return;
        }

        const result = generateFakeData({
            ...options,
            seed,
        });

        if (!result.success) {
            setError(result.error);
            setOutput("");
            setStats(null);
            return;
        }

        setError("");
        setOutput(result.output);
        setStats({
            rowCount: result.rowCount,
            fields: result.fields,
        });
    }

    function handleReset() {
        setOptions(defaultOptions);
        setSeedInput("");
        setOutput("");
        setError("");
        setStats(null);
    }

    function handleClearOutput() {
        setOutput("");
        setError("");
        setStats(null);
    }

    function handleDownload() {
        if (!output) return;

        const extension = options.format === "json" ? "json" : "csv";
        const mimeType =
            options.format === "json"
                ? "application/json;charset=utf-8"
                : "text/csv;charset=utf-8";

        const blob = new Blob([output], {
            type: mimeType,
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `fake-${options.type}.${extension}`;
        link.click();

        URL.revokeObjectURL(url);
    }

    return (
        <ToolShell
            title="Fake Data Generator"
            description="Generate fake users, companies, products, and addresses for testing, mock APIs, seeds, and demos."
        >
            <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
                <section className="space-y-5">
                    <div>
                        <h2 className="text-sm font-medium text-foreground">Options</h2>
                        <p className="text-sm text-muted-foreground">
                            Choose the dataset type, output format, and number of records.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Data Type
                            </label>

                            <Select
                                value={options.type}
                                onValueChange={(value) =>
                                    updateOption("type", value as FakeDataType)
                                }
                            >
                                <SelectTrigger className="rounded-full bg-background/70">
                                    <SelectValue placeholder="Data type" />
                                </SelectTrigger>

                                <SelectContent>
                                    {fakeDataTypes.map((dataType) => (
                                        <SelectItem key={dataType.value} value={dataType.value}>
                                            {dataType.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Format
                            </label>

                            <Select
                                value={options.format}
                                onValueChange={(value) =>
                                    updateOption("format", value as FakeDataFormat)
                                }
                            >
                                <SelectTrigger className="rounded-full bg-background/70">
                                    <SelectValue placeholder="Format" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="json">JSON</SelectItem>
                                    <SelectItem value="csv">CSV</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            Record Count
                        </label>

                        <Input
                            type="number"
                            min={1}
                            max={500}
                            value={options.count}
                            onChange={(event) =>
                                updateOption("count", Number(event.target.value))
                            }
                            className="rounded-full bg-background/70"
                        />

                        <p className="text-xs text-muted-foreground">
                            Maximum 500 records to keep the browser fast.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            Seed Optional
                        </label>

                        <Input
                            value={seedInput}
                            onChange={(event) => setSeedInput(event.target.value)}
                            placeholder="12345"
                            className="rounded-full bg-background/70"
                        />

                        <p className="text-xs text-muted-foreground">
                            Use the same seed to generate repeatable fake data.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button type="button" onClick={handleGenerate} className="rounded-full">
                            <DatabaseZap className="mr-2 h-4 w-4" />
                            Generate Data
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleReset}
                            className="rounded-full"
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Reset
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleClearOutput}
                            className="rounded-full text-muted-foreground"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Clear Output
                        </Button>
                    </div>

                    {error ? (
                        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                            {error}
                        </div>
                    ) : null}

                    {stats ? (
                        <div className="rounded-2xl border border-border bg-background/60 p-4 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">Rows:</span>{" "}
                            {stats.rowCount}
                            <br />
                            <span className="font-medium text-foreground">Fields:</span>{" "}
                            {stats.fields.length}
                        </div>
                    ) : null}
                </section>

                <section className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-medium text-foreground">Output</h2>
                            <p className="text-sm text-muted-foreground">
                                Generated fake data appears here.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <CopyButton value={output} />

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={!output}
                                onClick={handleDownload}
                                className="rounded-full"
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </Button>
                        </div>
                    </div>

                    <Textarea
                        value={output}
                        readOnly
                        spellCheck={false}
                        placeholder="Generated fake data will appear here..."
                        className="min-h-[520px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
                    />

                    {stats?.fields.length ? (
                        <div className="rounded-2xl border border-border bg-background/60 p-4">
                            <p className="text-xs text-muted-foreground">Generated Fields</p>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {stats.fields.map((field) => (
                                    <span
                                        key={field}
                                        className="rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground"
                                    >
                                        {field}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </section>
            </div>
        </ToolShell>
    );
}