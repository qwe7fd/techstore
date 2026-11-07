const API_BASE_URL = 'https://techstore-api-mdzs.onrender.com/api';

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
});

let catalogCache = null;

const fetchCatalog = async () => {
  if (!catalogCache) {
    const response = await fetch(`${API_BASE_URL}/products?limit=100`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    catalogCache = data.items.map(mapProduct);
  }
  return catalogCache;
};

export const getProducts = async () => {
  return await fetchCatalog();
};

export const getProductById = async (id) => {
  const catalog = await fetchCatalog();
  const product = catalog.find(p => p.id === Number(id));
  if (!product) {
    throw new Error(`Product with id ${id} not found`);
  }

  // The UI shows same-category items as related products
  const related = catalog
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3)
    .map(p => p.id);

  return { ...product, related };
};