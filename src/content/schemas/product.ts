import { z } from "zod";
import { Id, Image, RecurringPrice } from "./common";

/**
 * GET /products — purchasable products shown as cards under a program
 * (Compounded Semaglutide / Tirzepatide). The card button label is shared
 * and lives in home content (`ctas`), not on each product.
 */
export const Product = z.object({
  id: Id,
  /** The program this product belongs to. */
  programId: Id,
  name: z.string().min(1),
  price: RecurringPrice,
  image: Image,
});

export const ProductList = z.array(Product);

export type Product = z.infer<typeof Product>;
