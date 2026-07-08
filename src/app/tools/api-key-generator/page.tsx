"use client";

import { useState } from "react";
import { KeyRound, RefreshCw, Trash2 } from "lucide-react";

import { ToolShell } from "@/components/tools/tool-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    generateApiKey,
    type ApiKeyEnvironment,
    type ApiKeyOptions,
} from "@/lib/crypto/api-key-utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const defaultOptions: ApiKeyOptions = {
    projectPrefix: "dsk",
    environment: "test",
    length: 32,
    separator: "_",
};

const environments: ApiKeyEnvironment[] = ["test", "live", "dev", "prod"];
const separators: ApiKeyOptions["separator"][] = ["_", "-", "."];

export default function ApiKeyGeneratorPage() {
    const [options, setOptions] = useState<ApiKeyOptions>(defaultOptions);
    const [apiKey, setApiKey] = useState("");
    const [error, setError] = useState("");

    function updateOption<Key extends keyof ApiKeyOptions>(
        key: Key,
        value: ApiKeyOptions[Key]
    ) {
        setOptions((currentOptions) => ({
            ...currentOptions,
            [key]: value,
        }));
    }

    function handleGenerate() {
        const result = generateApiKey(options);

        if (!result.success) {
            setError(result.error);
            setApiKey("");
            return;
        }

        setError("");
        setApiKey(result.apiKey);
    }

    function handleReset() {
        setOptions(defaultOptions);
        setApiKey("");
        setError("");
    }

    function handleClear() {
        setApiKey("");
        setError("");
    }

    return (
        <ToolShell
            title="API Key Generator"
            description="Generate random API-style keys with custom prefixes, environments, and separators."
        >
            <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
                <section className="space-y-5">
                    <div>
                        <h2 className="text-sm font-medium text-foreground">Options</h2>
                        <p className="text-sm text-muted-foreground">
                            Customize the prefix, environment, length, and separator.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            Project Prefix
                        </label>

                        <Input
                            value={options.projectPrefix}
                            onChange={(event) =>
                                updateOption("projectPrefix", event.target.value)
                            }
                            placeholder="dsk"
                            className="rounded-full bg-background/70"
                        />

                        <p className="text-xs text-muted-foreground">
                            Example: dsk, app, kairos, devkit. Only letters and numbers are kept.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Environment
                            </label>

                            <Select
                                value={options.environment}
                                onValueChange={(value) =>
                                    updateOption("environment", value as ApiKeyEnvironment)
                                }
                            >
                                <SelectTrigger className="rounded-full bg-background/70">
                                    <SelectValue placeholder="Select environment" />
                                </SelectTrigger>

                                <SelectContent>
                                    {environments.map((environment) => (
                                        <SelectItem key={environment} value={environment}>
                                            {environment}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Separator
                            </label>

                            <Select
                                value={options.separator}
                                onValueChange={(value) =>
                                    updateOption("separator", value as ApiKeyOptions["separator"])
                                }
                            >
                                <SelectTrigger className="rounded-full bg-background/70">
                                    <SelectValue placeholder="Select separator" />
                                </SelectTrigger>

                                <SelectContent>
                                    {separators.map((separator) => (
                                        <SelectItem key={separator} value={separator}>
                                            {separator}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            Random Part Length
                        </label>

                        <Input
                            type="number"
                            min={16}
                            max={128}
                            value={options.length}
                            onChange={(event) =>
                                updateOption("length", Number(event.target.value))
                            }
                            className="rounded-full bg-background/70"
                        />

                        <p className="text-xs text-muted-foreground">
                            Recommended: 32 characters or more.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-background/50 p-4 text-sm text-muted-foreground">
                        Preview format:
                        <div className="mt-2 break-all font-mono text-foreground">
                            {options.projectPrefix || "dsk"}
                            {options.separator}
                            {options.environment}
                            {options.separator}
                            {"x".repeat(Math.min(options.length || 0, 32))}
                            {options.length > 32 ? "..." : ""}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button type="button" onClick={handleGenerate} className="rounded-full">
                            <KeyRound className="mr-2 h-4 w-4" />
                            Generate API Key
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
                            <h2 className="text-sm font-medium text-foreground">
                                Generated API Key
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Copy the generated key from here.
                            </p>
                        </div>

                        <CopyButton value={apiKey} />
                    </div>

                    <div className="rounded-2xl border border-border bg-background/70 p-5">
                        <div className="min-h-24 break-all font-mono text-lg leading-8 text-foreground">
                            {apiKey || (
                                <span className="font-sans text-sm text-muted-foreground">
                                    Your generated API key will appear here.
                                </span>
                            )}
                        </div>
                    </div>

                    {apiKey ? (
                        <div className="rounded-2xl border border-border bg-background/60 p-4 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">Prefix:</span>{" "}
                            {options.projectPrefix}
                            <br />
                            <span className="font-medium text-foreground">Environment:</span>{" "}
                            {options.environment}
                            <br />
                            <span className="font-medium text-foreground">Total Length:</span>{" "}
                            {apiKey.length} characters
                        </div>
                    ) : null}
                </section>
            </div>
        </ToolShell>
    );
}