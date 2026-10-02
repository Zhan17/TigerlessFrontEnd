import { describe, expect, it } from "vitest";
import * as mock from "../mock";
import { ContentError, createContentClient } from "./client";
import { pickByIds } from "./pick-by-ids";

const BASE = "https://api.example.test";

/** Fake backend: serves the mock payloads by path, with optional overrides. */
function fakeFetch(overrides: Record<string, Response> = {}): typeof fetch {
  const payloads: Record<string, unknown> = {
    "/content/home": mock.homeContent,
    "/programs": mock.programs,
    "/products": mock.products,
    "/languages": mock.languages,
    "/services": mock.services,
    "/testimonials": mock.testimonials,
    "/faqs": mock.faqs,
  };
  return async (input) => {
    const path = String(input).replace(BASE, "");
    const override = overrides[path];
    if (override) return override;
    return new Response(JSON.stringify(payloads[path]), { status: 200 });
  };
}

describe("content client (mock source)", () => {
  it("returns every resource for the home page without degradation", async () => {
    const data = await createContentClient({
      source: "mock",
    }).getHomePageData();
    expect(data.degraded).toEqual([]);
    expect(data.home.schemaVersion).toBe(1);
    expect(data.programs).toHaveLength(3);
    expect(data.faqs.length).toBeGreaterThan(0);
  });
});

describe("content client (api source)", () => {
  it("fetches and validates each endpoint", async () => {
    const client = createContentClient({
      source: "api",
      baseUrl: BASE,
      fetch: fakeFetch(),
    });
    const data = await client.getHomePageData();
    expect(data.degraded).toEqual([]);
    expect(data.languages.map((l) => l.code)).toContain("ar");
  });

  it("degrades a single optional resource that fails validation", async () => {
    const broken = new Response(JSON.stringify([{ id: "x" }]), { status: 200 });
    const client = createContentClient({
      source: "api",
      baseUrl: BASE,
      fetch: fakeFetch({ "/faqs": broken }),
    });
    const data = await client.getHomePageData();
    expect(data.faqs).toEqual([]);
    expect(data.degraded.map((d) => d.resource)).toEqual(["faqs"]);
    expect(data.programs).toHaveLength(3);
  });

  it("degrades a resource that returns an HTTP error", async () => {
    const client = createContentClient({
      source: "api",
      baseUrl: BASE,
      fetch: fakeFetch({ "/services": new Response("nope", { status: 503 }) }),
    });
    const data = await client.getHomePageData();
    expect(data.services).toEqual([]);
    expect(data.degraded[0]?.reason).toContain("HTTP 503");
  });

  it("ignores unknown fields the backend may add later", async () => {
    const extended = mock.faqs.map((faq) => ({
      ...faq,
      updatedAt: "2026-10-01",
    }));
    const client = createContentClient({
      source: "api",
      baseUrl: BASE,
      fetch: fakeFetch({ "/faqs": new Response(JSON.stringify(extended)) }),
    });
    const faqs = await client.getResource("faqs");
    expect(faqs[0]).not.toHaveProperty("updatedAt");
  });

  it("fails the page when home content is invalid", async () => {
    const client = createContentClient({
      source: "api",
      baseUrl: BASE,
      fetch: fakeFetch({ "/content/home": new Response(JSON.stringify({})) }),
    });
    await expect(client.getHomePageData()).rejects.toBeInstanceOf(ContentError);
  });

  it("requires a base URL", async () => {
    const client = createContentClient({ source: "api", fetch: fakeFetch() });
    await expect(client.getResource("faqs")).rejects.toThrow("API_BASE_URL");
  });
});

describe("pickByIds", () => {
  const items = [{ id: "a" }, { id: "b" }, { id: "c" }];

  it("keeps the order of the id list", () => {
    expect(pickByIds(["c", "a"], items)).toEqual([{ id: "c" }, { id: "a" }]);
  });

  it("skips dangling references", () => {
    expect(pickByIds(["a", "missing", "b"], items)).toEqual([
      { id: "a" },
      { id: "b" },
    ]);
  });
});
