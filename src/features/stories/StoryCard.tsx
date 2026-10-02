import Image from "next/image";
import { Rating } from "@/components/ui/rating";
import { SocialLinks } from "@/components/ui/social-links";
import { cn } from "@/lib/cn";
import type { StoryAuthor, StoryCardProps } from "./to-stories-props";

type Props = StoryCardProps & { className?: string };

function Author({
  author,
  inverse = false,
}: {
  author: StoryAuthor;
  inverse?: boolean;
}) {
  return (
    <footer className="mt-auto flex items-center justify-between gap-4">
      <div className={inverse ? "text-white" : undefined}>
        <p
          className={cn(
            "text-author font-medium",
            !inverse && "text-heading-strong",
          )}
        >
          {author.name}
        </p>
        <p
          className={cn(
            "mt-1 text-meta",
            inverse ? "text-white/85" : "text-copy",
          )}
        >
          {author.location}
        </p>
      </div>
      {author.socials.length > 0 ? (
        <SocialLinks
          links={author.socials}
          tone={inverse ? "inverse" : "solid"}
        />
      ) : null}
    </footer>
  );
}

/**
 * Testimonial card: a written review (category, stars, quote, author) or a
 * photo card (cut-out photo on mint with a dark fade for the white author
 * line). Only the social links are interactive.
 */
export function StoryCard(props: Props) {
  const base = "flex min-h-story-h flex-col rounded-card";

  if (props.kind === "photo") {
    return (
      <article
        className={cn(
          base,
          "relative isolate overflow-hidden bg-story-photo px-4 pt-4 pb-2.5 shadow-raised lg:p-6 lg:pb-5",
          props.className,
        )}
      >
        <Image
          src={props.photo.src}
          alt={props.photo.alt}
          fill
          sizes="(min-width: 64rem) 27rem, 100vw"
          className="-z-10 object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-linear-to-b from-transparent from-50% to-brand-800"
        />
        <Author author={props.author} inverse />
      </article>
    );
  }

  return (
    <article className={cn(base, "bg-off-white p-6", props.className)}>
      {props.category ? (
        <h3 className="text-card-heading font-normal text-accent">
          {props.category}
        </h3>
      ) : null}
      <Rating value={props.rating} className="mt-4 lg:mt-5" />
      <blockquote className="mt-3 text-body-sm text-copy">
        <p>{props.quote}</p>
      </blockquote>
      <Author author={props.author} />
    </article>
  );
}
