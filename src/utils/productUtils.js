export function normalizeProducts(products) {
  return products.map(normalizeProduct).filter(Boolean);
}

export function normalizeProduct(product) {
  return String(product || "").trim().toLowerCase();
}

export function hasProduct(products, product) {
  return products.includes(normalizeProduct(product));
}
