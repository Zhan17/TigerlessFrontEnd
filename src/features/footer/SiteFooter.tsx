import { LogoIcon } from "@/components/icons";
import { SocialLinks } from "@/components/ui/social-links";
import { HomeLink } from "@/features/shared/HomeLink";
import { RichText } from "@/features/shared/RichText";
import { TextAction } from "@/features/shared/TextAction";
import { cn } from "@/lib/cn";
import { uiCopy } from "@/lib/ui-copy";
import type { SiteFooterProps } from "./to-footer-props";

type Props = SiteFooterProps & { className?: string };

const link =
  "text-left transition-colors duration-(--duration-fast) hover:text-mint-100 active:text-green-light";

/**
 * Dark footer: brand block and link columns, disclaimer, terms, a divider
 * aligned with the content edges (F13), socials and copyright, then the
 * giant wordmark cut off by the bottom of the page, fading into the
 * background.
 */
export function SiteFooter({
  tagline,
  columns,
  disclaimer,
  terms,
  socials,
  copyright,
  className,
}: Props) {
  return (
    <footer
      className={cn(
        "overflow-hidden bg-brand-900 px-footer-x pt-footer-top text-off-white",
        className,
      )}
    >
      <div className="mx-auto max-w-footer">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-8">
          <div>
            <HomeLink aria-label={uiCopy.nav.home} className="inline-block">
              <LogoIcon className="h-20.75 w-56.5" />
            </HomeLink>
            <p className="mt-3 max-w-[22.5rem] text-footer-title">{tagline}</p>
          </div>

          <nav
            aria-label={uiCopy.footer.navLabel}
            className="grid gap-5 lg:grid-cols-[repeat(3,minmax(0,15.3125rem))] lg:gap-x-4 xl:gap-x-0"
          >
            {columns.map((column) => (
              <div key={column.id}>
                <h2 className="text-footer-title">{column.title}</h2>
                <ul className="mt-2.5 text-meta leading-7">
                  {column.items.map((item) => (
                    <li key={item.id}>
                      <TextAction link={item.link} className={link}>
                        {item.label}
                      </TextAction>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-5 flex max-w-content flex-col gap-6 text-footer lg:mt-14 lg:gap-4">
          {disclaimer.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p>
            <RichText segments={terms} linkClassName={link} />
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-10 border-t border-border-footer pt-8 lg:mt-6 lg:flex-row lg:items-center lg:justify-between">
          <SocialLinks links={socials} tone="footer" />
          <p className="text-meta">{copyright}</p>
        </div>
      </div>

      {/* Giant wordmark: solid for the top ~40%, then fading out over a
          slightly lighter band; the page ends before its bottom (about 65%
          of it shows). Centred on the page, wider than the screen on mobile. */}
      <div
        aria-hidden
        className="-mx-footer-x mt-section-y bg-linear-to-b from-transparent from-35% via-brand-800 via-70% to-brand-900"
      >
        <div className="relative left-1/2 aspect-[4.215] w-wordmark -translate-x-1/2 overflow-hidden [mask-image:linear-gradient(to_bottom,black_39%,transparent)]">
          <LogoIcon className="absolute inset-x-0 top-0 aspect-[87/32] h-auto w-full" />
        </div>
      </div>
    </footer>
  );
}
