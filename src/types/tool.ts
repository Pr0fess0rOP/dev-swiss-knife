// Define custom tool categories data structure
export type ToolCategory = "Security" | "Code" | "Frontend" | "API" | "Text" | "Data" | "PDF" | "QR"

// Define custom tool data structure
export type Tool = {
    title: string;
    slug: string;
    category: ToolCategory;
    description: string;
    tags?: string[];
}
