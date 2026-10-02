import { getHomePageData } from "@/content/api";
import { BmiCalculator, toBmiProps } from "@/features/bmi";
import { Hero, toHeroProps } from "@/features/hero";
import { HowItWorks, toHowItWorksProps } from "@/features/how-it-works";
import { SiteHeader, toNavigationProps } from "@/features/navigation";
import { ProgramSection, toProgramSectionsProps } from "@/features/programs";
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
      </main>
    </>
  );
}
