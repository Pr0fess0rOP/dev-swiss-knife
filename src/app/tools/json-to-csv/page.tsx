"use client";

import { useState } from "react";
import { ArrowDownUp, FileSpreadsheet, Sparkles, Trash2 } from "lucide-react";

import { ToolShell } from "@/components/tools/tool-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    convertJsonToCsv,
    type JsonToCsvOptions,
} from "@/lib/csv/csv-utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const sampleJson = `[
  {
    "name": "Soham",
    "email": "soham@example.com",
    "role": "Developer",
    "active": true,
    "score": 95
  },
  {
    "name": "Ava",
    "email": "ava@example.com",
    "role": "Designer",
    "active": true,
    "score": 88
  },
  {
    "name": "Noah",
    "email": "noah@example.com",
    "role": "Engineer",
    "active": false,
    "score": 76
  }
]`;

const defaultOptions: JsonToCsvOptions = {
    header: true,
    delimiter: ",",
    skipEmptyRows: true,
};

export default function JsonToCsvPage() {
    const [input, setInput] = useState(sampleJson);
    const [output, setOutput] = useState("");
    const [options, setOptions] = useState<JsonToCsvOptions>(defaultOptions);
    const [error, setError] = useState("");
    const [stats, setStats] = useState<{
        rowCount: number;
        fieldCount: number;
        fields: string[];
    } | null>(null);

    function updateOption<Key extends keyof JsonToCsvOptions>(
        key: Key,
        value: JsonToCsvOptions[Key]
    ) {
        setOptions((currentOptions) => ({
            ...currentOptions,
            [key]: value,
        }));
    }

    function handleConvert() {
        const result = convertJsonToCsv(input, options);

        if (!result.success) {
            setError(result.error);
            setOutput("");
            setStats(null);
            return;
        }

        setError("");
        setOutput(result.csv);
        setStats({
            rowCount: result.rowCount,
            fieldCount: result.fieldCount,
            fields: result.fields,
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
        setInput(sampleJson);
        setOutput("");
        setError("");
        setStats(null);
    }

    function handleDownloadCsv() {
        if (!output) return;

        const blob = new Blob([output], {
            type: "text/csv;charset=utf-8",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "dev-swiss-knife-output.csv";
        link.click();

        URL.revokeObjectURL(url);
    }

    return (
        <ToolShell
            title="JSON to CSV Converter"
            description="Convert JSON arrays into CSV with custom delimiters, optional headers, and downloadable output."
        >
            <div className="grid gap-6 lg:grid-cols-2">
                <section className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-medium text-foreground">JSON Input</h2>
                            <p className="text-sm text-muted-foreground">
                                Paste a JSON array of objects here.
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
                        placeholder='[{"name":"Soham","role":"Developer"}]'
                        className="min-h-[360px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
                    />

                    <div className="grid gap-3 rounded-2xl border border-border bg-background/50 p-4 sm:grid-cols-2">
                        <JsonCsvOption
                            label="Include header row"
                            checked={options.header}
                            onChange={(checked) => updateOption("header", checked)}
                        />

                        <JsonCsvOption
                            label="Skip empty rows"
                            checked={options.skipEmptyRows}
                            onChange={(checked) => updateOption("skipEmptyRows", checked)}
                        />

                        <div className="space-y-2 sm:col-span-2">
                            <label className="text-sm font-medium text-foreground">
                                Delimiter
                            </label>

                            <Select
                                value={options.delimiter}
                                onValueChange={(value) =>
                                    updateOption(
                                        "delimiter",
                                        value as JsonToCsvOptions["delimiter"]
                                    )
                                }
                            >
                                <SelectTrigger className="rounded-full bg-background/70">
                                    <SelectValue placeholder="Delimiter" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value=",">Comma</SelectItem>
                                    <SelectItem value=";">Semicolon</SelectItem>
                                    <SelectItem value="\t">Tab</SelectItem>
                                    <SelectItem value="|">Pipe</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button type="button" onClick={handleConvert} className="rounded-full">
                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                            Convert to CSV
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
                            <h2 className="text-sm font-medium text-foreground">CSV Output</h2>
                            <p className="text-sm text-muted-foreground">
                                Converted CSV appears here.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <CopyButton value={output} />

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={!output}
                                onClick={handleDownloadCsv}
                                className="rounded-full"
                            >
                                Download
                            </Button>
                        </div>
                    </div>

                    <Textarea
                        value={output}
                        readOnly
                        spellCheck={false}
                        placeholder="CSV output will appear here..."
                        className="min-h-[360px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
                    />

                    {stats ? (
                        <div className="space-y-3">
                            <div className="grid gap-3 sm:grid-cols-2">
                                <StatCard label="Rows" value={stats.rowCount} />
                                <StatCard label="Fields" value={stats.fieldCount} />
                            </div>

                            {stats.fields.length > 0 ? (
                                <div className="rounded-2xl border border-border bg-background/60 p-4">
                                    <p className="text-xs text-muted-foreground">Detected Fields</p>

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
                        </div>
                    ) : null}
                </section>
            </div>
        </ToolShell>
    );
}

type JsonCsvOptionProps = {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
};

function JsonCsvOption({ label, checked, onChange }: JsonCsvOptionProps) {
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
            <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                {value}
            </p>
        </div>
    );
}