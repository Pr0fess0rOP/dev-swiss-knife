"use client";

import { useMemo, useState } from "react";
import { Clock, RefreshCw, Sparkles, Trash2 } from "lucide-react";

import { ToolShell } from "@/components/tools/tool-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    convertTimestamp,
    dateToUnixTimestamp,
    getCurrentUnixTimestamp,
    type TimestampUnit,
} from "@/lib/time/timestamp-utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function TimestampConverterPage() {
    const [unit, setUnit] = useState<TimestampUnit>("seconds");
    const [timestampInput, setTimestampInput] = useState(
        getCurrentUnixTimestamp("seconds")
    );
    const [dateInput, setDateInput] = useState("");
    const [dateToTimestampOutput, setDateToTimestampOutput] = useState("");
    const [dateError, setDateError] = useState("");

    const result = useMemo(
        () => convertTimestamp(timestampInput, unit),
        [timestampInput, unit]
    );

    function handleUseCurrentTime() {
        setTimestampInput(getCurrentUnixTimestamp(unit));
    }

    function handleUnitChange(nextUnit: TimestampUnit) {
        setUnit(nextUnit);
        setTimestampInput(getCurrentUnixTimestamp(nextUnit));
    }

    function handleClear() {
        setTimestampInput("");
        setDateInput("");
        setDateToTimestampOutput("");
        setDateError("");
    }

    function handleDateToTimestamp() {
        const conversionResult = dateToUnixTimestamp(dateInput, unit);

        if (!conversionResult.success) {
            setDateError(conversionResult.error);
            setDateToTimestampOutput("");
            return;
        }

        setDateError("");
        setDateToTimestampOutput(conversionResult.timestamp);
    }

    function handleUseCurrentDateTime() {
        const now = new Date();
        const localDateTime = new Date(
            now.getTime() - now.getTimezoneOffset() * 60000
        )
            .toISOString()
            .slice(0, 16);

        setDateInput(localDateTime);
        setDateError("");
    }

    return (
        <ToolShell
            title="Timestamp Converter"
            description="Convert Unix timestamps into readable dates and convert dates back into Unix timestamps."
        >
            <div className="grid gap-6 lg:grid-cols-2">
                <section className="space-y-5">
                    <div>
                        <h2 className="text-sm font-medium text-foreground">
                            Unix Timestamp to Date
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Enter a timestamp in seconds or milliseconds.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
                        <Input
                            value={timestampInput}
                            onChange={(event) => setTimestampInput(event.target.value)}
                            placeholder="1720000000"
                            className="rounded-full bg-background/70 font-mono"
                        />

                        <Select value={unit} onValueChange={handleUnitChange}>
                            <SelectTrigger className="rounded-full bg-background/70">
                                <SelectValue placeholder="Unit" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="seconds">Seconds</SelectItem>
                                <SelectItem value="milliseconds">Milliseconds</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button
                            type="button"
                            onClick={handleUseCurrentTime}
                            className="rounded-full"
                        >
                            <Clock className="mr-2 h-4 w-4" />
                            Current Timestamp
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleClear}
                            className="rounded-full text-muted-foreground"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Clear
                        </Button>
                    </div>

                    {result.success ? (
                        <div className="space-y-3">
                            <TimestampRow label="ISO" value={result.isoString} />
                            <TimestampRow label="UTC" value={result.utcString} />
                            <TimestampRow label="Local" value={result.localString} />
                            <TimestampRow label="Date" value={result.localeDate} />
                            <TimestampRow label="Time" value={result.localeTime} />
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                            {result.error}
                        </div>
                    )}
                </section>

                <section className="space-y-5">
                    <div>
                        <h2 className="text-sm font-medium text-foreground">
                            Date to Unix Timestamp
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Select a date and convert it into a Unix timestamp.
                        </p>
                    </div>

                    <Input
                        type="datetime-local"
                        value={dateInput}
                        onChange={(event) => setDateInput(event.target.value)}
                        className="rounded-full bg-background/70"
                    />

                    <div className="flex flex-wrap gap-3">
                        <Button
                            type="button"
                            onClick={handleDateToTimestamp}
                            className="rounded-full"
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Convert Date
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleUseCurrentDateTime}
                            className="rounded-full"
                        >
                            <Sparkles className="mr-2 h-4 w-4" />
                            Use Current
                        </Button>
                    </div>

                    {dateError ? (
                        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                            {dateError}
                        </div>
                    ) : null}

                    <div className="rounded-2xl border border-border bg-background/70 p-5">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm font-medium text-foreground">
                                    Timestamp Output
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Output uses the selected unit: {unit}.
                                </p>
                            </div>

                            <CopyButton value={dateToTimestampOutput} />
                        </div>

                        <div className="min-h-20 break-all font-mono text-lg leading-8 text-foreground">
                            {dateToTimestampOutput || (
                                <span className="font-sans text-sm text-muted-foreground">
                                    Converted timestamp will appear here.
                                </span>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </ToolShell>
    );
}

type TimestampRowProps = {
    label: string;
    value: string;
};

function TimestampRow({ label, value }: TimestampRowProps) {
    return (
        <div className="rounded-2xl border border-border bg-background/60 p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {label}
                </p>

                <CopyButton value={value} label="Copy" />
            </div>

            <p className="break-all font-mono text-sm leading-6 text-foreground">
                {value}
            </p>
        </div>
    );
}