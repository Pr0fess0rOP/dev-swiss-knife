"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Eye, Sparkles, Trash2 } from "lucide-react";

import { ToolShell } from "@/components/tools/tool-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const sampleMarkdown = `# Dev Swiss Knife

A minimal developer toolbox for everyday work.

## Features

- JSON formatter
- JWT decoder
- Code diff checker
- Regex tester
- Markdown previewer

## Task List

- [x] Build homepage
- [x] Add JSON formatter
- [x] Add Base64 tool
- [ ] Add PDF tools

## Example Code

\`\`\`ts
const project = "dev-swiss-knife";

function sayHello(name: string) {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Table

| Tool | Status |
|---|---|
| JSON Formatter | Done |
| Markdown Previewer | In Progress |
| PDF Tools | Planned |

> Clean tools. Calm workspace. Browser-first utilities.
`;

export default function MarkdownPreviewerPage() {
    const [markdown, setMarkdown] = useState(sampleMarkdown);

    function handleLoadSample() {
        setMarkdown(sampleMarkdown);
    }

    function handleClear() {
        setMarkdown("");
    }

    return (
        <ToolShell
            title="Markdown Previewer"
            description="Write Markdown and preview the rendered output instantly with support for tables, task lists, code blocks, and blockquotes."
        >
            <div className="grid gap-6 lg:grid-cols-2">
                <section className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-medium text-foreground">
                                Markdown Input
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Type or paste Markdown here.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
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

                            <CopyButton value={markdown} />
                        </div>
                    </div>

                    <Textarea
                        value={markdown}
                        onChange={(event) => setMarkdown(event.target.value)}
                        spellCheck={false}
                        placeholder="# Start writing Markdown..."
                        className="min-h-[560px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
                    />

                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleClear}
                        className="rounded-full text-muted-foreground"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear
                    </Button>
                </section>

                <section className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="flex items-center text-sm font-medium text-foreground">
                                <Eye className="mr-2 h-4 w-4" />
                                Live Preview
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Rendered Markdown appears here.
                            </p>
                        </div>
                    </div>

                    <div className="min-h-[560px] overflow-auto rounded-2xl border border-border bg-background/70 p-6">
                        {markdown.trim() ? (
                            <div className="prose prose-neutral max-w-none">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {markdown}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Preview will appear here.
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </ToolShell>
    );
}