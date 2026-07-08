import {
    decodeJwt,
    decodeProtectedHeader,
    SignJWT,
    type JWTPayload,
} from "jose";

export type JwtDecodeResult =
    | {
        success: true;
        header: string;
        payload: string;
        rawHeader: unknown;
        rawPayload: JWTPayload;
        expiryStatus: string;
    }
    | {
        success: false;
        error: string;
    };

export type JwtGenerateOptions = {
    secret: string;
    issuer: string;
    audience: string;
    subject: string;
    expiresIn: string;
    customClaims: string;
};

export type JwtGenerateResult =
    | {
        success: true;
        token: string;
        payload: string;
    }
    | {
        success: false;
        error: string;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function getExpiryStatus(payload: JWTPayload): string {
    if (!payload.exp) {
        return "No expiration claim found.";
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);
    const secondsRemaining = payload.exp - nowInSeconds;

    if (secondsRemaining <= 0) {
        return "Expired";
    }

    const minutesRemaining = Math.floor(secondsRemaining / 60);
    const hoursRemaining = Math.floor(minutesRemaining / 60);
    const daysRemaining = Math.floor(hoursRemaining / 24);

    if (daysRemaining > 0) {
        return `Valid for about ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}.`;
    }

    if (hoursRemaining > 0) {
        return `Valid for about ${hoursRemaining} hour${hoursRemaining === 1 ? "" : "s"}.`;
    }

    if (minutesRemaining > 0) {
        return `Valid for about ${minutesRemaining} minute${minutesRemaining === 1 ? "" : "s"}.`;
    }

    return `Valid for ${secondsRemaining} second${secondsRemaining === 1 ? "" : "s"}.`;
}

export function decodeJwtToken(token: string): JwtDecodeResult {
    const trimmedToken = token.trim();

    if (!trimmedToken) {
        return {
            success: false,
            error: "Please enter a JWT token to decode.",
        };
    }

    const tokenParts = trimmedToken.split(".");

    if (tokenParts.length !== 3) {
        return {
            success: false,
            error: "JWT must have three parts: header.payload.signature.",
        };
    }

    try {
        const header = decodeProtectedHeader(trimmedToken);
        const payload = decodeJwt(trimmedToken);

        return {
            success: true,
            header: JSON.stringify(header, null, 2),
            payload: JSON.stringify(payload, null, 2),
            rawHeader: header,
            rawPayload: payload,
            expiryStatus: getExpiryStatus(payload),
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
            error: "Could not decode JWT.",
        };
    }
}

export async function generateJwtToken(
    options: JwtGenerateOptions
): Promise<JwtGenerateResult> {
    if (!options.secret.trim()) {
        return {
            success: false,
            error: "Please enter a signing secret.",
        };
    }

    let customClaims: Record<string, unknown> = {};

    if (options.customClaims.trim()) {
        try {
            const parsedClaims = JSON.parse(options.customClaims);

            if (!isRecord(parsedClaims)) {
                return {
                    success: false,
                    error: "Custom claims must be a JSON object.",
                };
            }

            customClaims = parsedClaims;
        } catch (error) {
            if (error instanceof Error) {
                return {
                    success: false,
                    error: `Invalid custom claims JSON: ${error.message}`,
                };
            }

            return {
                success: false,
                error: "Invalid custom claims JSON.",
            };
        }
    }

    try {
        const secret = new TextEncoder().encode(options.secret);

        let jwtBuilder = new SignJWT(customClaims as JWTPayload)
            .setProtectedHeader({
                alg: "HS256",
                typ: "JWT",
            })
            .setIssuedAt();

        if (options.expiresIn.trim()) {
            jwtBuilder = jwtBuilder.setExpirationTime(options.expiresIn.trim());
        }

        if (options.issuer.trim()) {
            jwtBuilder = jwtBuilder.setIssuer(options.issuer.trim());
        }

        if (options.audience.trim()) {
            jwtBuilder = jwtBuilder.setAudience(options.audience.trim());
        }

        if (options.subject.trim()) {
            jwtBuilder = jwtBuilder.setSubject(options.subject.trim());
        }

        const token = await jwtBuilder.sign(secret);
        const decoded = decodeJwtToken(token);

        return {
            success: true,
            token,
            payload: decoded.success ? decoded.payload : "{}",
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
            error: "Could not generate JWT.",
        };
    }
}