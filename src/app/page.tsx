import { getHomePageData } from "@/content/api";
import { SiteHeader, toNavigationProps } from "@/features/navigation";

export default async function HomePage() {
  const data = await getHomePageData();

  return (
    <>
      <SiteHeader {...toNavigationProps(data.home, data.programs)} />
      <main className="min-h-[200vh]" />
    </>
  );
}
