import { Star, ShoppingCart } from "lucide-react";

const ProductCard = ({ id, name, image, category, price, rating }) => {
  const handleAddToCart = (e) => {
    e.preventDefault();
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = cart.findIndex(item => item.id === id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ id, name, image, category, price, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  };
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="h-4 w-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <a
      className="group block overflow-hidden rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-shadow"
      href={`/product/${id}`}
    >
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img 
          src={image} 
          alt={name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4">
        <h3 className="mb-2 font-medium text-lg line-clamp-2">{name}</h3>
      
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {renderStars()}
            </div>
            <span className="text-sm text-gray-600">({rating})</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-blue-600 text-lg font-bold">${price}</span>
          <span className="text-gray-500 text-xs uppercase">{category}</span>
        </div>

        <button
          onClick={handleAddToCart}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </a>
  )
}

export default ProductCard;