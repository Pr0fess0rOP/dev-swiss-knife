import { ToolGrid } from "@/components/tools/tool-grid";
import { tools } from "@/lib/tools/registry";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <div className="mb-5 inline-flex rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
            Dev Swiss Knife
          </div>

          <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Minimal developer tools for everyday work.
          </h1>

          <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            Format JSON, decode JWTs, compare code, test regex, convert data,
            generate QR codes, and handle PDF utilities in a calm, clean workspace.
          </p>
        </div>

        <ToolGrid tools={tools} />
      </section>
    </main>
  );
}