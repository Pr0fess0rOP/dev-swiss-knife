"use client";

import { useState } from "react";
import { ArrowDownUp, FileJson, Sparkles, Trash2 } from "lucide-react";

import { ToolShell } from "@/components/tools/tool-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    convertCsvToJson,
    type CsvDelimiter,
    type CsvToJsonOptions,
} from "@/lib/csv/csv-utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const sampleCsv = `name,email,role,active,score
Soham,soham@example.com,Developer,true,95
Ava,ava@example.com,Designer,true,88
Noah,noah@example.com,Engineer,false,76`;

const defaultOptions: CsvToJsonOptions = {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
    delimiter: "auto",
};

export default function CsvToJsonPage() {
    const [input, setInput] = useState(sampleCsv);
    const [output, setOutput] = useState("");
    const [options, setOptions] = useState<CsvToJsonOptions>(defaultOptions);
    const [error, setError] = useState("");
    const [stats, setStats] = useState<{
        rowCount: number;
        fieldCount: number;
        fields: string[];
        warnings: string[];
    } | null>(null);

    function updateOption<Key extends keyof CsvToJsonOptions>(
        key: Key,
        value: CsvToJsonOptions[Key]
    ) {
        setOptions((currentOptions) => ({
            ...currentOptions,
            [key]: value,
        }));
    }

    function handleConvert() {
        const result = convertCsvToJson(input, options);

        if (!result.success) {
            setError(result.error);
            setOutput("");
            setStats(null);
            return;
        }

        setError("");
        setOutput(result.json);
        setStats({
            rowCount: result.rowCount,
            fieldCount: result.fieldCount,
            fields: result.fields,
            warnings: result.warnings,
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
        setInput(sampleCsv);
        setOutput("");
        setError("");
        setStats(null);
    }

    return (
        <ToolShell
            title="CSV to JSON Converter"
            description="Convert CSV data into formatted JSON with support for headers, dynamic typing, empty-line handling, and delimiter selection."
        >
            <div className="grid gap-6 lg:grid-cols-2">
                <section className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-medium text-foreground">CSV Input</h2>
                            <p className="text-sm text-muted-foreground">
                                Paste CSV data here.
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
                        placeholder="name,email,role&#10;Soham,soham@example.com,Developer"
                        className="min-h-[360px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
                    />

                    <div className="grid gap-3 rounded-2xl border border-border bg-background/50 p-4 sm:grid-cols-2">
                        <CsvOption
                            label="First row is header"
                            checked={options.header}
                            onChange={(checked) => updateOption("header", checked)}
                        />

                        <CsvOption
                            label="Skip empty lines"
                            checked={options.skipEmptyLines}
                            onChange={(checked) => updateOption("skipEmptyLines", checked)}
                        />

                        <CsvOption
                            label="Dynamic typing"
                            checked={options.dynamicTyping}
                            onChange={(checked) => updateOption("dynamicTyping", checked)}
                        />

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Delimiter
                            </label>

                            <Select
                                value={options.delimiter}
                                onValueChange={(value) =>
                                    updateOption("delimiter", value as CsvDelimiter)
                                }
                            >
                                <SelectTrigger className="rounded-full bg-background/70">
                                    <SelectValue placeholder="Delimiter" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="auto">Auto detect</SelectItem>
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
                            <FileJson className="mr-2 h-4 w-4" />
                            Convert to JSON
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
                            <h2 className="text-sm font-medium text-foreground">
                                JSON Output
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Formatted JSON appears here.
                            </p>
                        </div>

                        <CopyButton value={output} />
                    </div>

                    <Textarea
                        value={output}
                        readOnly
                        spellCheck={false}
                        placeholder="JSON output will appear here..."
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

                            {stats.warnings.length > 0 ? (
                                <div className="rounded-2xl border border-border bg-background/60 p-4">
                                    <p className="text-xs text-muted-foreground">Warnings</p>

                                    <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                                        {stats.warnings.slice(0, 5).map((warning) => (
                                            <li key={warning}>{warning}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                </section>
            </div>
        </ToolShell>
    );
}

type CsvOptionProps = {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
};

function CsvOption({ label, checked, onChange }: CsvOptionProps) {
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