import productsData from '../data/products.json';

const USE_MOCK_DATA = true;
const API_BASE_URL = 'https://api.example.com';

export const getProducts = async () => {
  if (USE_MOCK_DATA) {
    return productsData;
  }

  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return await response.json();
};

export const getProductById = async (id) => {
  if (USE_MOCK_DATA) {
    const product = productsData.find(p => p.id === Number(id));
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return product;
  }

  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch product ${id}`);
  }
  return await response.json();
};