"use client";

import { useState } from "react";
import { RefreshCw, ShieldCheck, Trash2 } from "lucide-react";

import { ToolShell } from "@/components/tools/tool-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    generatePassword,
    type PasswordOptions,
} from "@/lib/crypto/password-utils";

const defaultOptions: PasswordOptions = {
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeAmbiguous: true,
};

export default function PasswordGeneratorPage() {
    const [options, setOptions] = useState<PasswordOptions>(defaultOptions);
    const [password, setPassword] = useState("");
    const [strengthLabel, setStrengthLabel] = useState("");
    const [strengthScore, setStrengthScore] = useState(0);
    const [error, setError] = useState("");

    function updateOption<Key extends keyof PasswordOptions>(
        key: Key,
        value: PasswordOptions[Key]
    ) {
        setOptions((currentOptions) => ({
            ...currentOptions,
            [key]: value,
        }));
    }

    function handleGenerate() {
        const result = generatePassword(options);

        if (!result.success) {
            setError(result.error);
            setPassword("");
            setStrengthLabel("");
            setStrengthScore(0);
            return;
        }

        setError("");
        setPassword(result.password);
        setStrengthLabel(result.strengthLabel);
        setStrengthScore(result.strengthScore);
    }

    function handleClear() {
        setPassword("");
        setStrengthLabel("");
        setStrengthScore(0);
        setError("");
    }

    function handleReset() {
        setOptions(defaultOptions);
        setPassword("");
        setStrengthLabel("");
        setStrengthScore(0);
        setError("");
    }

    const strengthPercentage = Math.min((strengthScore / 6) * 100, 100);

    return (
        <ToolShell
            title="Password Generator"
            description="Generate secure random passwords with customizable length and character options."
        >
            <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
                <section className="space-y-5">
                    <div>
                        <h2 className="text-sm font-medium text-foreground">Options</h2>
                        <p className="text-sm text-muted-foreground">
                            Choose the password length and character types.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            Password Length
                        </label>

                        <Input
                            type="number"
                            min={4}
                            max={128}
                            value={options.length}
                            onChange={(event) =>
                                updateOption("length", Number(event.target.value))
                            }
                            className="rounded-full bg-background/70"
                        />

                        <p className="text-xs text-muted-foreground">
                            Recommended: 16 characters or more.
                        </p>
                    </div>

                    <div className="space-y-3 rounded-2xl border border-border bg-background/50 p-4">
                        <PasswordCheckbox
                            label="Include uppercase letters"
                            checked={options.includeUppercase}
                            onChange={(checked) => updateOption("includeUppercase", checked)}
                        />

                        <PasswordCheckbox
                            label="Include lowercase letters"
                            checked={options.includeLowercase}
                            onChange={(checked) => updateOption("includeLowercase", checked)}
                        />

                        <PasswordCheckbox
                            label="Include numbers"
                            checked={options.includeNumbers}
                            onChange={(checked) => updateOption("includeNumbers", checked)}
                        />

                        <PasswordCheckbox
                            label="Include symbols"
                            checked={options.includeSymbols}
                            onChange={(checked) => updateOption("includeSymbols", checked)}
                        />

                        <PasswordCheckbox
                            label="Exclude ambiguous characters"
                            checked={options.excludeAmbiguous}
                            onChange={(checked) => updateOption("excludeAmbiguous", checked)}
                        />
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button type="button" onClick={handleGenerate} className="rounded-full">
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Generate Password
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
                                Generated Password
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Copy the generated password from here.
                            </p>
                        </div>

                        <CopyButton value={password} />
                    </div>

                    <div className="rounded-2xl border border-border bg-background/70 p-5">
                        <div className="min-h-24 break-all font-mono text-lg leading-8 text-foreground">
                            {password || (
                                <span className="font-sans text-sm text-muted-foreground">
                                    Your generated password will appear here.
                                </span>
                            )}
                        </div>
                    </div>

                    {password ? (
                        <div className="rounded-2xl border border-border bg-background/60 p-4">
                            <div className="mb-3 flex items-center justify-between text-sm">
                                <span className="font-medium text-foreground">Strength</span>
                                <span className="text-muted-foreground">{strengthLabel}</span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-muted">
                                <div
                                    className="h-full rounded-full bg-primary transition-all"
                                    style={{ width: `${strengthPercentage}%` }}
                                />
                            </div>

                            <p className="mt-3 text-sm text-muted-foreground">
                                Length: {password.length} characters
                            </p>
                        </div>
                    ) : null}
                </section>
            </div>
        </ToolShell>
    );
}

type PasswordCheckboxProps = {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
};

function PasswordCheckbox({
    label,
    checked,
    onChange,
}: PasswordCheckboxProps) {
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