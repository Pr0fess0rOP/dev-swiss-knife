"use client";

import { useMemo, useState } from "react";
import { Play, Plus, Trash2 } from "lucide-react";

import { ToolShell } from "@/components/tools/tool-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    createEmptyRow,
    httpMethods,
    rowsToObject,
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

type ApiTesterResponse =
    | {
        success: true;
        status: number;
        statusText: string;
        ok: boolean;
        durationMs: number;
        headers: Record<string, string>;
        body: string;
        truncated: boolean;
        sizeBytes: number;
        contentType: string;
    }
    | {
        success: false;
        error: string;
    };

export default function ApiTesterPage() {
    const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/posts/1");
    const [method, setMethod] = useState<HttpMethod>("GET");
    const [bodyMode, setBodyMode] = useState<RequestBodyMode>("none");
    const [body, setBody] = useState(`{
  "title": "Dev Swiss Knife",
  "body": "Testing API requests",
  "userId": 1
}`);
    const [timeoutMs, setTimeoutMs] = useState(15000);

    const [headers, setHeaders] = useState<KeyValueRow[]>([
        {
            id: crypto.randomUUID(),
            key: "Accept",
            value: "application/json",
            enabled: true,
        },
    ]);

    const [queryParams, setQueryParams] = useState<KeyValueRow[]>([]);
    const [response, setResponse] = useState<ApiTesterResponse | null>(null);
    const [isSending, setIsSending] = useState(false);

    const finalUrl = useMemo(() => {
        try {
            const parsedUrl = new URL(url);

            queryParams.forEach((param) => {
                if (param.enabled && param.key.trim()) {
                    parsedUrl.searchParams.set(param.key.trim(), param.value);
                }
            });

            return parsedUrl.toString();
        } catch {
            return url;
        }
    }, [url, queryParams]);

    const curlResult = useMemo(
        () =>
            generateCurlCommand({
                url,
                method,
                headers,
                queryParams,
                body,
                bodyMode,
                compressed: true,
            }),
        [url, method, headers, queryParams, body, bodyMode]
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

    async function handleSendRequest() {
        setIsSending(true);
        setResponse(null);

        const requestHeaders = rowsToObject(headers);

        if (
            bodyMode === "json" &&
            !Object.keys(requestHeaders).some(
                (headerName) => headerName.toLowerCase() === "content-type"
            )
        ) {
            requestHeaders["Content-Type"] = "application/json";
        }

        try {
            const apiResponse = await fetch("/api/request-tester", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url: finalUrl,
                    method,
                    headers: requestHeaders,
                    body: bodyMode === "none" ? "" : body,
                    timeoutMs,
                }),
            });

            const data = (await apiResponse.json()) as ApiTesterResponse;
            setResponse(data);
        } catch (error) {
            setResponse({
                success: false,
                error: error instanceof Error ? error.message : "Request failed.",
            });
        } finally {
            setIsSending(false);
        }
    }

    function clearResponse() {
        setResponse(null);
    }

    const responseBody =
        response?.success && response.body
            ? tryFormatJson(response.body)
            : "";

    const responseHeaders =
        response?.success
            ? JSON.stringify(response.headers, null, 2)
            : "";

    return (
        <ToolShell
            title="REST API Tester"
            description="Send HTTP requests, inspect response status, headers, body, duration, and generate matching cURL commands."
        >
            <div className="space-y-6">
                <section className="grid gap-3 lg:grid-cols-[140px_1fr_140px]">
                    <Select
                        value={method}
                        onValueChange={(value) => {
                            const nextMethod = value as HttpMethod;
                            setMethod(nextMethod);

                            if (nextMethod === "GET" || nextMethod === "HEAD") {
                                setBodyMode("none");
                            }
                        }}
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

                    <Button
                        type="button"
                        onClick={handleSendRequest}
                        disabled={isSending}
                        className="rounded-full"
                    >
                        <Play className="mr-2 h-4 w-4" />
                        {isSending ? "Sending..." : "Send"}
                    </Button>
                </section>

                <section className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-5">
                        <KeyValueEditor
                            title="Query Params"
                            rows={queryParams}
                            onAdd={() => setQueryParams((rows) => [...rows, createEmptyRow()])}
                            onUpdate={updateQueryParam}
                            onRemove={(id) =>
                                setQueryParams((rows) => rows.filter((row) => row.id !== id))
                            }
                        />

                        <KeyValueEditor
                            title="Headers"
                            rows={headers}
                            onAdd={() => setHeaders((rows) => [...rows, createEmptyRow()])}
                            onUpdate={updateHeader}
                            onRemove={(id) =>
                                setHeaders((rows) => rows.filter((row) => row.id !== id))
                            }
                        />

                        <div className="space-y-3 rounded-2xl border border-border bg-background/50 p-4">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-sm font-medium text-foreground">Body</h2>

                                <Select
                                    value={bodyMode}
                                    onValueChange={(value) => setBodyMode(value as RequestBodyMode)}
                                    disabled={method === "GET" || method === "HEAD"}
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
                                disabled={
                                    bodyMode === "none" || method === "GET" || method === "HEAD"
                                }
                                spellCheck={false}
                                placeholder='{"name":"Dev Swiss Knife"}'
                                className="min-h-[220px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Timeout ms
                            </label>

                            <Input
                                type="number"
                                min={1000}
                                max={30000}
                                value={timeoutMs}
                                onChange={(event) => setTimeoutMs(Number(event.target.value))}
                                className="rounded-full bg-background/70"
                            />
                        </div>

                        <div className="rounded-2xl border border-border bg-background/60 p-4">
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-sm font-medium text-foreground">
                                        Matching cURL
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Generated from this request.
                                    </p>
                                </div>

                                <CopyButton value={curlResult.success ? curlResult.command : ""} />
                            </div>

                            <Textarea
                                value={curlResult.success ? curlResult.command : ""}
                                readOnly
                                spellCheck={false}
                                className="min-h-[180px] resize-none rounded-2xl bg-background/70 font-mono text-xs leading-5"
                            />
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-sm font-medium text-foreground">Response</h2>
                                <p className="text-sm text-muted-foreground">
                                    Status, headers, and body appear here.
                                </p>
                            </div>

                            <Button
                                type="button"
                                variant="ghost"
                                onClick={clearResponse}
                                className="rounded-full text-muted-foreground"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Clear
                            </Button>
                        </div>

                        {response?.success ? (
                            <>
                                <div className="grid gap-3 sm:grid-cols-4">
                                    <ResponseStat label="Status" value={`${response.status}`} />
                                    <ResponseStat label="OK" value={response.ok ? "Yes" : "No"} />
                                    <ResponseStat label="Time" value={`${response.durationMs} ms`} />
                                    <ResponseStat label="Size" value={formatBytes(response.sizeBytes)} />
                                </div>

                                {response.truncated ? (
                                    <div className="rounded-2xl border border-border bg-background/60 p-4 text-sm text-muted-foreground">
                                        Response body was truncated to 250 KB for performance.
                                    </div>
                                ) : null}

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <h3 className="text-sm font-medium text-foreground">
                                            Response Body
                                        </h3>

                                        <CopyButton value={responseBody} />
                                    </div>

                                    <Textarea
                                        value={responseBody}
                                        readOnly
                                        spellCheck={false}
                                        className="min-h-[360px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <h3 className="text-sm font-medium text-foreground">
                                            Response Headers
                                        </h3>

                                        <CopyButton value={responseHeaders} />
                                    </div>

                                    <Textarea
                                        value={responseHeaders}
                                        readOnly
                                        spellCheck={false}
                                        className="min-h-[220px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
                                    />
                                </div>
                            </>
                        ) : response?.success === false ? (
                            <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                                {response.error}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-border bg-background/60 p-8 text-center text-sm text-muted-foreground">
                                Send a request to see the response.
                            </div>
                        )}
                    </div>
                </section>

                <div className="rounded-2xl border border-border bg-background/60 p-4 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Safety note:</span>{" "}
                    local/private network URLs are blocked in the backend route. Keep this
                    guard if you deploy the site publicly.
                </div>
            </div>
        </ToolShell>
    );
}

function tryFormatJson(value: string): string {
    try {
        return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
        return value;
    }
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type ResponseStatProps = {
    label: string;
    value: string;
};

function ResponseStat({ label, value }: ResponseStatProps) {
    return (
        <div className="rounded-2xl border border-border bg-background/60 p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                {value}
            </p>
        </div>
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