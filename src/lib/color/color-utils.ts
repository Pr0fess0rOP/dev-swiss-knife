export type RgbColor = {
    r: number;
    g: number;
    b: number;
};

export type HslColor = {
    h: number;
    s: number;
    l: number;
};

export type ColorInfo =
    | {
        success: true;
        hex: string;
        rgb: RgbColor;
        hsl: HslColor;
        rgbString: string;
        hslString: string;
        cssVariable: string;
        tailwindBg: string;
        tailwindText: string;
        tailwindBorder: string;
        palette: string[];
    }
    | {
        success: false;
        error: string;
    };

export function isValidHexColor(input: string): boolean {
    return /^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/.test(input.trim());
}

export function normalizeHex(input: string): string {
    let hex = input.trim();

    if (!hex.startsWith("#")) {
        hex = `#${hex}`;
    }

    if (hex.length === 4) {
        const r = hex[1];
        const g = hex[2];
        const b = hex[3];

        hex = `#${r}${r}${g}${g}${b}${b}`;
    }

    return hex.toUpperCase();
}

export function hexToRgb(hexInput: string): RgbColor {
    const hex = normalizeHex(hexInput).replace("#", "");

    return {
        r: Number.parseInt(hex.slice(0, 2), 16),
        g: Number.parseInt(hex.slice(2, 4), 16),
        b: Number.parseInt(hex.slice(4, 6), 16),
    };
}

export function rgbToHex({ r, g, b }: RgbColor): string {
    const toHex = (value: number) =>
        Math.round(value).toString(16).padStart(2, "0");

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function rgbToHsl({ r, g, b }: RgbColor): HslColor {
    const red = r / 255;
    const green = g / 255;
    const blue = b / 255;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);

    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const delta = max - min;

        s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

        switch (max) {
            case red:
                h = (green - blue) / delta + (green < blue ? 6 : 0);
                break;

            case green:
                h = (blue - red) / delta + 2;
                break;

            case blue:
                h = (red - green) / delta + 4;
                break;
        }

        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    };
}

export function hslToRgb({ h, s, l }: HslColor): RgbColor {
    const hue = h / 360;
    const saturation = s / 100;
    const lightness = l / 100;

    if (saturation === 0) {
        const gray = lightness * 255;

        return {
            r: gray,
            g: gray,
            b: gray,
        };
    }

    const hueToRgb = (p: number, q: number, tInput: number) => {
        let t = tInput;

        if (t < 0) t += 1;
        if (t > 1) t -= 1;

        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;

        return p;
    };

    const q =
        lightness < 0.5
            ? lightness * (1 + saturation)
            : lightness + saturation - lightness * saturation;

    const p = 2 * lightness - q;

    return {
        r: hueToRgb(p, q, hue + 1 / 3) * 255,
        g: hueToRgb(p, q, hue) * 255,
        b: hueToRgb(p, q, hue - 1 / 3) * 255,
    };
}

export function hslToHex(color: HslColor): string {
    return rgbToHex(hslToRgb(color));
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

function createPalette(hex: string): string[] {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb);

    const lightnessValues = [
        clamp(hsl.l + 36, 8, 96),
        clamp(hsl.l + 24, 8, 96),
        clamp(hsl.l + 12, 8, 96),
        hsl.l,
        clamp(hsl.l - 12, 8, 96),
        clamp(hsl.l - 24, 8, 96),
    ];

    const palette = lightnessValues.map((lightness) =>
        rgbToHex(
            hslToRgb({
                ...hsl,
                l: lightness,
            })
        )
    );

    return Array.from(new Set(palette));
}


export function getColorInfo(input: string): ColorInfo {
    if (!input.trim()) {
        return {
            success: false,
            error: "Please enter a HEX color.",
        };
    }

    if (!isValidHexColor(input)) {
        return {
            success: false,
            error: "Please enter a valid HEX color like #D6C3A5.",
        };
    }

    const hex = normalizeHex(input);
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb);

    return {
        success: true,
        hex,
        rgb,
        hsl,
        rgbString: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        hslString: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
        cssVariable: `--color-custom: ${hex};`,
        tailwindBg: `bg-[${hex}]`,
        tailwindText: `text-[${hex}]`,
        tailwindBorder: `border-[${hex}]`,
        palette: createPalette(hex),
    };
}