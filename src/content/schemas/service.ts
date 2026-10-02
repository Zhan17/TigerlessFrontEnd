import { z } from "zod";
import { Id, Image } from "./common";

/**
 * GET /services — cards in the "Completely online on your schedule"
 * carousel. `media.kind` tells the front end which card layout to use.
 */

export const ChatMessage = z.object({
  id: Id,
  from: z.enum(["provider", "patient"]),
  text: z.string().min(1),
  /** Display time, e.g. "10:00 AM". */
  time: z.string().min(1),
});

export const ServiceMedia = z.discriminatedUnion("kind", [
  /** Full-bleed photo behind a white title. */
  z.object({ kind: z.literal("photo"), image: Image }),
  /** Product shot on a white card under the title. */
  z.object({ kind: z.literal("product"), image: Image }),
  /** Phone mockup with a chat preview drawn by the front end. */
  z.object({
    kind: z.literal("chat"),
    image: Image,
    chat: z.object({
      providerName: z.string().min(1),
      providerAvatar: Image,
      status: z.string().min(1),
      dayLabel: z.string().min(1),
      messages: z.array(ChatMessage).min(1),
    }),
  }),
]);

export const Service = z.object({
  id: Id,
  title: z.string().min(1),
  media: ServiceMedia,
});

export const ServiceList = z.array(Service);

export type ChatMessage = z.infer<typeof ChatMessage>;
export type ServiceMedia = z.infer<typeof ServiceMedia>;
export type Service = z.infer<typeof Service>;
