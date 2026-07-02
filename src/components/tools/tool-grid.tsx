import type { Tool } from "@/types/tool";
import { ToolCard } from "@/components/tools/tool-card";

type ToolGridProps = {
    tools: Tool[];
};

export function ToolGrid({ tools }: ToolGridProps) {
    if (tools.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-border bg-card/70 p-10 text-center text-muted-foreground">
                No tools found.
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
            ))}
        </div>
    );
}