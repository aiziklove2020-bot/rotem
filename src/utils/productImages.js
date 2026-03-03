/**
 * Returns product images array with backward compatibility for legacy single `image` field.
 */
export function getProductImages(product) {
  return product?.images?.length ? product.images : (product?.image ? [product.image] : [])
}
