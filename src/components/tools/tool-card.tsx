import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Tool } from "@/types/tool";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ToolCardProps = {
    tool: Tool;
};

export function ToolCard({ tool }: ToolCardProps) {
    return (
        <Link href={`/tools/${tool.slug}`} className="group block h-full">
            <Card className="h-full rounded-2xl border border-border/80 bg-card/90 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md">
                <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <Badge
                            variant="secondary"
                            className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground shadow-none"
                        >
                            {tool.category}
                        </Badge>

                        <div className="rounded-full border border-border bg-background p-2 text-muted-foreground transition-colors group-hover:border-primary/60 group-hover:text-foreground">
                            <ArrowUpRight className="h-4 w-4" />
                        </div>
                    </div>

                    <div>
                        <CardTitle className="text-lg font-semibold tracking-tight">
                            {tool.title}
                        </CardTitle>

                        <CardDescription className="mt-2 line-clamp-2 leading-6">
                            {tool.description}
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {tool.tags?.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full border border-border/80 bg-background px-2.5 py-1 text-xs text-muted-foreground"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}