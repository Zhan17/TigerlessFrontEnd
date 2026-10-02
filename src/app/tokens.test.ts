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

  /*
   * Fluid tokens are written as clamp(min, intercept + slope·vw, max) so the
   * 375 board gets `min` and the 1440 board gets `max`. A wrong slope or
   * intercept only shows up as a few pixels off on one board, so check the
   * line actually passes through both endpoints (within half a pixel).
   */
  it("every fluid clamp() hits its min at 375px and its max at 1440px", () => {
    const fluid =
      /(--[\w-]+):\s*clamp\(\s*(-?[\d.]+)rem,\s*(-?[\d.]+)rem\s*([+-])\s*([\d.]+)vw,\s*(-?[\d.]+)rem\s*\)/g;
    const off = [...css.matchAll(fluid)].flatMap(
      ([, name, min, intercept, sign, slope, max]) => {
        const px = (rem: string | undefined) => Number(rem) * 16;
        const vw = (sign === "-" ? -1 : 1) * Number(slope);
        const at = (width: number) => px(intercept) + (vw * width) / 100;
        const ok =
          Math.abs(at(375) - px(min)) < 0.5 &&
          Math.abs(at(1440) - px(max)) < 0.5;
        return ok ? [] : [name];
      },
    );
    expect(off).toEqual([]);
  });
});
