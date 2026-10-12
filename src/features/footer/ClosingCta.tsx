import { LogoIcon } from "@/components/icons";
import { CtaButton } from "@/features/shared/CtaButton";
import { RichText } from "@/features/shared/RichText";
import { cn } from "@/lib/cn";
import type { ClosingCtaProps } from "./to-footer-props";

type Props = ClosingCtaProps & { className?: string };

/**
 * "Ready For Healthcare In Your Language?": a gradient card in a white shell
 * with rounded top corners that runs into the footer. A large translucent
 * wordmark sits behind the content. Centred and stacked on mobile; heading
 * top-left, points bottom-left and the button bottom-right from lg.
 */
export function ClosingCta({ heading, points, cta, className }: Props) {
  return (
    <section
      aria-labelledby="closing-cta-title"
      className={cn(
        "rounded-t-shell bg-surface px-footer-x pt-footer-x pb-cta-bottom",
        className,
      )}
    >
      <div className="relative isolate mx-auto flex min-h-140 max-w-footer flex-col sm:min-h-0 overflow-hidden rounded-card bg-linear-158 from-cta-start to-cta-end p-feature-pad text-center text-white lg:min-h-62.5 lg:text-left">
        <LogoIcon className="absolute bottom-11 left-0 -z-10 aspect-[87/32] h-auto w-[102.4%] text-brand-900/10 sm:left-1/2 sm:w-[min(102.4%,32rem)] sm:-translate-x-1/2 lg:top-0 lg:bottom-auto lg:left-[34.7%] lg:w-[60.3%] lg:translate-x-0" />

        <h2
          id="closing-cta-title"
          className="text-cta font-medium text-balance lg:max-w-[36rem] lg:text-wrap"
        >
          <RichText segments={heading} />
        </h2>

        <div className="mt-10 flex flex-1 flex-col items-center justify-between gap-10 lg:mt-auto lg:flex-none lg:flex-row lg:items-end">
          {points.length > 0 ? (
            <ul className="flex flex-col items-center gap-3 text-cta-point lg:flex-row">
              {points.map((point, index) => (
                <li
                  key={point}
                  className="flex flex-col items-center gap-3 lg:flex-row"
                >
                  {index > 0 ? (
                    <span
                      aria-hidden
                      className="size-1 rounded-full bg-current"
                    />
                  ) : null}
                  {point}
                </li>
              ))}
            </ul>
          ) : null}
          {cta ? (
            <CtaButton
              cta={cta}
              size="lg"
              fullWidth="belowLg"
              withArrow
              className="mt-auto lg:mt-0"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
