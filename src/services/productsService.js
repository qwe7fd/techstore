import { apiFetch } from './apiClient';

// The API returns products as { title, images: [...] }, while the UI
// historically works with { name, image }. mapProduct translates between them.
const mapProduct = (product) => ({
  id: product.id,
  name: product.title,
  image: product.images?.[0],
  images: product.images ?? [],
  category: product.category,
  price: product.price,
  rating: product.rating,
  description: product.description,
  stock_quantity: product.stockQuantity,
});

// Full catalog snapshot kept only for related-product lookups —
// the API has no dedicated endpoint for them.
let catalogCache = null;

const fetchCatalog = async () => {
  if (!catalogCache) {
    const response = await apiFetch('/products?limit=100', { auth: false });
    catalogCache = response.items.map(mapProduct);
  }
  return catalogCache;
};

// Search, filters, sorting and pagination are all executed by the API.
export const getProducts = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set('page', String(params.page));
  if (params.limit !== undefined) query.set('limit', String(params.limit));
  if (params.search) query.set('search', params.search);
  if (params.min_price !== undefined) query.set('min_price', String(params.min_price));
  if (params.max_price !== undefined) query.set('max_price', String(params.max_price));
  if (params.min_rating !== undefined) query.set('min_rating', String(params.min_rating));
  if (params.sort_by) query.set('sort_by', params.sort_by);
  if (params.order) query.set('order', params.order);

  const path = `/products${query.toString() ? `?${query}` : ''}`;
  const response = await apiFetch(path, { auth: false });
  return {
    items: response.items.map(mapProduct),
    meta: response.meta,
  };
};

export const getProductById = async (id) => {
  const product = await apiFetch(`/products/${id}`, { auth: false });
  const mapped = mapProduct(product);
  const catalog = await fetchCatalog();

  // The UI shows same-category items as related products
  const related = catalog
    .filter(p => p.category === mapped.category && p.id !== mapped.id)
    .slice(0, 3)
    .map(p => p.id);

  return { ...mapped, related };
};

// Admin endpoints — require a JWT with the admin role.
export const createProduct = (dto) =>
  apiFetch('/products', { method: 'POST', body: dto });

export const updateProduct = (id, dto) =>
  apiFetch(`/products/${id}`, { method: 'PATCH', body: dto });

export const deleteProduct = (id) =>
  apiFetch(`/products/${id}`, { method: 'DELETE' });
