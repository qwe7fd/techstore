import { Search, ShoppingCart, Menu, User, LogOut } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getCurrentUser, logout } from "../services/authService"
import { getCart } from "../services/cartService"

const Header = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(getCurrentUser());
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // The cart lives on the API and needs an account: guests have no badge.
    const updateCartCount = async () => {
      if (!getCurrentUser()) {
        setCartCount(0);
        return;
      }
      try {
        const cart = await getCart();
        setCartCount(cart.items_count);
      } catch {
        // keep the last known count; the cart page surfaces errors
      }
    };

    const handleAuthChange = () => {
      setUser(getCurrentUser());
      setIsUserMenuOpen(false);
      updateCartCount();
    };

    const handleStorageChange = () => {
      setUser(getCurrentUser());
      updateCartCount();
    };

    updateCartCount();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('authUpdated', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('authUpdated', handleAuthChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const mobileNavLinkClass = "text-gray-700 hover:text-blue-600 transition-colors";

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

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-label="Account"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <User className="h-5 w-5"/>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                    <div className="px-3 py-2">
                      <p className="truncate text-sm font-semibold text-gray-900">{user.email}</p>
                      <span className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold uppercase text-blue-600">
                        {user.role}
                      </span>
                    </div>
                    <div className="my-1 border-t border-gray-200"/>
                    <Link
                      to="/cart"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      My Cart
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4"/>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                aria-label="Sign In"
                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <User className="h-5 w-5"/>
              </Link>
            )}

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
            <a href="/" className={mobileNavLinkClass}>Products</a>
            <a href="#" onClick={(e) => e.preventDefault()} className={`${mobileNavLinkClass} cursor-pointer`}>Categories</a>
            <a href="#" onClick={(e) => e.preventDefault()} className={`${mobileNavLinkClass} cursor-pointer`}>Deals</a>
            <a href="#" onClick={(e) => e.preventDefault()} className={`${mobileNavLinkClass} cursor-pointer`}>About</a>
            {user ? (
              <button onClick={handleLogout} className={`text-left ${mobileNavLinkClass} cursor-pointer`}>
                Sign Out ({user.email})
              </button>
            ) : (
              <Link to="/login" className={mobileNavLinkClass}>Sign In</Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
