import { getHomePageData } from "@/content/api";
import { Hero, toHeroProps } from "@/features/hero";
import { SiteHeader, toNavigationProps } from "@/features/navigation";

export default async function HomePage() {
  const data = await getHomePageData();

  return (
    <>
      <SiteHeader {...toNavigationProps(data.home, data.programs)} />
      <main>
        <Hero {...toHeroProps(data.home, data.programs, data.languages)} />
        <div className="h-[100vh]" />
      </main>
    </>
  );
}
