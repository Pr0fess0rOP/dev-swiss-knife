export type CssIssueType =
    | "duplicate-selector"
    | "duplicate-declaration"
    | "repeated-property";

export type CssIssue = {
    type: CssIssueType;
    selector: string;
    message: string;
    detail: string;
};

export type CssAnalysisResult =
    | {
        success: true;
        minifiedCss: string;
        formattedCss: string;
        issues: CssIssue[];
        originalSize: number;
        minifiedSize: number;
        savedBytes: number;
        savedPercent: number;
    }
    | {
        success: false;
        error: string;
    };

type CssRule = {
    selector: string;
    declarations: string[];
};

function removeCssComments(css: string): string {
    return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

function normalizeWhitespace(value: string): string {
    return value.replace(/\s+/g, " ").trim();
}

function parseCssRules(css: string): CssRule[] {
    const cleanCss = removeCssComments(css);
    const ruleRegex = /([^{}]+)\{([^{}]*)\}/g;
    const rules: CssRule[] = [];

    let match: RegExpExecArray | null;

    while ((match = ruleRegex.exec(cleanCss)) !== null) {
        const selector = normalizeWhitespace(match[1]);
        const body = match[2];

        const declarations = body
            .split(";")
            .map((declaration) => declaration.trim())
            .filter(Boolean);

        if (selector && declarations.length > 0) {
            rules.push({
                selector,
                declarations,
            });
        }
    }

    return rules;
}

function minifyCss(css: string): string {
    return removeCssComments(css)
        .replace(/\s+/g, " ")
        .replace(/\s*{\s*/g, "{")
        .replace(/\s*}\s*/g, "}")
        .replace(/\s*:\s*/g, ":")
        .replace(/\s*;\s*/g, ";")
        .replace(/\s*,\s*/g, ",")
        .replace(/;}/g, "}")
        .trim();
}

function formatCssFromRules(rules: CssRule[]): string {
    return rules
        .map((rule) => {
            const declarations = rule.declarations
                .map((declaration) => `  ${declaration};`)
                .join("\n");

            return `${rule.selector} {\n${declarations}\n}`;
        })
        .join("\n\n");
}

function getDeclarationProperty(declaration: string): string {
    return declaration.split(":")[0]?.trim().toLowerCase() ?? "";
}

function normalizeDeclaration(declaration: string): string {
    const [property, ...valueParts] = declaration.split(":");

    return `${property?.trim().toLowerCase()}:${valueParts
        .join(":")
        .trim()
        .toLowerCase()}`;
}

function findCssIssues(rules: CssRule[]): CssIssue[] {
    const issues: CssIssue[] = [];
    const selectorMap = new Map<string, CssRule[]>();

    for (const rule of rules) {
        const normalizedSelector = rule.selector.toLowerCase();

        const existingRules = selectorMap.get(normalizedSelector) ?? [];
        existingRules.push(rule);
        selectorMap.set(normalizedSelector, existingRules);

        const declarationMap = new Map<string, number>();
        const propertyMap = new Map<string, string[]>();

        for (const declaration of rule.declarations) {
            const normalizedDeclaration = normalizeDeclaration(declaration);
            const property = getDeclarationProperty(declaration);

            declarationMap.set(
                normalizedDeclaration,
                (declarationMap.get(normalizedDeclaration) ?? 0) + 1
            );

            const existingProperties = propertyMap.get(property) ?? [];
            existingProperties.push(declaration);
            propertyMap.set(property, existingProperties);
        }

        for (const [declaration, count] of declarationMap.entries()) {
            if (count > 1) {
                issues.push({
                    type: "duplicate-declaration",
                    selector: rule.selector,
                    message: "Duplicate declaration found.",
                    detail: `${declaration} appears ${count} times in the same rule.`,
                });
            }
        }

        for (const [property, declarations] of propertyMap.entries()) {
            if (property && declarations.length > 1) {
                issues.push({
                    type: "repeated-property",
                    selector: rule.selector,
                    message: "Repeated property found.",
                    detail: `${property} is declared ${declarations.length} times. The last one usually wins.`,
                });
            }
        }
    }

    for (const [selector, selectorRules] of selectorMap.entries()) {
        if (selectorRules.length > 1) {
            issues.push({
                type: "duplicate-selector",
                selector,
                message: "Duplicate selector found.",
                detail: `${selector} appears ${selectorRules.length} times. Consider merging these rules.`,
            });
        }
    }

    return issues;
}

export function analyzeCss(input: string): CssAnalysisResult {
    if (!input.trim()) {
        return {
            success: false,
            error: "Please enter CSS to analyze.",
        };
    }

    try {
        const rules = parseCssRules(input);
        const minifiedCss = minifyCss(input);
        const formattedCss = formatCssFromRules(rules);
        const issues = findCssIssues(rules);

        const originalSize = new TextEncoder().encode(input).length;
        const minifiedSize = new TextEncoder().encode(minifiedCss).length;
        const savedBytes = Math.max(originalSize - minifiedSize, 0);
        const savedPercent =
            originalSize === 0 ? 0 : Math.round((savedBytes / originalSize) * 100);

        return {
            success: true,
            minifiedCss,
            formattedCss,
            issues,
            originalSize,
            minifiedSize,
            savedBytes,
            savedPercent,
        };
    } catch {
        return {
            success: false,
            error: "Could not analyze CSS.",
        };
    }
}