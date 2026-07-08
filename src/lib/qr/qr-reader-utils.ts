import jsQR from "jsqr";

export type QrReadResult =
    | {
        success: true;
        text: string;
        width: number;
        height: number;
    }
    | {
        success: false;
        error: string;
    };

export async function readQrCodeFromImage(file: File): Promise<QrReadResult> {
    if (!file) {
        return {
            success: false,
            error: "Please upload an image file.",
        };
    }

    if (!file.type.startsWith("image/")) {
        return {
            success: false,
            error: "Uploaded file must be an image.",
        };
    }

    try {
        const bitmap = await createImageBitmap(file);

        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;

        const context = canvas.getContext("2d");

        if (!context) {
            return {
                success: false,
                error: "Could not read image canvas.",
            };
        }

        context.drawImage(bitmap, 0, 0);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

        if (!qrCode) {
            return {
                success: false,
                error: "No QR code found in this image.",
            };
        }

        return {
            success: true,
            text: qrCode.data,
            width: bitmap.width,
            height: bitmap.height,
        };
    } catch {
        return {
            success: false,
            error: "Could not scan this image.",
        };
    }
}