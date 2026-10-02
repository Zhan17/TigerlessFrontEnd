import type { RichText as RichTextContent } from "@/content/schemas";
import { cn } from "@/lib/cn";
import { TextAction } from "./TextAction";

type RichTextProps = {
  segments: RichTextContent;
  /** Style for emphasised runs, e.g. the green "speaks your language." */
  emphasisClassName?: string;
  linkClassName?: string;
};

/**
 * Renders RichText segments inline (no HTML strings, so no XSS surface).
 * Segment text is the key: content segments are short and distinct.
 */
export function RichText({
  segments,
  emphasisClassName = "text-accent",
  linkClassName = "underline underline-offset-2 hover:text-accent",
}: RichTextProps) {
  return (
    <>
      {segments.map((segment, position) => {
        const key = `${position}-${segment.text}`;
        if (segment.link) {
          return (
            <TextAction
              key={key}
              link={segment.link}
              className={cn(
                linkClassName,
                segment.emphasis && emphasisClassName,
              )}
            >
              {segment.text}
            </TextAction>
          );
        }
        return segment.emphasis ? (
          <span key={key} className={emphasisClassName}>
            {segment.text}
          </span>
        ) : (
          <span key={key}>{segment.text}</span>
        );
      })}
    </>
  );
}
