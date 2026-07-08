import type { HttpMethod, KeyValueRow, RequestBodyMode } from "@/lib/api/request-types";

export type CurlGeneratorOptions = {
    url: string;
    method: HttpMethod;
    headers: KeyValueRow[];
    queryParams: KeyValueRow[];
    body: string;
    bodyMode: RequestBodyMode;
    compressed: boolean;
};

export type CurlGeneratorResult =
    | {
        success: true;
        command: string;
        finalUrl: string;
    }
    | {
        success: false;
        error: string;
    };

function shellEscape(value: string): string {
    return `'${value.replaceAll("'", "'\\''")}'`;
}

function addQueryParamsToUrl(urlInput: string, queryParams: KeyValueRow[]): string {
    const url = new URL(urlInput);

    queryParams.forEach((param) => {
        if (param.enabled && param.key.trim()) {
            url.searchParams.set(param.key.trim(), param.value);
        }
    });

    return url.toString();
}

export function generateCurlCommand(
    options: CurlGeneratorOptions
): CurlGeneratorResult {
    if (!options.url.trim()) {
        return {
            success: false,
            error: "Please enter a request URL.",
        };
    }

    try {
        const finalUrl = addQueryParamsToUrl(options.url.trim(), options.queryParams);

        const lines: string[] = [`curl ${shellEscape(finalUrl)}`];

        lines.push(`  -X ${options.method}`);

        options.headers.forEach((header) => {
            if (header.enabled && header.key.trim()) {
                lines.push(
                    `  -H ${shellEscape(`${header.key.trim()}: ${header.value}`)}`
                );
            }
        });

        const shouldIncludeBody =
            options.bodyMode !== "none" &&
            options.body.trim() &&
            !["GET", "HEAD"].includes(options.method);

        if (shouldIncludeBody) {
            if (
                options.bodyMode === "json" &&
                !options.headers.some(
                    (header) =>
                        header.enabled &&
                        header.key.trim().toLowerCase() === "content-type"
                )
            ) {
                lines.push(`  -H ${shellEscape("Content-Type: application/json")}`);
            }

            lines.push(`  --data ${shellEscape(options.body)}`);
        }

        if (options.compressed) {
            lines.push("  --compressed");
        }

        return {
            success: true,
            command: lines.join(" \\\n"),
            finalUrl,
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
            error: "Could not generate cURL command.",
        };
    }
}