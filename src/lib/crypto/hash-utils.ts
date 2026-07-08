export type HashAlgorithm = "SHA-256" | "SHA-384" | "SHA-512";

export type HashResult =
    | {
        success: true;
        hash: string;
    }
    | {
        success: false;
        error: string;
    };

export const hashAlgorithms: HashAlgorithm[] = ["SHA-256", "SHA-384", "SHA-512"];

function bufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}

export async function generateHash(
    input: string,
    algorithm: HashAlgorithm
): Promise<HashResult> {
    if (!input) {
        return {
            success: false,
            error: "Please enter text to hash.",
        };
    }

    try {
        if (!window.crypto?.subtle) {
            return {
                success: false,
                error: "Web Crypto API is not available in this browser.",
            };
        }

        const encodedInput = new TextEncoder().encode(input);
        const hashBuffer = await window.crypto.subtle.digest(algorithm, encodedInput);

        return {
            success: true,
            hash: bufferToHex(hashBuffer),
        };
    } catch {
        return {
            success: false,
            error: "Could not generate hash.",
        };
    }
}