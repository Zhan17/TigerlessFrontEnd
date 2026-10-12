import type { Link } from "@/content/schemas";

/**
 * Turn a content Link into an href, or null when there is no destination
 * yet (`none`): such controls render as buttons with press feedback only.
 */
export function hrefFor(link: Link): string | null {
  switch (link.type) {
    case "anchor":
      return `#${link.target}`;
    case "route":
      return link.path;
    case "external":
      return link.url;
    case "none":
      return null;
  }
}
