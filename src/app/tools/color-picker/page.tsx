"use client";

import { useMemo, useState } from "react";
import { Pipette, Palette, RefreshCw } from "lucide-react";

import { ToolShell } from "@/components/tools/tool-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    getColorInfo,
    hslToHex,
    isValidHexColor,
    normalizeHex,
    type HslColor,
} from "@/lib/color/color-utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const defaultColor = "#D6C3A5";

const presetColors = [
    "#D6C3A5",
    "#F8F5F0",
    "#FFFDF9",
    "#2F2A24",
    "#6B6257",
    "#4F46E5",
    "#16A34A",
    "#DC2626",
    "#F59E0B",
    "#0EA5E9",
];

export default function ColorPickerPage() {
    const [hexInput, setHexInput] = useState(defaultColor);
    const [showDropperNotice, setShowDropperNotice] = useState(false);
    const [isPickingColor, setIsPickingColor] = useState(false);
    const [dropperError, setDropperError] = useState("");

    const colorInfo = useMemo(() => getColorInfo(hexInput), [hexInput]);
    const activeColor = colorInfo.success ? colorInfo.hex : defaultColor;

    const hslColor: HslColor = colorInfo.success
        ? colorInfo.hsl
        : {
            h: 36,
            s: 33,
            l: 72,
        };

    function handleTextInputChange(value: string) {
        if (isValidHexColor(value)) {
            setHexInput(normalizeHex(value));
            return;
        }

        setHexInput(value);
    }

    function handleHslChange(key: keyof HslColor, value: number) {
        const nextHsl = {
            ...hslColor,
            [key]: value,
        };

        setHexInput(hslToHex(nextHsl));
    }

    function handlePresetClick(color: string) {
        setHexInput(color);
    }

    function handleReset() {
        setHexInput(defaultColor);
    }


    // async function handlePickFromScreen() {
    //     setDropperError("");

    //     type EyeDropperResult = {
    //         sRGBHex: string;
    //     };

    //     type EyeDropperConstructor = new () => {
    //         open: () => Promise<EyeDropperResult>;
    //     };

    //     const EyeDropperCtor = (
    //         window as Window & typeof globalThis & {
    //             EyeDropper?: EyeDropperConstructor;
    //         }
    //     ).EyeDropper;

    //     if (!EyeDropperCtor) {
    //         setDropperError(
    //             "EyeDropper API is not supported in this browser. Try Chrome or Edge."
    //         );
    //         return;
    //     }

    //     try {
    //         setIsPickingColor(true);

    //         const eyeDropper = new EyeDropperCtor();
    //         const result = await eyeDropper.open();

    //         setHexInput(normalizeHex(result.sRGBHex));
    //     } catch (error) {
    //         if (error instanceof DOMException && error.name === "AbortError") {
    //             setDropperError("Color picking was cancelled.");
    //         } else {
    //             setDropperError("Could not pick a color from the screen.");
    //         }
    //     } finally {
    //         setIsPickingColor(false);
    //     }
    // }
    function handlePickFromScreen() {
        setShowDropperNotice(true);
    }

    return (
        <ToolShell
            title="Color Picker"
            description="Pick colors using an in-page HSL picker and convert HEX values into RGB, HSL, CSS variables, and Tailwind classes."
        >
            <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
                <section className="space-y-5">
                    <div>
                        <h2 className="text-sm font-medium text-foreground">Pick Color</h2>
                        <p className="text-sm text-muted-foreground">
                            Use the custom picker below. No native Windows popup involved.
                        </p>
                    </div>

                    <div
                        className="flex min-h-[220px] items-center justify-center rounded-3xl border border-border shadow-sm"
                        style={{ backgroundColor: activeColor }}
                    >
                        <div className="rounded-2xl border border-white/40 bg-white/70 px-5 py-3 text-center shadow-sm backdrop-blur">
                            <Palette className="mx-auto h-6 w-6 text-foreground" />
                            <p className="mt-2 font-mono text-lg font-semibold text-foreground">
                                {activeColor}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5 rounded-2xl border border-border bg-background/50 p-4">
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground">
                                Preset Colors
                            </label>

                            <div className="grid grid-cols-5 gap-3">
                                {presetColors.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => handlePresetClick(color)}
                                        className="h-12 rounded-2xl border border-border shadow-sm transition-transform hover:scale-105"
                                        style={{ backgroundColor: color }}
                                        aria-label={`Select ${color}`}
                                    />
                                ))}
                            </div>
                        </div>


                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground">
                                Screen Color Dropper
                            </label>

                            <Button
                                type="button"
                                onClick={handlePickFromScreen}
                                disabled={isPickingColor}
                                className="w-full rounded-full"
                            >
                                <Pipette className="mr-2 h-4 w-4" />
                                {/* {isPickingColor ? "Picking color..." : "Pick from Screen"} */}
                                Pick from Screen
                            </Button>

                            <p className="text-xs text-muted-foreground">
                                Temporarily disabled because of a Chromium color picker issue.
                            </p>

                            {dropperError ? (
                                <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                                    {dropperError}
                                </div>
                            ) : null}

                            <p className="text-xs text-muted-foreground">
                                Select any visible pixel from your screen.
                            </p>
                        </div>



                        <div className="space-y-4">
                            <ColorSlider
                                label="Hue"
                                value={hslColor.h}
                                min={0}
                                max={360}
                                suffix="°"
                                gradient="linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)"
                                onChange={(value) => handleHslChange("h", value)}
                            />

                            <ColorSlider
                                label="Saturation"
                                value={hslColor.s}
                                min={0}
                                max={100}
                                suffix="%"
                                gradient={`linear-gradient(to right, hsl(${hslColor.h}, 0%, ${hslColor.l}%), hsl(${hslColor.h}, 100%, ${hslColor.l}%))`}
                                onChange={(value) => handleHslChange("s", value)}
                            />

                            <ColorSlider
                                label="Lightness"
                                value={hslColor.l}
                                min={0}
                                max={100}
                                suffix="%"
                                gradient={`linear-gradient(to right, hsl(${hslColor.h}, ${hslColor.s}%, 0%), hsl(${hslColor.h}, ${hslColor.s}%, 50%), hsl(${hslColor.h}, ${hslColor.s}%, 100%))`}
                                onChange={(value) => handleHslChange("l", value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                HEX Value
                            </label>

                            <Input
                                value={hexInput}
                                onChange={(event) => handleTextInputChange(event.target.value)}
                                placeholder="#D6C3A5"
                                className="rounded-full bg-background/70 font-mono"
                            />
                        </div>
                    </div>

                    {!colorInfo.success ? (
                        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                            {colorInfo.error}
                        </div>
                    ) : null}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        className="rounded-full"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reset
                    </Button>
                </section>

                <section className="space-y-5">
                    {colorInfo.success ? (
                        <>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <ColorValueCard label="HEX" value={colorInfo.hex} />
                                <ColorValueCard label="RGB" value={colorInfo.rgbString} />
                                <ColorValueCard label="HSL" value={colorInfo.hslString} />
                                <ColorValueCard
                                    label="CSS Variable"
                                    value={colorInfo.cssVariable}
                                />
                            </div>

                            <div className="rounded-2xl border border-border bg-background/60 p-4">
                                <div className="mb-4">
                                    <h2 className="text-sm font-medium text-foreground">
                                        Tailwind Classes
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Useful for arbitrary Tailwind color values.
                                    </p>
                                </div>

                                <div className="grid gap-3">
                                    <ColorCodeRow label="Background" value={colorInfo.tailwindBg} />
                                    <ColorCodeRow label="Text" value={colorInfo.tailwindText} />
                                    <ColorCodeRow label="Border" value={colorInfo.tailwindBorder} />
                                </div>
                            </div>

                            <div className="rounded-2xl border border-border bg-background/60 p-4">
                                <div className="mb-4">
                                    <h2 className="text-sm font-medium text-foreground">
                                        Simple Palette
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Lighter and darker variations of the selected color.
                                    </p>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-3">
                                    {colorInfo.palette.map((color, index) => (
                                        <div
                                            key={`${color}-${index}`}
                                            className="overflow-hidden rounded-2xl border border-border bg-card"
                                        >
                                            <div
                                                className="h-20"
                                                style={{ backgroundColor: color }}
                                            />

                                            <div className="flex items-center justify-between gap-2 p-3">
                                                <span className="font-mono text-xs text-muted-foreground">
                                                    {color}
                                                </span>

                                                <CopyButton value={color} label="Copy" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="rounded-2xl border border-border bg-background/60 p-8 text-center text-sm text-muted-foreground">
                            Enter a valid HEX color to see conversions.
                        </div>
                    )}
                </section>
            </div>


            <AlertDialog open={showDropperNotice} onOpenChange={setShowDropperNotice}>
                <AlertDialogContent className="rounded-3xl border-border bg-card">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Color dropper temporarily disabled</AlertDialogTitle>

                        <AlertDialogDescription className="leading-7">
                            This feature is currently disabled because Chromium-based browsers can
                            trigger a stuck or invisible native color picker window on some Windows
                            systems. You can still use the preset swatches, HSL sliders, and HEX
                            input safely.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogAction className="rounded-full">
                            Got it
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </ToolShell>
    );
}

type ColorSliderProps = {
    label: string;
    value: number;
    min: number;
    max: number;
    suffix: string;
    gradient: string;
    onChange: (value: number) => void;
};

function ColorSlider({
    label,
    value,
    min,
    max,
    suffix,
    gradient,
    onChange,
}: ColorSliderProps) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-medium text-foreground">{label}</label>

                <span className="font-mono text-sm text-muted-foreground">
                    {value}
                    {suffix}
                </span>
            </div>

            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(event) => onChange(Number(event.target.value))}
                className="h-3 w-full cursor-pointer appearance-none rounded-full border border-border"
                style={{
                    background: gradient,
                }}
            />
        </div>
    );
}

type ColorValueCardProps = {
    label: string;
    value: string;
};

function ColorValueCard({ label, value }: ColorValueCardProps) {
    return (
        <div className="rounded-2xl border border-border bg-background/60 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <CopyButton value={value} label="Copy" />
            </div>

            <p className="break-all font-mono text-sm font-medium text-foreground">
                {value}
            </p>
        </div>
    );
}

type ColorCodeRowProps = {
    label: string;
    value: string;
};

function ColorCodeRow({ label, value }: ColorCodeRowProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card/70 p-3">
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-mono text-sm text-foreground">{value}</p>
            </div>

            <CopyButton value={value} label="Copy" />
        </div>
    );
}