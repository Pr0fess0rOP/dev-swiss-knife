export type TimestampUnit = "seconds" | "milliseconds";

export type TimestampConversionResult =
    | {
        success: true;
        timestamp: number;
        unit: TimestampUnit;
        date: Date;
        isoString: string;
        utcString: string;
        localString: string;
        localeDate: string;
        localeTime: string;
    }
    | {
        success: false;
        error: string;
    };

export function getCurrentUnixTimestamp(unit: TimestampUnit): string {
    const now = Date.now();

    if (unit === "seconds") {
        return Math.floor(now / 1000).toString();
    }

    return now.toString();
}

export function convertTimestamp(
    input: string,
    unit: TimestampUnit
): TimestampConversionResult {
    const trimmedInput = input.trim();

    if (!trimmedInput) {
        return {
            success: false,
            error: "Please enter a Unix timestamp.",
        };
    }

    const numericTimestamp = Number(trimmedInput);

    if (!Number.isFinite(numericTimestamp)) {
        return {
            success: false,
            error: "Timestamp must be a valid number.",
        };
    }

    const milliseconds =
        unit === "seconds" ? numericTimestamp * 1000 : numericTimestamp;

    const date = new Date(milliseconds);

    if (Number.isNaN(date.getTime())) {
        return {
            success: false,
            error: "Invalid timestamp.",
        };
    }

    return {
        success: true,
        timestamp: numericTimestamp,
        unit,
        date,
        isoString: date.toISOString(),
        utcString: date.toUTCString(),
        localString: date.toString(),
        localeDate: date.toLocaleDateString(),
        localeTime: date.toLocaleTimeString(),
    };
}

export function dateToUnixTimestamp(dateInput: string, unit: TimestampUnit) {
    if (!dateInput) {
        return {
            success: false as const,
            error: "Please select a date and time.",
        };
    }

    const date = new Date(dateInput);

    if (Number.isNaN(date.getTime())) {
        return {
            success: false as const,
            error: "Invalid date and time.",
        };
    }

    const milliseconds = date.getTime();

    return {
        success: true as const,
        timestamp:
            unit === "seconds"
                ? Math.floor(milliseconds / 1000).toString()
                : milliseconds.toString(),
    };
}