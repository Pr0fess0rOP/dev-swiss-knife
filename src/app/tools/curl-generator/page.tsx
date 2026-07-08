"use client";

import { useMemo, useState } from "react";
import { Plus, Terminal, Trash2 } from "lucide-react";

import { ToolShell } from "@/components/tools/tool-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    createEmptyRow,
    httpMethods,
    type HttpMethod,
    type KeyValueRow,
    type RequestBodyMode,
} from "@/lib/api/request-types";
import { generateCurlCommand } from "@/lib/curl/curl-utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function CurlGeneratorPage() {
    const [url, setUrl] = useState("https://api.example.com/users");
    const [method, setMethod] = useState<HttpMethod>("POST");
    const [bodyMode, setBodyMode] = useState<RequestBodyMode>("json");
    const [compressed, setCompressed] = useState(true);

    const [headers, setHeaders] = useState<KeyValueRow[]>([
        {
            id: crypto.randomUUID(),
            key: "Authorization",
            value: "Bearer YOUR_TOKEN",
            enabled: true,
        },
    ]);

    const [queryParams, setQueryParams] = useState<KeyValueRow[]>([
        {
            id: crypto.randomUUID(),
            key: "limit",
            value: "10",
            enabled: true,
        },
    ]);

    const [body, setBody] = useState(`{
  "name": "Dev Swiss Knife",
  "type": "developer-tools"
}`);

    const result = useMemo(
        () =>
            generateCurlCommand({
                url,
                method,
                headers,
                queryParams,
                body,
                bodyMode,
                compressed,
            }),
        [url, method, headers, queryParams, body, bodyMode, compressed]
    );

    function updateHeader(id: string, key: keyof KeyValueRow, value: string | boolean) {
        setHeaders((currentHeaders) =>
            currentHeaders.map((header) =>
                header.id === id ? { ...header, [key]: value } : header
            )
        );
    }

    function updateQueryParam(
        id: string,
        key: keyof KeyValueRow,
        value: string | boolean
    ) {
        setQueryParams((currentParams) =>
            currentParams.map((param) =>
                param.id === id ? { ...param, [key]: value } : param
            )
        );
    }

    function removeHeader(id: string) {
        setHeaders((currentHeaders) =>
            currentHeaders.filter((header) => header.id !== id)
        );
    }

    function removeQueryParam(id: string) {
        setQueryParams((currentParams) =>
            currentParams.filter((param) => param.id !== id)
        );
    }

    return (
        <ToolShell
            title="cURL Generator"
            description="Build clean cURL commands from method, URL, headers, query params, and request body."
        >
            <div className="grid gap-6 lg:grid-cols-[460px_1fr]">
                <section className="space-y-5">
                    <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
                        <Select
                            value={method}
                            onValueChange={(value) => setMethod(value as HttpMethod)}
                        >
                            <SelectTrigger className="rounded-full bg-background/70">
                                <SelectValue placeholder="Method" />
                            </SelectTrigger>

                            <SelectContent>
                                {httpMethods.map((httpMethod) => (
                                    <SelectItem key={httpMethod} value={httpMethod}>
                                        {httpMethod}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Input
                            value={url}
                            onChange={(event) => setUrl(event.target.value)}
                            placeholder="https://api.example.com/users"
                            className="rounded-full bg-background/70 font-mono"
                        />
                    </div>

                    <KeyValueEditor
                        title="Query Params"
                        rows={queryParams}
                        onAdd={() => setQueryParams((rows) => [...rows, createEmptyRow()])}
                        onUpdate={updateQueryParam}
                        onRemove={removeQueryParam}
                    />

                    <KeyValueEditor
                        title="Headers"
                        rows={headers}
                        onAdd={() => setHeaders((rows) => [...rows, createEmptyRow()])}
                        onUpdate={updateHeader}
                        onRemove={removeHeader}
                    />

                    <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-sm font-medium text-foreground">Body</h2>

                            <Select
                                value={bodyMode}
                                onValueChange={(value) => setBodyMode(value as RequestBodyMode)}
                            >
                                <SelectTrigger className="w-[150px] rounded-full bg-background/70">
                                    <SelectValue placeholder="Body mode" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="json">JSON</SelectItem>
                                    <SelectItem value="raw">Raw</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Textarea
                            value={body}
                            onChange={(event) => setBody(event.target.value)}
                            disabled={bodyMode === "none" || method === "GET" || method === "HEAD"}
                            spellCheck={false}
                            placeholder='{"name":"Dev Swiss Knife"}'
                            className="min-h-[180px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
                        />
                    </div>

                    <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-background/50 p-4 text-sm text-foreground">
                        <input
                            type="checkbox"
                            checked={compressed}
                            onChange={(event) => setCompressed(event.target.checked)}
                            className="h-4 w-4 rounded border-border accent-[var(--primary)]"
                        />
                        Include <span className="font-mono">--compressed</span>
                    </label>
                </section>

                <section className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="flex items-center text-sm font-medium text-foreground">
                                <Terminal className="mr-2 h-4 w-4" />
                                Generated cURL
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Copy and run this command in your terminal.
                            </p>
                        </div>

                        <CopyButton value={result.success ? result.command : ""} />
                    </div>

                    {result.success ? (
                        <>
                            <Textarea
                                value={result.command}
                                readOnly
                                spellCheck={false}
                                className="min-h-[520px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
                            />

                            <div className="rounded-2xl border border-border bg-background/60 p-4 text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">Final URL:</span>{" "}
                                <span className="break-all font-mono">{result.finalUrl}</span>
                            </div>
                        </>
                    ) : (
                        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                            {result.error}
                        </div>
                    )}
                </section>
            </div>
        </ToolShell>
    );
}

type KeyValueEditorProps = {
    title: string;
    rows: KeyValueRow[];
    onAdd: () => void;
    onUpdate: (id: string, key: keyof KeyValueRow, value: string | boolean) => void;
    onRemove: (id: string) => void;
};

function KeyValueEditor({
    title,
    rows,
    onAdd,
    onUpdate,
    onRemove,
}: KeyValueEditorProps) {
    return (
        <div className="space-y-3 rounded-2xl border border-border bg-background/50 p-4">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-medium text-foreground">{title}</h2>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onAdd}
                    className="rounded-full"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add
                </Button>
            </div>

            <div className="space-y-3">
                {rows.map((row) => (
                    <div key={row.id} className="grid gap-2 sm:grid-cols-[32px_1fr_1fr_36px]">
                        <input
                            type="checkbox"
                            checked={row.enabled}
                            onChange={(event) => onUpdate(row.id, "enabled", event.target.checked)}
                            className="mt-3 h-4 w-4 rounded border-border accent-[var(--primary)]"
                        />

                        <Input
                            value={row.key}
                            onChange={(event) => onUpdate(row.id, "key", event.target.value)}
                            placeholder="Key"
                            className="rounded-full bg-background/70 font-mono"
                        />

                        <Input
                            value={row.value}
                            onChange={(event) => onUpdate(row.id, "value", event.target.value)}
                            placeholder="Value"
                            className="rounded-full bg-background/70 font-mono"
                        />

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemove(row.id)}
                            className="rounded-full text-muted-foreground"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}