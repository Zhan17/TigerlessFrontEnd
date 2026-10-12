/**
 * API contract for the Apsu home page (the backend does not exist yet).
 * Each schema is the runtime validator; the same-named type is inferred from
 * it, so validation and types cannot drift apart.
 *
 * Endpoints:
 *   GET /content/home  -> HomeContent
 *   GET /programs      -> Program[]
 *   GET /products      -> Product[]
 *   GET /languages     -> Language[]
 *   GET /services      -> Service[]
 *   GET /testimonials  -> Testimonial[]
 *   GET /faqs          -> Faq[]
 */
export * from "./common";
export * from "./faq";
export * from "./home";
export * from "./language";
export * from "./product";
export * from "./program";
export * from "./service";
export * from "./testimonial";
