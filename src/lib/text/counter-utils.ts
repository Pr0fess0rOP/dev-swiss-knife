export type TextStats = {
    characters: number;
    charactersNoSpaces: number;
    words: number;
    lines: number;
    paragraphs: number;
    sentences: number;
    spaces: number;
    readingTimeMinutes: number;
};

function countWords(input: string): number {
    const matches = input.trim().match(/\b[\w'-]+\b/g);
    return matches ? matches.length : 0;
}

function countSentences(input: string): number {
    const matches = input.match(/[^.!?]+[.!?]+/g);
    return matches ? matches.length : input.trim() ? 1 : 0;
}

function countParagraphs(input: string): number {
    const paragraphs = input
        .trim()
        .split(/\n\s*\n/)
        .filter((paragraph) => paragraph.trim().length > 0);

    return paragraphs.length;
}

export function getTextStats(input: string): TextStats {
    const characters = input.length;
    const charactersNoSpaces = input.replace(/\s/g, "").length;
    const words = countWords(input);
    const lines = input.length === 0 ? 0 : input.split(/\r?\n/).length;
    const paragraphs = countParagraphs(input);
    const sentences = countSentences(input);
    const spaces = input.split("").filter((character) => character === " ").length;

    const averageReadingSpeed = 200;
    const readingTimeMinutes =
        words === 0 ? 0 : Math.max(1, Math.ceil(words / averageReadingSpeed));

    return {
        characters,
        charactersNoSpaces,
        words,
        lines,
        paragraphs,
        sentences,
        spaces,
        readingTimeMinutes,
    };
}