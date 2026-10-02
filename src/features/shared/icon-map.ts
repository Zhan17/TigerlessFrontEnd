import type { ComponentType, SVGProps } from "react";
import {
  CustomerSupportIcon,
  GlobeEarthIcon,
  MapLocationIcon,
  PaymentSuccessIcon,
  StethoscopeIcon,
  TruckIcon,
} from "@/components/icons";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

/** Icon keys the content API may send (TrustItem.icon). */
const icons: Record<string, Icon> = {
  "globe-earth": GlobeEarthIcon,
  stethoscope: StethoscopeIcon,
  truck: TruckIcon,
  "map-location": MapLocationIcon,
  "payment-success": PaymentSuccessIcon,
  "customer-support": CustomerSupportIcon,
};

/** Unknown keys return null: the item renders without an icon. */
export function iconFor(key: string): Icon | null {
  return icons[key] ?? null;
}
