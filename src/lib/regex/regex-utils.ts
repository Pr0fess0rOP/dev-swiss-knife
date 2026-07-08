export type RegexFlags = {
    global: boolean;
    caseInsensitive: boolean;
    multiline: boolean;
    dotAll: boolean;
};

export type RegexMatch = {
    match: string;
    index: number;
    groups: string[];
};

export type RegexTestResult =
    | {
        success: true;
        matches: RegexMatch[];
        highlightedText: string;
        flags: string;
    }
    | {
        success: false;
        error: string;
    };

export function buildRegexFlags(flags: RegexFlags): string {
    return [
        flags.global ? "g" : "",
        flags.caseInsensitive ? "i" : "",
        flags.multiline ? "m" : "",
        flags.dotAll ? "s" : "",
    ].join("");
}

function escapeHtml(value: string): string {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

export function testRegex(
    pattern: string,
    testText: string,
    flags: RegexFlags
): RegexTestResult {
    if (!pattern.trim()) {
        return {
            success: false,
            error: "Please enter a regex pattern.",
        };
    }

    if (!testText) {
        return {
            success: false,
            error: "Please enter test text.",
        };
    }

    const regexFlags = buildRegexFlags(flags);

    try {
        const regex = new RegExp(pattern, regexFlags);
        const matches: RegexMatch[] = [];

        if (flags.global) {
            const allMatches = testText.matchAll(regex);

            for (const match of allMatches) {
                matches.push({
                    match: match[0],
                    index: match.index ?? 0,
                    groups: match.slice(1),
                });
            }
        } else {
            const match = regex.exec(testText);

            if (match) {
                matches.push({
                    match: match[0],
                    index: match.index,
                    groups: match.slice(1),
                });
            }
        }

        return {
            success: true,
            matches,
            highlightedText: highlightMatches(testText, matches),
            flags: regexFlags,
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                error: error.message,
            };
        }

        return {
            success: false,
            error: "Invalid regex pattern.",
        };
    }
}

export function highlightMatches(text: string, matches: RegexMatch[]): string {
    if (matches.length === 0) {
        return escapeHtml(text);
    }

    const sortedMatches = [...matches].sort((a, b) => a.index - b.index);
    let currentIndex = 0;
    let highlighted = "";

    for (const match of sortedMatches) {
        const start = match.index;
        const end = match.index + match.match.length;

        if (start < currentIndex) {
            continue;
        }

        highlighted += escapeHtml(text.slice(currentIndex, start));

        highlighted += `<mark class="rounded-md bg-primary/40 px-1 text-foreground">${escapeHtml(
            text.slice(start, end)
        )}</mark>`;

        currentIndex = end;
    }

    highlighted += escapeHtml(text.slice(currentIndex));

    return highlighted;
}