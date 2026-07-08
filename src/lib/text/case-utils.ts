export type CaseType =
    | "camel"
    | "pascal"
    | "snake"
    | "kebab"
    | "constant"
    | "title"
    | "sentence"
    | "lower"
    | "upper";

export type CaseConversionResult =
    | {
        success: true;
        value: string;
    }
    | {
        success: false;
        error: string;
    };

export const caseTypes: { label: string; value: CaseType }[] = [
    { label: "camelCase", value: "camel" },
    { label: "PascalCase", value: "pascal" },
    { label: "snake_case", value: "snake" },
    { label: "kebab-case", value: "kebab" },
    { label: "CONSTANT_CASE", value: "constant" },
    { label: "Title Case", value: "title" },
    { label: "Sentence case", value: "sentence" },
    { label: "lowercase", value: "lower" },
    { label: "UPPERCASE", value: "upper" },
];

function splitWords(input: string): string[] {
    return input
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[_\-./]+/g, " ")
        .replace(/[^\w\s]/g, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
}

function capitalizeWord(word: string): string {
    if (!word) return "";
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function toCamelCase(words: string[]): string {
    return words
        .map((word, index) => {
            const lowerWord = word.toLowerCase();
            return index === 0 ? lowerWord : capitalizeWord(lowerWord);
        })
        .join("");
}

function toPascalCase(words: string[]): string {
    return words.map((word) => capitalizeWord(word)).join("");
}

function toSnakeCase(words: string[]): string {
    return words.map((word) => word.toLowerCase()).join("_");
}

function toKebabCase(words: string[]): string {
    return words.map((word) => word.toLowerCase()).join("-");
}

function toConstantCase(words: string[]): string {
    return words.map((word) => word.toUpperCase()).join("_");
}

function toTitleCase(words: string[]): string {
    return words.map((word) => capitalizeWord(word)).join(" ");
}

function toSentenceCase(words: string[]): string {
    const sentence = words.map((word) => word.toLowerCase()).join(" ");
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

export function convertCase(input: string, caseType: CaseType): CaseConversionResult {
    if (!input.trim()) {
        return {
            success: false,
            error: "Please enter text to convert.",
        };
    }

    if (caseType === "lower") {
        return {
            success: true,
            value: input.toLowerCase(),
        };
    }

    if (caseType === "upper") {
        return {
            success: true,
            value: input.toUpperCase(),
        };
    }

    const words = splitWords(input);

    if (words.length === 0) {
        return {
            success: false,
            error: "No valid words found in the input.",
        };
    }

    switch (caseType) {
        case "camel":
            return {
                success: true,
                value: toCamelCase(words),
            };

        case "pascal":
            return {
                success: true,
                value: toPascalCase(words),
            };

        case "snake":
            return {
                success: true,
                value: toSnakeCase(words),
            };

        case "kebab":
            return {
                success: true,
                value: toKebabCase(words),
            };

        case "constant":
            return {
                success: true,
                value: toConstantCase(words),
            };

        case "title":
            return {
                success: true,
                value: toTitleCase(words),
            };

        case "sentence":
            return {
                success: true,
                value: toSentenceCase(words),
            };

        default:
            return {
                success: false,
                error: "Unsupported case type.",
            };
    }
}