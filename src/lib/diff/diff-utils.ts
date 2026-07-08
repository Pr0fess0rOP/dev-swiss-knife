import {
    diffChars,
    diffLines,
    diffWordsWithSpace,
    type Change,
} from "diff";

export type DiffMode = "lines" | "words" | "characters";

export type DiffStats = {
    added: number;
    removed: number;
    unchanged: number;
    totalChanges: number;
};

export type DiffResult = {
    changes: Change[];
    stats: DiffStats;
    html: string;
    unifiedText: string;
};

function escapeHtml(value: string): string {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

function getDiffChanges(
    originalText: string,
    changedText: string,
    mode: DiffMode
): Change[] {
    if (mode === "words") {
        return diffWordsWithSpace(originalText, changedText);
    }

    if (mode === "characters") {
        return diffChars(originalText, changedText);
    }

    return diffLines(originalText, changedText);
}

function getChangeLineCount(change: Change, mode: DiffMode): number {
    if (mode === "lines") {
        return change.value.split(/\r?\n/).filter(Boolean).length;
    }

    return change.count ?? change.value.length;
}

function getStats(changes: Change[], mode: DiffMode): DiffStats {
    let added = 0;
    let removed = 0;
    let unchanged = 0;

    for (const change of changes) {
        const count = getChangeLineCount(change, mode);

        if (change.added) {
            added += count;
        } else if (change.removed) {
            removed += count;
        } else {
            unchanged += count;
        }
    }

    return {
        added,
        removed,
        unchanged,
        totalChanges: added + removed,
    };
}

function getChangeClass(change: Change): string {
    if (change.added) {
        return "bg-emerald-500/15 text-emerald-900";
    }

    if (change.removed) {
        return "bg-red-500/15 text-red-900 line-through decoration-red-900/50";
    }

    return "text-foreground";
}

function getChangePrefix(change: Change): string {
    if (change.added) return "+ ";
    if (change.removed) return "- ";
    return "  ";
}

function buildHtml(changes: Change[], mode: DiffMode): string {
    if (mode === "words" || mode === "characters") {
        return changes
            .map((change) => {
                return `<span class="${getChangeClass(change)}">${escapeHtml(
                    change.value
                )}</span>`;
            })
            .join("");
    }

    return changes
        .map((change) => {
            const prefix = getChangePrefix(change);

            return change.value
                .split(/\r?\n/)
                .map((line) => {
                    if (!line) return "";

                    return `<div class="px-3 py-1 ${getChangeClass(
                        change
                    )}"><span class="select-none text-muted-foreground">${prefix}</span>${escapeHtml(
                        line
                    )}</div>`;
                })
                .join("");
        })
        .join("");
}

function buildUnifiedText(changes: Change[]): string {
    return changes
        .map((change) => {
            const prefix = getChangePrefix(change);

            return change.value
                .split(/\r?\n/)
                .map((line) => {
                    if (!line) return "";
                    return `${prefix}${line}`;
                })
                .filter(Boolean)
                .join("\n");
        })
        .filter(Boolean)
        .join("\n");
}

export function createDiff(
    originalText: string,
    changedText: string,
    mode: DiffMode
): DiffResult {
    const changes = getDiffChanges(originalText, changedText, mode);

    return {
        changes,
        stats: getStats(changes, mode),
        html: buildHtml(changes, mode),
        unifiedText: buildUnifiedText(changes),
    };
}