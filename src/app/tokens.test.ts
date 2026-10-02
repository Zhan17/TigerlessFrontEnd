import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Guards for globals.css design tokens (handoff K11): Tailwind maps several
 * namespaces onto the same utility prefix, so a name used in both silently
 * shadows one of them (e.g. --color-body vs --text-body -> `text-body`).
 */
const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

const names = (namespace: string) =>
  new Set(
    [...css.matchAll(new RegExp(`--${namespace}-([a-z0-9-]+):`, "g"))]
      .map((match) => match[1] ?? "")
      .filter((name) => !name.includes("--") && name !== "*"),
  );

const intersect = (a: Set<string>, b: Set<string>) =>
  [...a].filter((x) => b.has(x));

describe("design tokens", () => {
  it("no colour shares a name with a font size (both become text-*)", () => {
    expect(intersect(names("color"), names("text"))).toEqual([]);
  });

  it("no spacing token shares a name with a container (both feed max-w-*)", () => {
    expect(intersect(names("spacing"), names("container"))).toEqual([]);
  });
});
