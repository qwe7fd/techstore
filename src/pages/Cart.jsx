import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, Truck, MapPin } from "lucide-react";
import { getCurrentUser } from "../services/authService";
import { getCart, updateItem, removeItem, applyPromo, emitCartChange } from "../services/cartService";

const Cart = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoResult, setPromoResult] = useState(null);
  const [promoMessage, setPromoMessage] = useState('');
  const [applyingPromo, setApplyingPromo] = useState(false);

  const loadCart = useCallback(async () => {
    if (!getCurrentUser()) {
      setCart(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError('');
    try {
      const data = await getCart();
      setCart(data);
    } catch (err) {
      setLoadError(err.message || 'Failed to load the cart');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();

    const handleAuthChange = () => {
      setUser(getCurrentUser());
      loadCart();
    };

    window.addEventListener('authUpdated', handleAuthChange);
    return () => window.removeEventListener('authUpdated', handleAuthChange);
  }, [loadCart]);

  const forgetPromo = () => {
    setPromoResult(null);
    setPromoMessage('');
  };

  const handleUpdateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) return;
    setActionError('');
    setUpdatingItemId(item.id);
    try {
      const data = await updateItem(item.id, newQuantity);
      setCart(data);
      emitCartChange();
      forgetPromo();
    } catch (err) {
      setActionError(err.message || 'Failed to update quantity');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemove = async (itemId) => {
    setActionError('');
    try {
      await removeItem(itemId);
      emitCartChange();
      const data = await getCart();
      setCart(data);
      forgetPromo();
    } catch (err) {
      setActionError(err.message || 'Failed to remove the item');
    }
  };

  const handleApplyPromo = async () => {
    setApplyingPromo(true);
    setPromoMessage('');
    try {
      const result = await applyPromo(promoCode);
      setPromoResult(result);
      setPromoMessage('Promo code applied successfully!');
    } catch (err) {
      setPromoResult(null);
      setPromoMessage(err.message || 'Invalid promo code');
    } finally {
      setApplyingPromo(false);
    }
  };

  // Totals come from the API: the cart carries subtotal, apply-promo
  // recalculates it with the discount (nothing is stored server-side).
  const subtotal = promoResult ? promoResult.subtotal : (cart?.subtotal ?? 0);
  const discountAmount = promoResult ? promoResult.discount_amount : 0;
  const total = promoResult ? promoResult.total : (cart?.subtotal ?? 0);

  return (
    <div className="flex min-h-screen flex-col">
      <Header/>
      <main className="flex-1">
        <div className="bg-gray-50 min-h-screen">
          {!user ? (
            <div className="container mx-auto px-4 lg:px-8 py-16">
              <div className="text-center">
                <h1 className="mb-4 text-2xl">Sign in to view your cart</h1>
                <p className="mb-8 text-gray-600">Your cart is saved to your account and follows you across devices.</p>
                <button 
                  onClick={() => navigate('/login')}
                  className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <p className="mt-4 text-sm text-gray-600">
                  New here?{" "}
                  <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          ) : loading ? (
            <div className="container mx-auto px-4 lg:px-8 py-16">
              <p className="text-center text-gray-600">Loading cart...</p>
            </div>
          ) : loadError ? (
            <div className="container mx-auto px-4 lg:px-8 py-16">
              <div className="text-center">
                <p className="mb-4 text-red-600">{loadError}</p>
                <button 
                  onClick={loadCart}
                  className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="container mx-auto px-4 lg:px-8 py-16">
              <div className="text-center">
                <h1 className="mb-4 text-2xl">Your Cart is Empty</h1>
                <p className="mb-8 text-gray-600">Add some amazing products to get started!</p>
                <Link 
                  to="/"
                  className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          ) : (
            <div className="container mx-auto px-4 lg:px-8 py-8">
              <h1 className="mb-8 text-2xl font-semibold">Shopping Cart</h1>

              {actionError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {actionError}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
                      <div className="w-full sm:w-32 h-32 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <img 
                          src={item.product.images?.[0]} 
                          alt={item.product.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <Link 
                                to={`/product/${item.product.id}`}
                                className="font-semibold hover:text-blue-600 transition-colors"
                              >
                                {item.product.title}
                              </Link>
                              <p className="mt-1 text-sm text-gray-500">${item.product.price.toFixed(2)} each</p>
                            </div>
                            <button 
                              onClick={() => handleRemove(item.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updatingItemId === item.id}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <button 
                              onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock_quantity || updatingItemId === item.id}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-bold text-lg text-blue-600">${(item.product.price * item.quantity).toFixed(2)}</p>
                            <p className="text-xs text-gray-500">{item.product.stock_quantity} in stock</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-1">
                  <div className="sticky top-24 space-y-4">
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                      <h2 className="mb-4 font-semibold text-xl">Order Summary</h2>
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-semibold">${subtotal.toFixed(2)}</span>
                        </div>
                        {promoResult && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-green-600">Discount ({promoResult.promo_code}, {promoResult.discount_percentage}%)</span>
                            <span className="font-semibold text-green-600">-${discountAmount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                          <span className="font-semibold">Total</span>
                          <span className="font-bold text-xl text-blue-600">${total.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="mb-6">
                        <label htmlFor="promoCode" className="mb-2 block text-sm font-semibold">Promo Code</label>
                        <div className="flex gap-2">
                          <input 
                            id="promoCode"
                            type="text" 
                            placeholder="Enter code" 
                            className="flex-1 min-w-0 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20" 
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                          />
                          <button 
                            onClick={handleApplyPromo}
                            disabled={!promoCode.trim() || applyingPromo}
                            className="shrink-0 rounded-lg bg-gray-800 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            Apply
                          </button>
                        </div>
                        {promoMessage && (
                          <p className={`mt-2 text-xs ${promoMessage.includes('Invalid') || promoMessage.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
                            {promoMessage}
                          </p>
                        )}
                        {!promoMessage && (
                          <p className="mt-2 text-xs text-gray-500">Try code "SAVE10" for 10% off</p>
                        )}
                      </div>
                      <button className="w-full rounded-lg bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer">
                        Proceed to Checkout
                      </button>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                      <h3 className="mb-4 flex items-center gap-2 font-semibold">
                        <Truck className="h-5 w-5 text-blue-600" />
                        Shipping Information
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-medium">Delivery Address</p>
                            <p className="text-gray-600">123 Tech Street</p>
                            <p className="text-gray-600">San Francisco, CA 94105</p>
                          </div>
                        </div>
                        <div className="border-t border-gray-200 pt-3">
                          <p className="font-medium">Estimated Delivery</p>
                          <p className="text-gray-600">3-5 business days</p>
                          <p className="text-green-600 mt-1">Free shipping on orders over $50</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>        
      </main>
      <Footer/>
    </div>
  )
}

export default Cart;
