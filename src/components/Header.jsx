import { Search, ShoppingCart } from "lucide-react"
import { useState, useEffect } from "react"

const Header = () => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalCount);
      } else {
        setCartCount(0);
      }
    };

    updateCartCount();

    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        updateCartCount();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 h-16 shadow-sm bg-white w-full">
      <div className="container h-full mx-auto px-4 lg:px-8 flex items-center justify-between">
        <a
          href="/" 
          className="flex items-center gap-2"
        >
          <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-[10px] flex items-center justify-center font-bold text-xl text-white">
            T
          </div>
          <span className="hidden sm:inline-block text-xl font-bold">TechStore</span>
        </a>
        
      <nav className="flex justify-between">
        <ul className="flex items-center gap-8">
          <li><a href="#" className="text-gray-700 hover:text-blue-600">Products</a></li>
          <li><a href="#" className="text-gray-700 hover:text-blue-600">Categories</a></li>
          <li><a href="#" className="text-gray-700 hover:text-blue-600">Deals</a></li>
          <li><a href="#" className="text-gray-700 hover:text-blue-600">About</a></li>
        </ul>
      </nav>

      <div className="flex items-center gap-4">
        <button className="flex h-10 w-10 items-center justify-center">
          <Search className="h-5 w-5"/>
        </button>
        <a href="/cart" className="relative h-10 w-10 flex items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 transition-colors">
          <ShoppingCart className="h-5 w-5"/>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-600 px-1 text-xs font-semibold text-white">
              {cartCount}
            </span>
          )}
        </a>
      </div>
      </div>
    </header>
  )
}

export default Header