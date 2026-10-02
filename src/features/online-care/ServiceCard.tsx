import Image from "next/image";
import type { Service } from "@/content/schemas";
import { cn } from "@/lib/cn";
import { ChatPreview } from "./ChatPreview";

type Props = Service & { className?: string };

/**
 * One card in the services carousel. `media.kind` picks the layout:
 * - photo: full-bleed photo behind a white title (a light top scrim keeps
 *   the title readable on bright photos);
 * - product: product shot under the title in a 406x341 cover frame (as in
 *   Figma), bleeding off the right edge;
 * - chat: phone mockup cut off by the card bottom, chat panel on top.
 */
export function ServiceCard({ title, media, className }: Props) {
  const onPhoto = media.kind === "photo";
  return (
    <article
      className={cn(
        "relative isolate h-service-h w-service-w overflow-hidden rounded-card bg-surface",
        className,
      )}
    >
      {media.kind === "photo" ? (
        <>
          <Image
            src={media.image.src}
            alt={media.image.alt}
            fill
            sizes="(min-width: 64rem) 24rem, 21rem"
            className="-z-10 object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 -z-10 h-2/5 bg-linear-to-b from-black/40 to-transparent"
          />
        </>
      ) : null}

      <h3
        className={cn(
          "px-6 pt-8 text-center text-card-heading font-normal",
          onPhoto ? "text-white" : "text-heading-strong",
        )}
      >
        {title}
      </h3>

      {media.kind === "product" ? (
        <Image
          src={media.image.src}
          alt={media.image.alt}
          width={media.image.width}
          height={media.image.height}
          sizes="26rem"
          className="absolute top-60.25 left-2.25 h-85.25 w-101.5 max-w-none object-cover"
        />
      ) : null}

      {media.kind === "chat" ? (
        <>
          <Image
            src={media.image.src}
            alt={media.image.alt}
            width={media.image.width}
            height={media.image.height}
            sizes="20rem"
            className="absolute top-phone-top left-1/2 h-auto w-phone-w max-w-none -translate-x-1/2"
          />
          <ChatPreview
            chat={media.chat}
            className="absolute right-4.5 bottom-chat-bottom"
          />
        </>
      ) : null}
    </article>
  );
}
