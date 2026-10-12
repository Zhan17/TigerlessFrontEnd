import { pickByIds } from "@/content/api/pick-by-ids";
import type { HomeContent, RichText, Service } from "@/content/schemas";

export type OnlineCareProps = {
  heading: RichText;
  services: Service[];
};

/** API content -> services carousel (order from home content). */
export function toOnlineCareProps(
  home: HomeContent,
  services: readonly Service[],
): OnlineCareProps {
  return {
    heading: home.onlineCare.heading,
    services: pickByIds(home.onlineCare.serviceIds, services),
  };
}
