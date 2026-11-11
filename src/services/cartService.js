import { apiFetch } from './apiClient';

export const emitCartChange = () => window.dispatchEvent(new Event('cartUpdated'));

// All cart endpoints require a JWT. Mutations return the fresh cart,
// apply-promo returns the discount calculation without saving anything.
export const getCart = () => apiFetch('/cart');

export const addItem = (productId, quantity) =>
  apiFetch('/cart/items', { method: 'POST', body: { product_id: productId, quantity } });

export const updateItem = (itemId, quantity) =>
  apiFetch(`/cart/items/${itemId}`, { method: 'PATCH', body: { quantity } });

export const removeItem = (itemId) =>
  apiFetch(`/cart/items/${itemId}`, { method: 'DELETE' });

export const applyPromo = (code) =>
  apiFetch('/cart/apply-promo', { method: 'POST', body: { code } });

// Adds a product to the API cart; the API answers 409 when the product
// is already in the cart, so the quantity is bumped instead.
export const addToCart = async (product, quantity = 1) => {
  try {
    return await addItem(product.id, quantity);
  } catch (error) {
    if (error.status !== 409) {
      throw error;
    }
    const cart = await getCart();
    const existing = cart.items.find((item) => item.product.id === product.id);
    if (!existing) {
      throw error;
    }
    return updateItem(existing.id, existing.quantity + quantity);
  }
};

// One-time move of the legacy localStorage cart into the API cart
// after signing in. Duplicates (409) and stale products (404) are skipped.
export const migrateLocalCart = async () => {
  const savedCart = localStorage.getItem('cart');
  if (!savedCart) {
    return;
  }
  localStorage.removeItem('cart');
  try {
    const items = JSON.parse(savedCart);
    for (const item of items) {
      try {
        await addItem(item.id, item.quantity);
      } catch {
        // keep migrating the rest
      }
    }
  } catch {
    // unparsable legacy data — drop it
  } finally {
    emitCartChange();
  }
};
