import { getHomePageData } from "@/content/api";
import { BmiCalculator, toBmiProps } from "@/features/bmi";
import { FaqSection, toFaqProps } from "@/features/faq";
import {
  ClosingCta,
  SiteFooter,
  toClosingCtaProps,
  toFooterProps,
} from "@/features/footer";
import { Hero, toHeroProps } from "@/features/hero";
import { HowItWorks, toHowItWorksProps } from "@/features/how-it-works";
import { SiteHeader, toNavigationProps } from "@/features/navigation";
import { ServicesCarousel, toOnlineCareProps } from "@/features/online-care";
import { ProgramSection, toProgramSectionsProps } from "@/features/programs";
import { SuccessStories, toStoriesProps } from "@/features/stories";
import { TrustStrip } from "@/features/trust-strip";

/**
 * Home page: fetch all content once (server), map it to each section's
 * props and render the sections in order.
 */
export default async function HomePage() {
  const data = await getHomePageData();
  const programSections = toProgramSectionsProps(
    data.home,
    data.programs,
    data.products,
  );
  const { programId: bmiHost, ...bmi } = toBmiProps(data.home);
  const onlineCare = toOnlineCareProps(data.home, data.services);
  const stories = toStoriesProps(data.home, data.testimonials, data.programs);
  const faq = toFaqProps(data.home, data.faqs);

  return (
    <>
      <SiteHeader {...toNavigationProps(data.home, data.programs)} />
      <main>
        <Hero {...toHeroProps(data.home, data.programs, data.languages)} />
        <TrustStrip items={data.home.trustStrip.items} />
        <HowItWorks {...toHowItWorksProps(data.home)} />
        <div className="flex flex-col gap-program-gap pb-section-y">
          {programSections.map((section) => (
            <ProgramSection key={section.id} {...section}>
              {section.id === bmiHost ? <BmiCalculator {...bmi} /> : null}
            </ProgramSection>
          ))}
        </div>
        {onlineCare.services.length > 0 ? (
          <ServicesCarousel {...onlineCare} />
        ) : null}
        {stories.stories.length > 0 ? <SuccessStories {...stories} /> : null}
        {faq.items.length > 0 ? <FaqSection {...faq} /> : null}
        <ClosingCta {...toClosingCtaProps(data.home)} />
      </main>
      <SiteFooter
        {...toFooterProps(data.home, data.programs, new Date().getFullYear())}
      />
    </>
  );
}
