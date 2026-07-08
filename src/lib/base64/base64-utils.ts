export type Base64Result =
    | {
        success: true;
        value: string;
    }
    | {
        success: false;
        error: string;
    };

export function encodeBase64(input: string): Base64Result {
    if (!input) {
        return {
            success: false,
            error: "Please enter text to encode.",
        };
    }

    try {
        const encoded = btoa(unescape(encodeURIComponent(input)));

        return {
            success: true,
            value: encoded,
        };
    } catch {
        return {
            success: false,
            error: "Could not encode the input.",
        };
    }
}

export function decodeBase64(input: string): Base64Result {
    const trimmedInput = input.trim();

    if (!trimmedInput) {
        return {
            success: false,
            error: "Please enter Base64 text to decode.",
        };
    }

    try {
        const decoded = decodeURIComponent(escape(atob(trimmedInput)));

        return {
            success: true,
            value: decoded,
        };
    } catch {
        return {
            success: false,
            error: "Invalid Base64 input.",
        };
    }
}