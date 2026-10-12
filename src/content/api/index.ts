import { z } from "zod";
import { createContentClient } from "./client";

export {
  type ContentClientOptions,
  ContentError,
  createContentClient,
  type DataSource,
  type HomePageData,
  type ResourceName,
} from "./client";
export { pickByIds } from "./pick-by-ids";

/**
 * Environment: DATA_SOURCE=mock|api (default mock), API_BASE_URL for api.
 * Validated so a typo fails loudly instead of silently using mocks.
 */
const env = z
  .object({
    DATA_SOURCE: z.enum(["mock", "api"]).default("mock"),
    API_BASE_URL: z.url().optional(),
  })
  .parse({
    DATA_SOURCE: process.env.DATA_SOURCE,
    API_BASE_URL: process.env.API_BASE_URL,
  });

const client = createContentClient({
  source: env.DATA_SOURCE,
  baseUrl: env.API_BASE_URL,
});

/** Single entry point used by the home page (server component). */
export const getHomePageData = client.getHomePageData;
