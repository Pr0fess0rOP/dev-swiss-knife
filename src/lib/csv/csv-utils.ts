import Papa from "papaparse";

export type CsvDelimiter = "auto" | "," | ";" | "\\t" | "|";

export type CsvToJsonOptions = {
    header: boolean;
    skipEmptyLines: boolean;
    dynamicTyping: boolean;
    delimiter: CsvDelimiter;
};

export type CsvToJsonResult =
    | {
        success: true;
        json: string;
        rowCount: number;
        fieldCount: number;
        fields: string[];
        warnings: string[];
    }
    | {
        success: false;
        error: string;
    };

function getDelimiterValue(delimiter: CsvDelimiter): string | undefined {
    if (delimiter === "auto") return undefined;
    if (delimiter === "\\t") return "\t";
    return delimiter;
}

export function convertCsvToJson(
    input: string,
    options: CsvToJsonOptions
): CsvToJsonResult {
    if (!input.trim()) {
        return {
            success: false,
            error: "Please enter CSV data to convert.",
        };
    }

    try {
        const parseResult = Papa.parse<Record<string, unknown> | unknown[]>(input, {
            header: options.header,
            skipEmptyLines: options.skipEmptyLines,
            dynamicTyping: options.dynamicTyping,
            delimiter: getDelimiterValue(options.delimiter),
            transformHeader: (header) => header.trim(),
        });

        const data = parseResult.data;

        if (!data || data.length === 0) {
            return {
                success: false,
                error: "No rows found in the CSV input.",
            };
        }

        const warnings = parseResult.errors.map(
            (error) => `Row ${error.row ?? "unknown"}: ${error.message}`
        );

        const fields = options.header
            ? parseResult.meta.fields ?? []
            : Array.isArray(data[0])
                ? data[0].map((_, index) => `Column ${index + 1}`)
                : [];

        return {
            success: true,
            json: JSON.stringify(data, null, 2),
            rowCount: data.length,
            fieldCount: fields.length,
            fields,
            warnings,
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
            error: "Could not convert CSV to JSON.",
        };
    }
}

export type JsonToCsvOptions = {
    header: boolean;
    delimiter: "," | ";" | "\t" | "|";
    skipEmptyRows: boolean;
};

export type JsonToCsvResult =
    | {
        success: true;
        csv: string;
        rowCount: number;
        fieldCount: number;
        fields: string[];
    }
    | {
        success: false;
        error: string;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function convertJsonToCsv(
    input: string,
    options: JsonToCsvOptions
): JsonToCsvResult {
    if (!input.trim()) {
        return {
            success: false,
            error: "Please enter JSON data to convert.",
        };
    }

    try {
        const parsedJson = JSON.parse(input);

        if (!Array.isArray(parsedJson)) {
            return {
                success: false,
                error: "JSON input must be an array of objects.",
            };
        }

        if (parsedJson.length === 0) {
            return {
                success: false,
                error: "JSON array is empty.",
            };
        }

        const rows = options.skipEmptyRows
            ? parsedJson.filter((row) => {
                if (!isRecord(row)) return false;
                return Object.values(row).some(
                    (value) => value !== null && value !== undefined && value !== ""
                );
            })
            : parsedJson;

        if (rows.length === 0) {
            return {
                success: false,
                error: "No valid rows found in the JSON input.",
            };
        }

        const invalidRowIndex = rows.findIndex((row) => !isRecord(row));

        if (invalidRowIndex !== -1) {
            return {
                success: false,
                error: `Row ${invalidRowIndex + 1} is not a valid object.`,
            };
        }

        const fields = Array.from(
            new Set(
                rows.flatMap((row) => Object.keys(row as Record<string, unknown>))
            )
        );

        const csv = Papa.unparse(rows, {
            header: options.header,
            delimiter: options.delimiter,
            columns: fields,
        });

        return {
            success: true,
            csv,
            rowCount: rows.length,
            fieldCount: fields.length,
            fields,
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
            error: "Could not convert JSON to CSV.",
        };
    }
}