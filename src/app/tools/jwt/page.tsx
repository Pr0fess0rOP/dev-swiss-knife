"use client";

import { useState } from "react";
import { KeyRound, ScanSearch, Sparkles, Trash2 } from "lucide-react";

import { ToolShell } from "@/components/tools/tool-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    decodeJwtToken,
    generateJwtToken,
    type JwtGenerateOptions,
} from "@/lib/jwt/jwt-utils";

const sampleToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiRGV2IFN3aXNzIEtuaWZlIiwicm9sZSI6ImRldmVsb3BlciIsImlhdCI6MTcyMDAwMDAwMCwiZXhwIjo0MTAyNDQ0ODAwfQ.mWp09BXkLJAFZtIr2t3XsyMQVeOkrT48lQXY5E9uC7Y";

const defaultGenerateOptions: JwtGenerateOptions = {
    secret: "dev-swiss-knife-secret",
    issuer: "dev-swiss-knife",
    audience: "developers",
    subject: "user_123",
    expiresIn: "2h",
    customClaims: `{
  "name": "Soham Patel",
  "role": "developer",
  "project": "dev-swiss-knife"
}`,
};

export default function JwtPage() {
    const [decodeInput, setDecodeInput] = useState(sampleToken);
    const [decodedHeader, setDecodedHeader] = useState("");
    const [decodedPayload, setDecodedPayload] = useState("");
    const [decodeError, setDecodeError] = useState("");
    const [expiryStatus, setExpiryStatus] = useState("");

    const [generateOptions, setGenerateOptions] = useState<JwtGenerateOptions>(
        defaultGenerateOptions
    );
    const [generatedToken, setGeneratedToken] = useState("");
    const [generatedPayload, setGeneratedPayload] = useState("");
    const [generateError, setGenerateError] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    function updateGenerateOption<Key extends keyof JwtGenerateOptions>(
        key: Key,
        value: JwtGenerateOptions[Key]
    ) {
        setGenerateOptions((currentOptions) => ({
            ...currentOptions,
            [key]: value,
        }));
    }

    function handleDecode() {
        const result = decodeJwtToken(decodeInput);

        if (!result.success) {
            setDecodeError(result.error);
            setDecodedHeader("");
            setDecodedPayload("");
            setExpiryStatus("");
            return;
        }

        setDecodeError("");
        setDecodedHeader(result.header);
        setDecodedPayload(result.payload);
        setExpiryStatus(result.expiryStatus);
    }

    async function handleGenerate() {
        setIsGenerating(true);

        const result = await generateJwtToken(generateOptions);

        if (!result.success) {
            setGenerateError(result.error);
            setGeneratedToken("");
            setGeneratedPayload("");
            setIsGenerating(false);
            return;
        }

        setGenerateError("");
        setGeneratedToken(result.token);
        setGeneratedPayload(result.payload);
        setDecodeInput(result.token);
        setIsGenerating(false);
    }

    function handleLoadSample() {
        setDecodeInput(sampleToken);
        setDecodedHeader("");
        setDecodedPayload("");
        setDecodeError("");
        setExpiryStatus("");
    }

    function handleResetGenerator() {
        setGenerateOptions(defaultGenerateOptions);
        setGeneratedToken("");
        setGeneratedPayload("");
        setGenerateError("");
    }

    function handleClearDecoder() {
        setDecodeInput("");
        setDecodedHeader("");
        setDecodedPayload("");
        setDecodeError("");
        setExpiryStatus("");
    }

    function handleClearGenerator() {
        setGeneratedToken("");
        setGeneratedPayload("");
        setGenerateError("");
    }

    return (
        <ToolShell
            title="JWT Generator + Decoder"
            description="Generate HS256 test JWTs and decode JWT headers and payloads for quick inspection."
        >
            <div className="space-y-8">
                <section className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-sm font-medium text-foreground">
                                    JWT Decoder
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Decode JWT header and payload without verifying the signature.
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
                            value={decodeInput}
                            onChange={(event) => setDecodeInput(event.target.value)}
                            spellCheck={false}
                            placeholder="Paste JWT token here..."
                            className="min-h-[180px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
                        />

                        <div className="flex flex-wrap gap-3">
                            <Button type="button" onClick={handleDecode} className="rounded-full">
                                <ScanSearch className="mr-2 h-4 w-4" />
                                Decode JWT
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleClearDecoder}
                                className="rounded-full text-muted-foreground"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Clear
                            </Button>
                        </div>

                        {decodeError ? (
                            <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                                {decodeError}
                            </div>
                        ) : null}

                        {expiryStatus ? (
                            <div className="rounded-2xl border border-border bg-background/60 p-4 text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">Expiry:</span>{" "}
                                {expiryStatus}
                            </div>
                        ) : null}
                    </div>

                    <div className="space-y-4">
                        <DecodedBlock title="Header" value={decodedHeader} />
                        <DecodedBlock title="Payload" value={decodedPayload} />
                    </div>
                </section>

                <section className="rounded-3xl border border-border bg-background/50 p-5 sm:p-6">
                    <div className="mb-6">
                        <h2 className="text-sm font-medium text-foreground">
                            JWT Generator
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Generate signed HS256 JWTs for local development and testing.
                        </p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Secret
                                </label>

                                <Input
                                    value={generateOptions.secret}
                                    onChange={(event) =>
                                        updateGenerateOption("secret", event.target.value)
                                    }
                                    placeholder="your-secret"
                                    className="rounded-full bg-background/70 font-mono"
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <JwtInput
                                    label="Issuer"
                                    value={generateOptions.issuer}
                                    onChange={(value) => updateGenerateOption("issuer", value)}
                                    placeholder="dev-swiss-knife"
                                />

                                <JwtInput
                                    label="Audience"
                                    value={generateOptions.audience}
                                    onChange={(value) => updateGenerateOption("audience", value)}
                                    placeholder="developers"
                                />

                                <JwtInput
                                    label="Subject"
                                    value={generateOptions.subject}
                                    onChange={(value) => updateGenerateOption("subject", value)}
                                    placeholder="user_123"
                                />

                                <JwtInput
                                    label="Expires In"
                                    value={generateOptions.expiresIn}
                                    onChange={(value) => updateGenerateOption("expiresIn", value)}
                                    placeholder="2h"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Custom Claims JSON
                                </label>

                                <Textarea
                                    value={generateOptions.customClaims}
                                    onChange={(event) =>
                                        updateGenerateOption("customClaims", event.target.value)
                                    }
                                    spellCheck={false}
                                    placeholder='{"role":"admin"}'
                                    className="min-h-[180px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
                                />
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Button
                                    type="button"
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                    className="rounded-full"
                                >
                                    <KeyRound className="mr-2 h-4 w-4" />
                                    {isGenerating ? "Generating..." : "Generate JWT"}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleResetGenerator}
                                    className="rounded-full"
                                >
                                    Reset
                                </Button>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={handleClearGenerator}
                                    className="rounded-full text-muted-foreground"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Clear Output
                                </Button>
                            </div>

                            {generateError ? (
                                <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                                    {generateError}
                                </div>
                            ) : null}
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <h3 className="text-sm font-medium text-foreground">
                                            Generated Token
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Copy or decode the generated token.
                                        </p>
                                    </div>

                                    <CopyButton value={generatedToken} />
                                </div>

                                <Textarea
                                    value={generatedToken}
                                    readOnly
                                    spellCheck={false}
                                    placeholder="Generated JWT will appear here..."
                                    className="min-h-[180px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <h3 className="text-sm font-medium text-foreground">
                                            Generated Payload
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Decoded payload preview.
                                        </p>
                                    </div>

                                    <CopyButton value={generatedPayload} />
                                </div>

                                <Textarea
                                    value={generatedPayload}
                                    readOnly
                                    spellCheck={false}
                                    placeholder="Generated payload will appear here..."
                                    className="min-h-[220px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <div className="rounded-2xl border border-border bg-background/60 p-4 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Note:</span> Decoding a
                    JWT only shows its contents. It does not prove that the token is valid,
                    trusted, or safely signed. Use generated tokens for development and
                    testing only.
                </div>
            </div>
        </ToolShell>
    );
}

type DecodedBlockProps = {
    title: string;
    value: string;
};

function DecodedBlock({ title, value }: DecodedBlockProps) {
    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-medium text-foreground">{title}</h3>
                <CopyButton value={value} />
            </div>

            <Textarea
                value={value}
                readOnly
                spellCheck={false}
                placeholder={`${title} output will appear here...`}
                className="min-h-[220px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
            />
        </div>
    );
}

type JwtInputProps = {
    label: string;
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
};

function JwtInput({ label, value, placeholder, onChange }: JwtInputProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{label}</label>

            <Input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="rounded-full bg-background/70"
            />
        </div>
    );
}