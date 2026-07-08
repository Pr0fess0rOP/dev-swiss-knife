export type UrlCodecResult =
    | {
        success: true;
        value: string;
    }
    | {
        success: false;
        error: string;
    };

export function encodeUrl(input: string): UrlCodecResult {
    if (!input.trim()) {
        return {
            success: false,
            error: "Please enter text or a URL to encode.",
        };
    }

    try {
        return {
            success: true,
            value: encodeURIComponent(input),
        };
    } catch {
        return {
            success: false,
            error: "Could not encode the input.",
        };
    }
}

export function decodeUrl(input: string): UrlCodecResult {
    if (!input.trim()) {
        return {
            success: false,
            error: "Please enter encoded text or URL to decode.",
        };
    }

    try {
        return {
            success: true,
            value: decodeURIComponent(input),
        };
    } catch {
        return {
            success: false,
            error: "Invalid encoded URL input.",
        };
    }
}