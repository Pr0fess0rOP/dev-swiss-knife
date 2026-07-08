export type ApiKeyEnvironment = "test" | "live" | "dev" | "prod";

export type ApiKeyOptions = {
    projectPrefix: string;
    environment: ApiKeyEnvironment;
    length: number;
    separator: "_" | "-" | ".";
};

export type ApiKeyResult =
    | {
        success: true;
        apiKey: string;
    }
    | {
        success: false;
        error: string;
    };

const alphabet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function sanitizePrefix(prefix: string): string {
    return prefix
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 12);
}

function getRandomIndex(max: number): number {
    const randomValues = new Uint32Array(1);
    window.crypto.getRandomValues(randomValues);
    return randomValues[0] % max;
}

function generateRandomString(length: number): string {
    return Array.from({ length }, () => alphabet[getRandomIndex(alphabet.length)])
        .join("");
}

export function generateApiKey(options: ApiKeyOptions): ApiKeyResult {
    if (!window.crypto?.getRandomValues) {
        return {
            success: false,
            error: "Secure random generation is not available in this browser.",
        };
    }

    const cleanPrefix = sanitizePrefix(options.projectPrefix);

    if (!cleanPrefix) {
        return {
            success: false,
            error: "Please enter a valid project prefix.",
        };
    }

    if (options.length < 16 || options.length > 128) {
        return {
            success: false,
            error: "API key length must be between 16 and 128 characters.",
        };
    }

    const randomPart = generateRandomString(options.length);

    return {
        success: true,
        apiKey: `${cleanPrefix}${options.separator}${options.environment}${options.separator}${randomPart}`,
    };
}