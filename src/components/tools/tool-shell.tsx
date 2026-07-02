import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

type ToolShellProps = {
    title: string;
    description: string;
    children: React.ReactNode;
};

export function ToolShell({ title, description, children }: ToolShellProps) {
    return (
        <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-8">
                <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="mb-5 rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to tools
                    </Link>
                </Button>

                <div className="rounded-3xl border border-border/80 bg-card/80 p-6 shadow-sm sm:p-8">
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                        {title}
                    </h1>

                    <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
                        {description}
                    </p>
                </div>
            </div>

            <div className="rounded-3xl border border-border/80 bg-card/80 p-4 shadow-sm sm:p-6">
                {children}
            </div>
        </main>
    );
}