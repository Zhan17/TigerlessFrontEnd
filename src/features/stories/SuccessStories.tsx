import { RichText } from "@/features/shared/RichText";
import { cn } from "@/lib/cn";
import { StoryCard } from "./StoryCard";
import type { StoriesProps } from "./to-stories-props";

type Props = StoriesProps & { className?: string };

/**
 * "Our Success Stories": a white rounded shell (like the hero) with a
 * centred heading and the testimonial cards, stacked on mobile and three
 * across from lg.
 */
export function SuccessStories({
  heading,
  subtitle,
  stories,
  className,
}: Props) {
  return (
    <section
      id="stories"
      aria-labelledby="stories-title"
      className={cn(
        "mx-[max(var(--spacing-shell-inset),calc((100%-var(--container-shell))/2))]",
        "rounded-shell bg-surface px-shell-pad py-stories-y",
        className,
      )}
    >
      <div className="mx-auto max-w-content">
        <div className="text-center">
          <h2
            id="stories-title"
            className="text-section font-medium text-heading"
          >
            <RichText segments={heading} />
          </h2>
          {subtitle ? (
            <p className="mt-3 text-body text-copy lg:mt-4">{subtitle}</p>
          ) : null}
        </div>
        <ul className="mt-intro-cards grid gap-6 lg:grid-cols-3">
          {stories.map((story) => (
            <li key={story.id} className="grid">
              <StoryCard {...story} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
