import QRCode from "qrcode";

export type QrErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export type QrCodeOptions = {
    size: number;
    margin: number;
    errorCorrectionLevel: QrErrorCorrectionLevel;
    darkColor: string;
    lightColor: string;
};

export type QrCodeResult =
    | {
        success: true;
        dataUrl: string;
    }
    | {
        success: false;
        error: string;
    };

export async function generateQrCode(
    input: string,
    options: QrCodeOptions
): Promise<QrCodeResult> {
    if (!input.trim()) {
        return {
            success: false,
            error: "Please enter text or a URL to generate a QR code.",
        };
    }

    if (options.size < 128 || options.size > 1024) {
        return {
            success: false,
            error: "QR size must be between 128 and 1024 pixels.",
        };
    }

    try {
        const dataUrl = await QRCode.toDataURL(input, {
            width: options.size,
            margin: options.margin,
            errorCorrectionLevel: options.errorCorrectionLevel,
            color: {
                dark: options.darkColor,
                light: options.lightColor,
            },
        });

        return {
            success: true,
            dataUrl,
        };
    } catch {
        return {
            success: false,
            error: "Could not generate QR code.",
        };
    }
}