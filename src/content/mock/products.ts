import type { Product } from "../schemas";
import { images } from "./images";

export const products: Product[] = [
  {
    id: "compounded-semaglutide",
    programId: "weight-loss",
    name: "Compounded Semaglutide",
    price: { amountMinor: 20000, currency: "USD", interval: "month" },
    image: images.vialProduct,
  },
  {
    id: "compounded-tirzepatide",
    programId: "weight-loss",
    name: "Compounded Tirzepatide",
    price: { amountMinor: 20000, currency: "USD", interval: "month" },
    image: images.vialProduct,
  },
];
