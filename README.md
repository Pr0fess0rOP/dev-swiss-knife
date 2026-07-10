# 🛠️ Dev Swiss Knife

A minimal, powerful developer toolbox for everyday work. Format, validate, inspect, generate, and convert data locally on your machine with a clean, calm, and responsive workspace.

---

## ✨ Key Features

Dev Swiss Knife packages 23 essential utilities for developers across 9 categories, all designed with a premium, accessible UI and running entirely in your browser (no server storage, 100% private).

| Category | Tool | Description |
| :--- | :--- | :--- |
| **🔒 Security** | JWT Generator + Decoder | Generate, decode, and inspect JSON Web Tokens. |
| | Password Generator | Generate secure random passwords with custom parameters. |
| | Hash Generator | Compute SHA-256, SHA-512, MD5, and other hashes. |
| | API Key Generator | Generate random, secure API-style keys. |
| | URL Encoder / Decoder | Encode and decode URL-safe strings. |
| **💻 Code** | JSON Formatter / Validator | Format, validate, and clean JSON. |
| | Base64 Encoder / Decoder | Encode and decode Base64 strings. |
| | Code Diff Checker | Side-by-side comparison of two code snippets. |
| | Markdown Previewer | Live-preview Markdown text as formatted HTML. |
| | Regex Tester | Test regular expressions against test content in real-time. |
| **🎨 Frontend** | Redundant CSS Remover | Detect duplicate and redundant CSS rules. |
| | CSS Minifier | Compress and minify CSS stylesheets. |
| | Color Picker | Pick, adjust, and convert HEX, RGB, HSL colors. |
| | Tailwind Class Sorter | Sort Tailwind CSS classes cleanly. |
| **🌐 API** | cURL Generator | Build cURL command snippets from inputs. |
| | REST API Tester | Send HTTP requests and inspect the responses. |
| | Timestamp Converter | Convert Unix timestamps to human-readable dates and vice-versa. |
| **📝 Text** | Word / Character Counter | Count words, characters, lines, and spaces. |
| | Case Converter | Convert text between camelCase, snake_case, kebab-case, etc. |
| | Duplicate Line Remover | Clean up and strip duplicate lines from text documents. |
| **📊 Data** | CSV to JSON Converter | Convert CSV files/strings into clean JSON arrays. |
| | JSON to CSV Converter | Convert JSON arrays into tabular CSV format. |
| | Fake Data Generator | Generate fake names, emails, addresses, and test data. |
| **📄 PDF** | PDF Merge / Split / Compress | Perform simple PDF manipulations locally. |
| **📱 QR Codes** | QR Code Generator | Generate high-quality QR codes from text/URLs. |
| | QR Code Reader | Read and decode QR codes from uploaded images. |

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Editor:** [Monaco Editor](https://microsoft.github.io/monaco-editor/) via `@monaco-editor/react`
- **Utility Libraries:**
  - `jose` (JWT handling)
  - `qrcode` & `jsqr` (QR generation/reading)
  - `pdf-lib` (PDF manipulation)
  - `papaparse` (CSV parsing/generation)
  - `@faker-js/faker` (Mock data generation)
  - `diff` (Diff highlighting)
  - `zod` (Validation schemas)

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18.x or higher recommended)
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/[your-username]/dev-swiss-knife.git
   cd dev-swiss-knife
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📦 Project Scripts

The following npm scripts are configured in [package.json](file:///d:/Pavallion/Coding%20Slashers/Pr0fess0rOP%20Github%20Repos/dev-swiss-knife/package.json):

* `npm run dev`: Starts the Next.js development server.
* `npm run build`: Compiles the application for production.
* `npm run start`: Starts the production server.
* `npm run lint`: Runs ESLint to check for code quality and syntax issues.

---

## 🔒 Security & Privacy

All processing (e.g. JWT decoding, PDF parsing, hash calculation) happens **locally in the browser**. No inputs, keys, tokens, or files are ever sent to any external server or backend. Your data is 100% safe and secure.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/[your-username]/dev-swiss-knife/issues).

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
