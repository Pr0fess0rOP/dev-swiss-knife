import { CssCleanerClient } from "../css-cleaner/css-cleaner-client";

export default function CssMinifierPage() {
    return (
        <CssCleanerClient
            title="CSS Minifier"
            description="Minify CSS, compare size reduction, and quickly inspect duplicate or redundant CSS patterns."
        />
    );
}