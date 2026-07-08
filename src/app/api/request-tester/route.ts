import { NextResponse } from "next/server";
import type { HttpMethod } from "@/lib/api/request-types";

type RequestTesterPayload = {
    url: string;
    method: HttpMethod;
    headers?: Record<string, string>;
    body?: string;
    timeoutMs?: number;
};

function isBlockedHostname(hostname: string): boolean {
    const cleanHostname = hostname.toLowerCase();

    if (
        cleanHostname === "localhost" ||
        cleanHostname === "127.0.0.1" ||
        cleanHostname === "0.0.0.0" ||
        cleanHostname === "::1" ||
        cleanHostname === "host.docker.internal"
    ) {
        return true;
    }

    if (
        cleanHostname.startsWith("127.") ||
        cleanHostname.startsWith("10.") ||
        cleanHostname.startsWith("192.168.") ||
        cleanHostname.startsWith("169.254.")
    ) {
        return true;
    }

    const match172 = cleanHostname.match(/^172\.(\d+)\./);

    if (match172) {
        const secondOctet = Number(match172[1]);

        if (secondOctet >= 16 && secondOctet <= 31) {
            return true;
        }
    }

    return false;
}

function validateUrl(urlInput: string): URL {
    const url = new URL(urlInput);

    if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error("Only HTTP and HTTPS URLs are allowed.");
    }

    if (isBlockedHostname(url.hostname)) {
        throw new Error("Local/private network URLs are blocked for safety.");
    }

    return url;
}

export async function POST(request: Request) {
    const startedAt = performance.now();

    try {
        const payload = (await request.json()) as RequestTesterPayload;

        if (!payload.url?.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Request URL is required.",
                },
                { status: 400 }
            );
        }

        const url = validateUrl(payload.url.trim());
        const method = payload.method || "GET";
        const timeoutMs = Math.min(Math.max(payload.timeoutMs ?? 15000, 1000), 30000);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, timeoutMs);

        const shouldIncludeBody =
            payload.body && !["GET", "HEAD"].includes(method);

        const response = await fetch(url.toString(), {
            method,
            headers: payload.headers ?? {},
            body: shouldIncludeBody ? payload.body : undefined,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const responseText = await response.text();
        const durationMs = Math.round(performance.now() - startedAt);

        return NextResponse.json({
            success: true,
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            durationMs,
            headers: Object.fromEntries(response.headers.entries()),
            body: responseText.slice(0, 250_000),
            truncated: responseText.length > 250_000,
            sizeBytes: new TextEncoder().encode(responseText).length,
            contentType: response.headers.get("content-type") ?? "",
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Request failed unexpectedly.";

        return NextResponse.json(
            {
                success: false,
                error: message,
            },
            { status: 400 }
        );
    }
}