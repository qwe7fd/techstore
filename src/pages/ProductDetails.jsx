import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumbs from "../components/Breadcrumbs";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/productsService";
import { ChevronLeft, ChevronRight, Star, StarHalf, ShoppingCart, ChevronDown } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        
        if (data?.related && data.related.length > 0) {
          const relatedData = await Promise.all(
            data.related.map(relatedId => getProductById(relatedId))
          );
          setRelatedProducts(relatedData.filter(p => p !== null));
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header/>
        <main className="flex-1">
          <div className="bg-gray-50 min-h-screen container mx-auto px-4 lg:px-8 py-8">
            <p className="text-center text-gray-600">Loading product...</p>
          </div>
        </main>
        <Footer/>
      </div>
    );
  }

  const images = [product?.image, product?.image, product?.image];
  
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-5 w-5 fill-yellow-400 text-yellow-400" />);
    }
    return stars;
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        image: product.image,
        category: product.category,
        price: product.price,
        quantity: quantity
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header/>
      <main className="flex-1">
        <div className="bg-gray-50 min-h-screen container mx-auto px-4 lg:px-8 py-8">
          <Breadcrumbs 
            category={product?.category}
            productName={product?.name}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                <img 
                  src={images[currentImageIndex]} 
                  alt={`${product?.name} - Image ${currentImageIndex + 1}`}
                  className="h-full w-full object-cover"
                />
                <button 
                  onClick={() => setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex gap-2">
                {images.map((img, index) => (
                  <button 
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-1 aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                      currentImageIndex === index 
                        ? 'border-blue-600 ring-2 ring-blue-600/20' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="mb-3 text-3xl font-bold">{product?.name}</h1>
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {renderStars(product?.rating || 0)}
                    </div>
                    <span className="text-sm text-gray-600">({product?.rating})</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Based on {product?.number_of_reviews || 0} reviews
                  </p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-3xl text-blue-600">${product?.price}</span>
                  <span className="text-sm text-gray-500">Free shipping</span>
                </div>
              </div>

              {product?.highlights && Object.keys(product.highlights).length > 0 && (
                <div className="rounded-lg bg-blue-50 p-4">
                  <h3 className="mb-2 font-semibold text-sm">Key Highlights</h3>
                  <ul className="space-y-1 text-sm">
                    {Object.entries(product.highlights).map(([key, value]) => (
                      <li key={key} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                        <span>
                          <span className="font-medium">{key}:</span> {value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product?.description && (
                <div>
                  <h2 className="mb-3 text-xl font-semibold">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold">Quantity</label>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <button 
                onClick={handleAddToCart}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-4 font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>

              {product?.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="rounded-lg border border-gray-200 bg-white">
                  <button
                    onClick={() => setIsSpecsOpen(!isSpecsOpen)}
                    className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left text-sm font-medium transition-all hover:underline"
                  >
                    Technical Specifications
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isSpecsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isSpecsOpen && (
                    <div className="px-4 pb-4 text-sm">
                      <dl className="space-y-2">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between py-2 border-t border-gray-200">
                            <dt className="font-medium text-gray-700">{key}</dt>
                            <dd className="text-gray-600">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div>
              <h2 className="mb-6 text-xl">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    id={relatedProduct.id}
                    name={relatedProduct.name}
                    image={relatedProduct.image}
                    category={relatedProduct.category}
                    price={relatedProduct.price}
                    rating={relatedProduct.rating}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer/>
    </div>
  )
}

export default ProductDetails;