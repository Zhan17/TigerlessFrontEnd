import { z } from "zod";
import { Id } from "./common";

/** GET /faqs — question and answer pairs. */
export const Faq = z.object({
  id: Id,
  question: z.string().min(1),
  /** One string per paragraph. */
  answer: z.array(z.string().min(1)).min(1),
});

export const FaqList = z.array(Faq);

export type Faq = z.infer<typeof Faq>;
