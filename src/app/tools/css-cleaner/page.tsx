import { CssCleanerClient } from "./css-cleaner-client";

export default function CssCleanerPage() {
    return (
        <CssCleanerClient
            title="Redundant CSS Remover"
            description="Detect duplicate selectors, repeated declarations, and minify CSS in one clean browser-side tool."
        />
    );
}