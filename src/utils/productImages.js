/**
 * Returns product images array with backward compatibility for legacy single `image` field.
 * Filters out falsy entries so partial/corrupt data still shows valid images.
 */
export function getProductImages(product) {
  if (!product) return []
  if (Array.isArray(product.images) && product.images.length > 0) {
    const valid = product.images.filter((src) => src != null && String(src).trim() !== '')
    return valid.length > 0 ? valid : product.image ? [product.image] : []
  }
  return product.image ? [product.image] : []
}
