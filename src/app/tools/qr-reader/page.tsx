"use client";

import { useRef, useState } from "react";
import { ImageUp, QrCode, Trash2, Upload } from "lucide-react";

import { ToolShell } from "@/components/tools/tool-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { readQrCodeFromImage } from "@/lib/qr/qr-reader-utils";

export default function QrReaderPage() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [previewUrl, setPreviewUrl] = useState("");
    const [fileName, setFileName] = useState("");
    const [decodedText, setDecodedText] = useState("");
    const [error, setError] = useState("");
    const [imageInfo, setImageInfo] = useState<{
        width: number;
        height: number;
        size: number;
    } | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    async function handleFileChange(file: File | undefined) {
        if (!file) return;

        setIsScanning(true);
        setError("");
        setDecodedText("");

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        const nextPreviewUrl = URL.createObjectURL(file);

        setPreviewUrl(nextPreviewUrl);
        setFileName(file.name);

        const result = await readQrCodeFromImage(file);

        if (!result.success) {
            setError(result.error);
            setDecodedText("");
            setImageInfo(null);
            setIsScanning(false);
            return;
        }

        setDecodedText(result.text);
        setImageInfo({
            width: result.width,
            height: result.height,
            size: file.size,
        });
        setError("");
        setIsScanning(false);
    }

    function handleClear() {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        setPreviewUrl("");
        setFileName("");
        setDecodedText("");
        setError("");
        setImageInfo(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    function formatBytes(bytes: number): string {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    return (
        <ToolShell
            title="QR Code Reader"
            description="Upload an image and decode the QR code directly in your browser."
        >
            <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
                <section className="space-y-5">
                    <div>
                        <h2 className="text-sm font-medium text-foreground">Upload Image</h2>
                        <p className="text-sm text-muted-foreground">
                            Select a PNG, JPG, JPEG, or WebP image containing a QR code.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex min-h-[260px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background/60 p-6 text-center transition-colors hover:border-primary/60 hover:bg-background/80"
                    >
                        <ImageUp className="h-10 w-10 text-muted-foreground" />

                        <p className="mt-4 text-sm font-medium text-foreground">
                            Click to upload QR image
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Image is processed locally in your browser.
                        </p>
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        className="hidden"
                        onChange={(event) => handleFileChange(event.target.files?.[0])}
                    />

                    <div className="flex flex-wrap gap-3">
                        <Button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="rounded-full"
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Choose Image
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

                    {error ? (
                        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                            {error}
                        </div>
                    ) : null}

                    {imageInfo ? (
                        <div className="rounded-2xl border border-border bg-background/60 p-4 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">File:</span>{" "}
                            {fileName}
                            <br />
                            <span className="font-medium text-foreground">Dimensions:</span>{" "}
                            {imageInfo.width} × {imageInfo.height}
                            <br />
                            <span className="font-medium text-foreground">Size:</span>{" "}
                            {formatBytes(imageInfo.size)}
                        </div>
                    ) : null}
                </section>

                <section className="space-y-5">
                    <div>
                        <h2 className="text-sm font-medium text-foreground">Preview</h2>
                        <p className="text-sm text-muted-foreground">
                            Uploaded image and decoded QR content.
                        </p>
                    </div>

                    <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-border bg-background/70 p-6">
                        {previewUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={previewUrl}
                                alt="Uploaded QR preview"
                                className="max-h-[260px] max-w-full rounded-2xl border border-border bg-white p-3 shadow-sm"
                            />
                        ) : (
                            <div className="text-center">
                                <QrCode className="mx-auto h-10 w-10 text-muted-foreground" />
                                <p className="mt-3 text-sm text-muted-foreground">
                                    Uploaded image preview will appear here.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-sm font-medium text-foreground">
                                    Decoded Text
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    QR code result appears here.
                                </p>
                            </div>

                            <CopyButton value={decodedText} />
                        </div>

                        <Textarea
                            value={
                                isScanning
                                    ? "Scanning image..."
                                    : decodedText
                            }
                            readOnly
                            spellCheck={false}
                            placeholder="Decoded QR text will appear here..."
                            className="min-h-[220px] resize-none rounded-2xl bg-background/70 font-mono text-sm leading-6"
                        />
                    </div>
                </section>
            </div>
        </ToolShell>
    );
}