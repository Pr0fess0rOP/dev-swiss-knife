# 🛠️ Dev Swiss Knife

[![Next.js](https://img.shields.io/badge/Next.js-16.2.10-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS-v4.0-06B6D4?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-orange.svg?style=flat-square)](https://github.com/Pr0fess0rOP/dev-swiss-knife/pulls)

**Dev Swiss Knife** is a minimal, powerful, and privacy-first developer toolbox designed to streamline your everyday workflows. Format, validate, inspect, generate, and convert data locally on your machine with a clean, calm, and responsive workspace. 

Unlike other online web toolkits that upload your clipboard data to remote servers, **Dev Swiss Knife executes 100% in your browser**. No server logs, no external APIs, and no telemetry—your sensitive data, passwords, JWTs, and keys never leave your machine.

---

## 📸 Overview & Design Aesthetics

Dev Swiss Knife is designed with modern frontend aesthetics:
- **Vibrant Dark/Light Space:** Built with premium `oklch` harmonious color palettes and micro-gradients.
- **Glassmorphism Workspace:** Clean, floating panel layouts with smooth border indicators.
- **Modern Typography:** Styled with the premium Google Font **Manrope** for ultimate readability.
- **Subtle Micro-Animations:** Fluid transitions, hover scale effects, and tactile feedback.
- **Interactive Componentry:** Interactive inputs, code blocks powered by **Monaco Editor**, and swift one-click clipboards.

---

## ⚡ Key Features & Utility Registry

The platform features **23 active tools** categorized across **8 functional suites** with a planned roadmap for additional utilities.

| Suite | Tool | Description / Use Case | Status |
| :--- | :--- | :--- | :---: |
| **🔒 Security** | [JWT Generator & Decoder](file:///d:/Pavallion/Coding%20Slashers/Pr0fess0rOP%20Github%20Repos/dev-swiss-knife/src/app/tools/jwt) | Inspect, edit, sign, and decode JSON Web Tokens locally. | Active |
| | [Password Generator](file:///d:/Pavallion/Coding%20Slashers/Pr0fess0rOP%20Github%20Repos/dev-swiss-knife/src/app/tools/password-generator) | Generate high-entropy, customizable passwords (length, characters, symbols). | Active |
| | [Hash Generator](file:///d:/Pavallion/Coding%20Slashers/Pr0fess0rOP%20Github%20Repos/dev-swiss-knife/src/app/tools/hash-generator) | Compute cryptographic hashes (SHA-256, SHA-512, MD5) on-the-fly. | Active |
| | [API Key Generator](file:///d:/Pavallion/Coding%20Slashers/Pr0fess0rOP%20Github%20Repos/dev-swiss-knife/src/app/tools/api-key-generator) | Generate secure prefix-based API keys with options for env & separators. | Active |
| | [URL Encoder / Decoder](file:///d:/Pavallion/Coding%20Slashers/Pr0fess0rOP%20Github%20Repos/dev-swiss-knife/src/app/tools/url-encoder-decoder) | Safely convert strings to URL-safe formats and vice-versa. | Active |
| **💻 Code** | [JSON Formatter / Validator](file:///d:/Pavallion/Coding%20Slashers/Pr0fess0rOP%20Github%20Repos/dev-swiss-knife/src/app/tools/json-formatter) | Parse, beautify, minify, and check syntax syntax of JSON arrays and objects. | Active |
| | [Base64 Encoder / Decoder](file:///d:/Pavallion/Coding%20Slashers/Pr0fess0rOP%20Github%20Repos/dev-swiss-knife/src/app/tools/base64) | Quickly encode raw text to Base64 or decode encoded payloads back. | Active |
| | [Code Diff Checker](file:///d:/Pavallion/Coding%20Slashers/Pr0fess0rOP%20Github%20Repos/dev-swiss-knife/src/app/tools/code-diff) | Compare two code snippets side-by-side with highlight diffing. | Active |
| | [Markdown Previewer](file:///d:/Pavallion/Coding%20Slashers/Pr0fess0rOP%20Github%20Repos/dev-swiss-knife/src/app/tools/markdown-previewer) | Write Markdown content and see live HTML previews using a customized schema. | Active |
| | [Regex Tester](file:///d:/Pavallion/Coding%20Slashers/Pr0fess0rOP%20Github%20Repos/dev-swiss-knife/src/app/tools/regex-tester) | Write patterns, check flags, and test regex matches against test strings. | Active |
| **🎨 Frontend** | [Redundant CSS Remover](file:///d:/Pavallion/Coding%20Slashers/Pr0fess0rOP%20Github%20Repos/dev-swiss-knife/src/app/tools/css-cleaner) | Analyze stylesheet nodes and clean up duplicates / redundant lines. | Active |
| | [CSS Minifier](file:///d:/Pavallion/Coding%20Slashers/Pr0fess0rOP%20Github%20Repos/dev-swiss-knife/src/app/tools/css-minifier) | Compress css payloads to reduce stylesheets overhead. | Active |
| | [Color Picker](file:///d:/Pavallion/Coding%20Slashers/Pr0fess0rOP%20Github%20Repos/dev-swiss-knife/src/app/tools/color-picker) | Convert and pick colors between HEX, RGB, HSL, and OKLCH. | Active |
| | *Tailwind Class Sorter* | Clean and sort utility Tailwind CSS classes in an opinionated layout. | Planned |
| **🌐 API** | [cURL Generator](file:///d:/Pavallion/Coding%20Slashers/Pr0fess0rOP%20Github%20Repos/dev-swiss-knife/src/app/tools/curl-generator) | Build customizable cURL commands with custom methods, headers, and bodies. | Active |
| | [REST API Tester](file:///d:/Pavallion/Coding%20Slashers/Pr0fess0rOP%20Github%20Repos/dev-swiss-knife/src/app/tools/api-tester) | Send test requests (GET, POST, etc.) and inspect responses instantly. | Active |
| | [Timestamp Converter](file:///d:/Pavallion/Coding%20Slashers/Pr0fess0rOP%20Github%20Repos/dev-swiss-knife/src/app/tools/timestamp-converter) | Convert unix epochs to ISO, UTC, and local times (and vice-versa). | Active |
| **📝 Text** | [Word / Character Counter](file:///d:/Pavallion/Coding%20Slashers/Pr0fess0rOP%20Github%20Repos/dev-swiss-knife/src/app/tools/text-counter) | Stat analysis of text including letters, words, sentences, lines, and spaces. | Active |
| | [Case Converter](file:///d:/Pavallion/Coding%20Slashers/Pr0fess0rOP%20Github%20Repos/dev-swiss-knife/src/app/tools/case-converter) | Swap text between camelCase, snake_case, kebab-case, UPPER, lower, etc. | Active |
| | *Duplicate Line Remover* | Strip matching string rows and output unique lines. | Planned |
| **📊 Data** | [CSV to JSON Converter](file:///d:/Pavallion/Coding%20Slashers/Pr0fess0rOP%20Github%20Repos/dev-swiss-knife/src/app/tools/csv-to-json) | Parse raw CSV format / comma separated values directly into JSON. | Active |
| | [JSON to CSV Converter](file:///d:/Pavallion/Coding%20Slashers/Pr0fess0rOP%20Github%20Repos/dev-swiss-knife/src/app/tools/json-to-csv) | Clean mapping of JSON structures into readable CSV sheets. | Active |
| | [Fake Data Generator](file:///d:/Pavallion/Coding%20Slashers/Pr0fess0rOP%20Github%20Repos/dev-swiss-knife/src/app/tools/fake-data-generator) | Mock addresses, phone numbers, fake names, and test payloads. | Active |
| **📄 PDF** | *PDF Merge / Split / Compress* | Manipulate layout and merge nodes of local files. | Planned |
| **📱 QR Codes**| [QR Code Generator](file:///d:/Pavallion/Coding%20Slashers/Pr0fess0rOP%20Github%20Repos/dev-swiss-knife/src/app/tools/qr-generator) | Create downloadable high-quality vector and image QR codes. | Active |
| | [QR Code Reader](file:///d:/Pavallion/Coding%20Slashers/Pr0fess0rOP%20Github%20Repos/dev-swiss-knife/src/app/tools/qr-reader) | Decode information from uploaded QR images using client-side canvas. | Active |

---

## 🛠️ Architecture & Tech Stack

Dev Swiss Knife is designed with modern web architecture practices to guarantee instant load times and client-side processing:

- **Frontend Core:** [Next.js 16 (App Router)](https://nextjs.org/) and [React 19](https://react.dev/) using React Hooks for state synchronization.
- **Styling & Theme:** [Tailwind CSS v4](https://tailwindcss.com/) with native CSS variables, supporting modern layout systems, glassmorphism elements, custom fonts, and OKLCH color mappings.
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) for lightweight, predictable global layout and component states.
- **Code Editor Framework:** [Monaco Editor](https://microsoft.github.io/monaco-editor/) via `@monaco-editor/react` to provide advanced editing capabilities, autocompletions, and syntax highlighting.
- **Heavy Utilities & Libraries:**
  - `jose` — Light and secure local JWT generation and inspection.
  - `pdf-lib` — Multi-document PDF rendering, merging, and splitting.
  - `qrcode` & `jsqr` — Robust canvas-based QR code encoding and decoding.
  - `papaparse` — Lightning-fast CSV parser.
  - `@faker-js/faker` — Mock data generator.
  - `diff` — Text diff algorithms for comparison splits.
  - `zod` — Validation schemas.

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js:** v18.x or higher
- **Package Manager:** npm, yarn, pnpm, or bun

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Pr0fess0rOP/dev-swiss-knife.git
   cd dev-swiss-knife
   ```

2. **Install Dependencies:**
   Select your preferred package manager to bootstrap the packages:
   ```bash
   # npm
   npm install

   # yarn
   yarn install

   # pnpm
   pnpm install

   # bun
   bun install
   ```

3. **Spin Up the Development Server:**
   ```bash
   # npm
   npm run dev

   # yarn
   yarn dev

   # pnpm
   pnpm dev

   # bun
   bun dev
   ```

4. **Access the App:**
   Open your browser and navigate to `http://localhost:3000`.

---

## 📦 Project Scripts

The application supports a clean set of deployment and checking tasks:

- `npm run dev` / `next dev`: Boots up the local hot-reload environment.
- `npm run build` / `next build`: Builds the production bundle using the optimal tree-shaking setup.
- `npm run start` / `next start`: Runs the built production files server locally.
- `npm run lint` / `eslint`: Audits directory code style, layout issues, and lint constraints.

---

## 📂 Project Structure

```
dev-swiss-knife/
├── src/
│   ├── app/                      # Next.js App Router root layout & pages
│   │   ├── globals.css           # Tailwind CSS imports & theme overrides (OKLCH variables)
│   │   ├── layout.tsx            # App-wide root layout (Manrope Google Font, page wrappers)
│   │   ├── page.tsx              # Dashboard layout (Tool category grids & search)
│   │   └── tools/                # Subfolders mapping to tool slugs (e.g. tools/jwt/page.tsx)
│   ├── components/               # Shareable React components
│   │   ├── tools/                # Tool-specific wrappers (ToolShell, ToolCard, CopyButton)
│   │   └── ui/                   # Reusable base components (Inputs, Cards, Buttons, Badges)
│   ├── lib/                      # Core utility functions & mathematical logic
│   │   ├── tools/
│   │   │   └── registry.ts       # Registry of tools, tags, slugs, and categories
│   │   └── [tool-category]/      # Standalone processing libraries (e.g., lib/crypto/api-key-utils.ts)
│   ├── store/                    # App state stores (Zustand configuration)
│   └── types/                    # Common TypeScript type definitions
├── public/                       # Static public assets (Favicon, mock files, vectors)
├── package.json                  # Dependencies and scripts definitions
├── tsconfig.json                 # TypeScript compiler configurations
├── postcss.config.mjs            # PostCSS configuration
└── eslint.config.mjs             # ESLint parameters
```

---

## 🛠️ How to Add a New Tool (Developer Guide)

Dev Swiss Knife is designed with a plug-and-play architecture. Follow these 3 simple steps to add a new tool to the suite:

### 1. Write the Business Logic
Create a helper file in `src/lib/[category]/[tool-name].ts` (or add to an existing directory). Put all algorithmic operations, validations, and helper logic here.
```typescript
// Example: src/lib/text/reverse-string.ts
export function reverseString(input: string): string {
  return input.split("").reverse().join("");
}
```

### 2. Register the Tool
Open [src/lib/tools/registry.ts](file:///d:/Pavallion/Coding%20Slashers/Pr0fess0rOP%20Github%20Repos/dev-swiss-knife/src/lib/tools/registry.ts) and append a new `Tool` entry:
```typescript
{
    title: "String Reverser",
    slug: "string-reverser",
    category: "Text",
    description: "Reverse a string character by character.",
    tags: ["text", "reverse", "manipulation"],
}
```

### 3. Build the UI Route
Create a new file `src/app/tools/string-reverser/page.tsx`. Use the `<ToolShell>` wrapper to match the styling:
```tsx
"use client";

import { useState } from "react";
import { ToolShell } from "@/components/tools/tool-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/tools/copy-button";
import { reverseString } from "@/lib/text/reverse-string";

export default function StringReverserPage() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");

    const handleProcess = () => {
        setOutput(reverseString(input));
    };

    return (
        <ToolShell 
            title="String Reverser" 
            description="Quickly reverse characters in your text."
        >
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                    <Textarea 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)} 
                        placeholder="Type text here..." 
                    />
                    <Button onClick={handleProcess}>Reverse Text</Button>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span>Output</span>
                        <CopyButton value={output} />
                    </div>
                    <Textarea value={output} readOnly placeholder="Reversed text will show here" />
                </div>
            </div>
        </ToolShell>
    );
}
```

Spin up the local dev server—the new tool will automatically render on the dashboard under the corresponding filter, complete with responsive layouts, typography, search indexing, and deep linking!

---

## 🔒 Security & Privacy Guarantee

- **No Remote Calls:** No form actions, server actions, or external fetches occur on user payloads.
- **Local Storage Only:** If configuration parameters need to be saved (e.g. preferences, layout options), they are written to standard browser `localStorage` on your client profile.
- **Open Codebase:** Check and audit the network tab or build process yourself. No trackers, telemetry scripts, or external scripts are injected.

---

## 🤝 Contributing

We love contributions! If you have recommendations for enhancements or want to build a tool listed under the **Planned** category:
1. Fork the repo.
2. Build your feature or fix branch.
3. Keep styling consistent with the existing components.
4. Run `npm run lint` and verify your build compilation with `npm run build`.
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License. Feel free to use, modify, and host this application on your own personal deployments.
