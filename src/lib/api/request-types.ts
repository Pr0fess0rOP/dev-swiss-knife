export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD";

export type KeyValueRow = {
    id: string;
    key: string;
    value: string;
    enabled: boolean;
};

export type RequestBodyMode = "none" | "json" | "raw";

export const httpMethods: HttpMethod[] = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "HEAD",
];

export function createEmptyRow(): KeyValueRow {
    return {
        id: crypto.randomUUID(),
        key: "",
        value: "",
        enabled: true,
    };
}

export function rowsToObject(rows: KeyValueRow[]): Record<string, string> {
    return rows.reduce<Record<string, string>>((accumulator, row) => {
        if (row.enabled && row.key.trim()) {
            accumulator[row.key.trim()] = row.value;
        }

        return accumulator;
    }, {});
}