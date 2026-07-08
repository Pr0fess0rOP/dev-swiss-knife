export type PasswordOptions = {
    length: number;
    includeUppercase: boolean;
    includeLowercase: boolean;
    includeNumbers: boolean;
    includeSymbols: boolean;
    excludeAmbiguous: boolean;
};

export type PasswordResult =
    | {
        success: true;
        password: string;
        strengthLabel: string;
        strengthScore: number;
    }
    | {
        success: false;
        error: string;
    };

const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercase = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const ambiguous = "Il1O0";

function removeAmbiguousCharacters(value: string): string {
    return value
        .split("")
        .filter((character) => !ambiguous.includes(character))
        .join("");
}

function getRandomIndex(max: number): number {
    const randomValues = new Uint32Array(1);
    window.crypto.getRandomValues(randomValues);
    return randomValues[0] % max;
}

function getRandomCharacter(characters: string): string {
    return characters[getRandomIndex(characters.length)];
}

function shuffleSecurely(value: string): string {
    const characters = value.split("");

    for (let index = characters.length - 1; index > 0; index -= 1) {
        const randomIndex = getRandomIndex(index + 1);
        [characters[index], characters[randomIndex]] = [
            characters[randomIndex],
            characters[index],
        ];
    }

    return characters.join("");
}

function calculateStrength(options: PasswordOptions): {
    strengthLabel: string;
    strengthScore: number;
} {
    let score = 0;

    if (options.length >= 12) score += 1;
    if (options.length >= 16) score += 1;
    if (options.includeUppercase) score += 1;
    if (options.includeLowercase) score += 1;
    if (options.includeNumbers) score += 1;
    if (options.includeSymbols) score += 1;

    if (score <= 2) {
        return {
            strengthLabel: "Weak",
            strengthScore: score,
        };
    }

    if (score <= 4) {
        return {
            strengthLabel: "Medium",
            strengthScore: score,
        };
    }

    return {
        strengthLabel: "Strong",
        strengthScore: score,
    };
}

export function generatePassword(options: PasswordOptions): PasswordResult {
    if (!window.crypto?.getRandomValues) {
        return {
            success: false,
            error: "Secure random generation is not available in this browser.",
        };
    }

    if (options.length < 4 || options.length > 128) {
        return {
            success: false,
            error: "Password length must be between 4 and 128 characters.",
        };
    }

    const selectedSets: string[] = [];

    if (options.includeUppercase) selectedSets.push(uppercase);
    if (options.includeLowercase) selectedSets.push(lowercase);
    if (options.includeNumbers) selectedSets.push(numbers);
    if (options.includeSymbols) selectedSets.push(symbols);

    if (selectedSets.length === 0) {
        return {
            success: false,
            error: "Select at least one character type.",
        };
    }

    const cleanedSets = selectedSets.map((characterSet) =>
        options.excludeAmbiguous
            ? removeAmbiguousCharacters(characterSet)
            : characterSet
    );

    const availableCharacters = cleanedSets.join("");

    if (!availableCharacters) {
        return {
            success: false,
            error: "No characters available with the current options.",
        };
    }

    const requiredCharacters = cleanedSets.map(getRandomCharacter);
    const remainingLength = options.length - requiredCharacters.length;

    const remainingCharacters = Array.from({ length: remainingLength }, () =>
        getRandomCharacter(availableCharacters)
    );

    const password = shuffleSecurely(
        [...requiredCharacters, ...remainingCharacters].join("")
    );

    const strength = calculateStrength(options);

    return {
        success: true,
        password,
        strengthLabel: strength.strengthLabel,
        strengthScore: strength.strengthScore,
    };
}