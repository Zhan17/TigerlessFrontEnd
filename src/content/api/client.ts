import { z } from "zod";
import * as mock from "../mock";
import {
  type Faq,
  FaqList,
  type HomeContent,
  HomeContent as HomeContentSchema,
  type Language,
  LanguageList,
  type Product,
  ProductList,
  type Program,
  ProgramList,
  type Service,
  ServiceList,
  type Testimonial,
  TestimonialList,
} from "../schemas";

/**
 * Data access: the only place that knows where content comes from.
 *
 * - `mock` (default): returns the mock responses, still validated against
 *   the schemas so mocks cannot drift from the contract.
 * - `api`: GET `${baseUrl}${path}` and validate the JSON. Written against
 *   the contract but UNVERIFIED: no backend exists yet; tests use a fake
 *   fetch.
 *
 * Swapping to the real backend means setting DATA_SOURCE=api and
 * API_BASE_URL; components never change.
 */

const endpoints = {
  home: {
    path: "/content/home",
    schema: HomeContentSchema,
    mock: mock.homeContent,
  },
  programs: { path: "/programs", schema: ProgramList, mock: mock.programs },
  products: { path: "/products", schema: ProductList, mock: mock.products },
  languages: { path: "/languages", schema: LanguageList, mock: mock.languages },
  services: { path: "/services", schema: ServiceList, mock: mock.services },
  testimonials: {
    path: "/testimonials",
    schema: TestimonialList,
    mock: mock.testimonials,
  },
  faqs: { path: "/faqs", schema: FaqList, mock: mock.faqs },
} as const;

export type ResourceName = keyof typeof endpoints;

type ResourceMap = {
  home: HomeContent;
  programs: Program[];
  products: Product[];
  languages: Language[];
  services: Service[];
  testimonials: Testimonial[];
  faqs: Faq[];
};

export class ContentError extends Error {
  constructor(
    readonly resource: ResourceName,
    message: string,
    options?: { cause?: unknown },
  ) {
    super(`[content:${resource}] ${message}`, options);
    this.name = "ContentError";
  }
}

export type DataSource = "mock" | "api";

export type ContentClientOptions = {
  source: DataSource;
  /** Required when source is "api". */
  baseUrl?: string;
  /** Injected for tests; defaults to global fetch. */
  fetch?: typeof fetch;
};

/** Everything the home page needs. Optional resources degrade to []. */
export type HomePageData = ResourceMap & {
  /** Resources that failed and were replaced by an empty list. */
  degraded: { resource: ResourceName; reason: string }[];
};

export function createContentClient(options: ContentClientOptions) {
  const doFetch = options.fetch ?? fetch;

  async function getResource<K extends ResourceName>(
    name: K,
  ): Promise<ResourceMap[K]> {
    const endpoint = endpoints[name];
    let raw: unknown;

    if (options.source === "mock") {
      raw = endpoint.mock;
    } else {
      if (!options.baseUrl) {
        throw new ContentError(name, "API_BASE_URL is not set");
      }
      const response = await doFetch(`${options.baseUrl}${endpoint.path}`, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        throw new ContentError(name, `HTTP ${response.status}`);
      }
      raw = await response.json();
    }

    const parsed = endpoint.schema.safeParse(raw);
    if (!parsed.success) {
      throw new ContentError(name, z.prettifyError(parsed.error), {
        cause: parsed.error,
      });
    }
    // The schema for `name` produces ResourceMap[K]; TypeScript cannot
    // correlate the generic key with the union of schemas.
    return parsed.data as ResourceMap[K];
  }

  async function getHomePageData(): Promise<HomePageData> {
    const [home, programs, products, languages, services, testimonials, faqs] =
      await Promise.allSettled([
        getResource("home"),
        getResource("programs"),
        getResource("products"),
        getResource("languages"),
        getResource("services"),
        getResource("testimonials"),
        getResource("faqs"),
      ]);

    // Without home content there is no page to render.
    if (home.status === "rejected") throw home.reason;

    // Any other resource may fail on its own: its section renders empty
    // (or hides) instead of taking the whole page down.
    const degraded: HomePageData["degraded"] = [];
    function orEmpty<T>(
      result: PromiseSettledResult<T[]>,
      resource: ResourceName,
    ): T[] {
      if (result.status === "fulfilled") return result.value;
      degraded.push({ resource, reason: String(result.reason) });
      return [];
    }

    return {
      home: home.value,
      programs: orEmpty(programs, "programs"),
      products: orEmpty(products, "products"),
      languages: orEmpty(languages, "languages"),
      services: orEmpty(services, "services"),
      testimonials: orEmpty(testimonials, "testimonials"),
      faqs: orEmpty(faqs, "faqs"),
      degraded,
    };
  }

  return { getResource, getHomePageData };
}
