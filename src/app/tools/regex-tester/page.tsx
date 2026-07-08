"use client";

import { useMemo, useState } from "react";
import { Search, Sparkles, Trash2 } from "lucide-react";

import { ToolShell } from "@/components/tools/tool-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { testRegex, type RegexFlags } from "@/lib/regex/regex-utils";

const samplePattern = "\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b";

const sampleText = `Contact the team at hello@devswissknife.com.

For billing, email billing@example.com.
For support, email support@tools.dev.

Invalid examples:
hello@
not-an-email
admin@example`;

const defaultFlags: RegexFlags = {
    global: true,
    caseInsensitive: true,
    multiline: false,
    dotAll: false,
};

export default function RegexTesterPage() {
    const [pattern, setPattern] = useState(samplePattern);
    const [testText, setTestText] = useState(sampleText);
    const [flags, setFlags] = useState<RegexFlags>(defaultFlags);

    const result = useMemo(
        () => testRegex(pattern, testText, flags),
        [pattern, testText, flags]
    );

    function updateFlag<Key extends keyof RegexFlags>(
        key: Key,
        value: RegexFlags[Key]
    ) {
        setFlags((currentFlags) => ({
            ...currentFlags,
            [key]: value,
        }));
    }

    function handleLoadSample() {
        setPattern(samplePattern);
        setTestText(sampleText);
        setFlags(defaultFlags);
    }

    function handleClear() {
        setPattern("");
        setTestText("");
    }

    const outputText = result.success
        ? result.matches
            .map((match, index) => {
                const groups =
                    match.groups.length > 0
                        ? `\n  Groups: ${match.groups
                            .map((group, groupIndex) => `$${groupIndex + 1}: ${group}`)
                            .join(", ")}`
                        : "";

                return `${index + 1}. "${match.match}" at index ${match.index}${groups}`;
            })
            .join("\n\n")
        : "";

    return (
        <ToolShell
            title="Regex Tester"
            description="Test regular expressions against sample text with flags, match highlighting, and captured groups."
        >
            <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
                <section className="space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-medium text-foreground">
                                Pattern & Test Text
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Enter a regex pattern without surrounding slashes.
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

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            Regex Pattern
                        </label>

                        <Input
                            value={pattern}
                            onChange={(event) => setPattern(event.target.value)}
                            placeholder="\\b\\w+@\\w+\\.com\\b"
                            spellCheck={false}
                            className="rounded-full bg-background/70 font-mono"
                        />
                    </div>

                    <div className="grid gap-3 rounded-2xl border border-border bg-background/50 p-4 sm:grid-cols-2">
                        <RegexFlag
                            label="Global"
                            code="g"
                            checked={flags.global}
                            onChange={(checked) => updateFlag("global", checked)}
                        />

                        <RegexFlag
                            label="Case insensitive"
                            code="i"
                            checked={flags.caseInsensitive}
                            onChange={(checked) => updateFlag("caseInsensitive", checked)}
                        />

                        <RegexFlag
                            label="Multiline"
                            code="m"
                            checked={flags.multiline}
                            onChange={(checked) => updateFlag("multiline", checked)}
                        />

                        <RegexFlag
                            label="Dot all"
                            code="s"
                            checked={flags.dotAll}
                            onChange={(checked) => updateFlag("dotAll", checked)}
                        />
                    </div>

                    <Textarea
                        value={testText}
                        onChange={(event) => setTestText(event.target.value)}
                        spellCheck={false}
                        placeholder="Paste test text here..."
                        className="min-h-[360px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
                    />

                    <div className="flex flex-wrap items-center gap-3">
                        <Button type="button" disabled className="rounded-full opacity-100">
                            <Search className="mr-2 h-4 w-4" />
                            Live Testing
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

                    {!result.success ? (
                        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                            {result.error}
                        </div>
                    ) : null}
                </section>

                <section className="space-y-5">
                    <div className="rounded-2xl border border-border bg-background/60 p-4">
                        <p className="text-xs text-muted-foreground">Matches</p>
                        <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
                            {result.success ? result.matches.length : 0}
                        </p>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Flags:{" "}
                            <span className="font-mono text-foreground">
                                /{result.success ? result.flags : ""}
                            </span>
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-sm font-medium text-foreground">
                                    Highlighted Text
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Matching sections are highlighted below.
                                </p>
                            </div>
                        </div>

                        <div
                            className="min-h-[180px] whitespace-pre-wrap rounded-2xl border border-border bg-background/70 p-4 font-mono text-sm leading-7 text-foreground"
                            dangerouslySetInnerHTML={{
                                __html: result.success
                                    ? result.highlightedText
                                    : "Highlighted output will appear here.",
                            }}
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-sm font-medium text-foreground">
                                    Match Details
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Indexes and captured groups.
                                </p>
                            </div>

                            <CopyButton value={outputText} />
                        </div>

                        <Textarea
                            value={outputText}
                            readOnly
                            spellCheck={false}
                            placeholder="Match details will appear here..."
                            className="min-h-[220px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
                        />
                    </div>
                </section>
            </div>
        </ToolShell>
    );
}

type RegexFlagProps = {
    label: string;
    code: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
};

function RegexFlag({ label, code, checked, onChange }: RegexFlagProps) {
    return (
        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border bg-card/60 px-3 py-2 text-sm text-foreground">
            <span>
                {label}{" "}
                <span className="font-mono text-xs text-muted-foreground">/{code}</span>
            </span>

            <input
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
                className="h-4 w-4 rounded border-border accent-[var(--primary)]"
            />
        </label>
    );
}