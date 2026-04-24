import { Search, ShoppingCart, Menu } from "lucide-react"
import { useState, useEffect } from "react"

const Header = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-purple-600">
              <span className="font-bold text-white text-xl">T</span>
            </div>
            <span className="hidden font-bold text-xl sm:inline-block">TechStore</span>
          </a>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Products</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">Categories</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">Deals</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">About</a>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <Search className="h-5 w-5"/>
            </button>
            <a 
              href="/cart" 
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart className="h-5 w-5"/>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-xs font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </a>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 transition-colors md:hidden cursor-pointer"
            >
              <Menu className="h-5 w-5"/>
            </button>
          </div>
        </div>
        
        {isMobileMenuOpen && (
          <nav className="flex flex-col gap-4 pb-4 md:hidden border-t border-gray-200 pt-4">
            <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Products</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">Categories</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">Deals</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">About</a>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header