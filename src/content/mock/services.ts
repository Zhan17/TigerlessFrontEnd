import type { Service } from "../schemas";
import { images } from "./images";

export const services: Service[] = [
  {
    id: "provider-support",
    title: "24/7 Provider Support",
    media: {
      kind: "chat",
      image: images.phoneMockup,
      chat: {
        providerName: "Dr. Helena Fox",
        providerAvatar: images.providerAvatar,
        status: "Online",
        dayLabel: "Today",
        messages: [
          {
            id: "m1",
            from: "provider",
            text: "Hello! How are you feeling today?",
            time: "10:00 AM",
          },
          {
            id: "m2",
            from: "patient",
            text: "I’m feeling fine, thank you! Just want to follow up on my recent tests.",
            time: "10:00 AM",
          },
        ],
      },
    },
  },
  {
    id: "treatment-management",
    // F05: "Easy Manager Treatment" -> "Easy Treatment Management".
    title: "Easy Treatment Management",
    media: { kind: "photo", image: images.clinicians },
  },
  {
    id: "fda-approved-options",
    title: "Access to FDA-approved Medication Options",
    media: { kind: "product", image: images.wegovyPens },
  },
  {
    id: "expedited-shipping",
    title: "Free Expedited Shipping",
    media: { kind: "photo", image: images.delivery },
  },
];
