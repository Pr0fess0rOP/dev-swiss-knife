export type JsonFormatOptions = {
    spaces?: number;
    sortKeys?: boolean;
};

export type JsonFormatResult =
    | {
        success: true;
        formatted: string;
        minified: string;
    }
    | {
        success: false;
        error: string;
    };

function sortJsonKeys(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map(sortJsonKeys);
    }

    if (value !== null && typeof value === "object") {
        return Object.keys(value as Record<string, unknown>)
            .sort()
            .reduce<Record<string, unknown>>((sortedObject, key) => {
                sortedObject[key] = sortJsonKeys(
                    (value as Record<string, unknown>)[key]
                );
                return sortedObject;
            }, {});
    }

    return value;
}

export function formatJson(
    input: string,
    options: JsonFormatOptions = {}
): JsonFormatResult {
    const trimmedInput = input.trim();

    if (!trimmedInput) {
        return {
            success: false,
            error: "Please enter JSON to format.",
        };
    }

    try {
        const parsedJson = JSON.parse(trimmedInput);
        const finalJson = options.sortKeys ? sortJsonKeys(parsedJson) : parsedJson;

        return {
            success: true,
            formatted: JSON.stringify(finalJson, null, options.spaces ?? 2),
            minified: JSON.stringify(finalJson),
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
            error: "Invalid JSON.",
        };
    }
}
