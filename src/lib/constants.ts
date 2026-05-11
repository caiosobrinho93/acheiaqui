export const PRODUCT_CATEGORIES = [
  "Hardware",
  "Monitores",
  "Periféricos",
  "Smartphones",
  "Games",
  "Cadeiras",
  "Setup",
  "Moda",
  "Acessórios",
  "Setup Master",
  "Tech Home",
  "Home Luxury"
] as const;

export type Category = typeof PRODUCT_CATEGORIES[number];
