export type DuplicateLineOptions = {
    trimLines: boolean;
    ignoreCase: boolean;
    removeEmptyLines: boolean;
    sortOutput: boolean;
};

export type DuplicateLineResult =
    | {
        success: true;
        value: string;
        originalLineCount: number;
        finalLineCount: number;
        removedLineCount: number;
    }
    | {
        success: false;
        error: string;
    };

function normalizeLine(line: string, options: DuplicateLineOptions): string {
    let normalizedLine = options.trimLines ? line.trim() : line;

    if (options.ignoreCase) {
        normalizedLine = normalizedLine.toLowerCase();
    }

    return normalizedLine;
}

export function removeDuplicateLines(
    input: string,
    options: DuplicateLineOptions
): DuplicateLineResult {
    if (!input.trim()) {
        return {
            success: false,
            error: "Please enter text with multiple lines.",
        };
    }

    const lines = input.split(/\r?\n/);
    const seenLines = new Set<string>();
    const uniqueLines: string[] = [];

    for (const line of lines) {
        const outputLine = options.trimLines ? line.trim() : line;

        if (options.removeEmptyLines && outputLine.length === 0) {
            continue;
        }

        const normalizedLine = normalizeLine(line, options);

        if (!seenLines.has(normalizedLine)) {
            seenLines.add(normalizedLine);
            uniqueLines.push(outputLine);
        }
    }

    const finalLines = options.sortOutput
        ? [...uniqueLines].sort((a, b) => a.localeCompare(b))
        : uniqueLines;

    return {
        success: true,
        value: finalLines.join("\n"),
        originalLineCount: lines.length,
        finalLineCount: finalLines.length,
        removedLineCount: lines.length - finalLines.length,
    };
}