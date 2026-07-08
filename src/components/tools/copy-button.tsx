"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

type CopyButtonProps = {
    value: string;
    label?: string;
};

export function CopyButton({ value, label = "Copy" }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        if (!value) return;

        await navigator.clipboard.writeText(value);
        setCopied(true);

        window.setTimeout(() => {
            setCopied(false);
        }, 1200);
    }

    return (
        <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!value}
            className="rounded-full"
        >
            {copied ? (
                <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied
                </>
            ) : (
                <>
                    <Copy className="mr-2 h-4 w-4" />
                    {label}
                </>
            )}
        </Button>
    );
}