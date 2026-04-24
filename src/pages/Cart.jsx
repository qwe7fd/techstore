import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, Truck, MapPin } from "lucide-react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState('');

  useEffect(() => {
    const loadCart = () => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    };
    loadCart();
  }, []);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const totalBeforeDiscount = subtotal + tax;
  const discountAmount = totalBeforeDiscount * discount;
  const total = totalBeforeDiscount - discountAmount;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    
    const promoCodes = {
      'SAVE10': { discount: 0.10, message: 'Promo code applied successfully!' }
    };

    if (promoCodes[code]) {
      setDiscount(promoCodes[code].discount);
      setPromoMessage(promoCodes[code].message);
      setAppliedPromoCode(code);
    } else {
      setDiscount(0);
      setPromoMessage('Invalid promo code');
      setAppliedPromoCode('');
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header/>
      <main className="flex-1">
        <div className="bg-gray-50 min-h-screen">
          {cartItems.length === 0 ? (
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

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
                      <div className="w-full sm:w-32 h-32 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <Link 
                                to={`/product/${item.id}`}
                                className="font-semibold hover:text-blue-600 transition-colors"
                              >
                                {item.name}
                              </Link>
                              <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                            </div>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-bold text-lg text-blue-600">${(item.price * item.quantity).toFixed(2)}</p>
                            <p className="text-xs text-gray-500">${item.price.toFixed(2)} each</p>
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
                        {discount > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-green-600">Discount ({appliedPromoCode})</span>
                            <span className="font-semibold text-green-600">-${discountAmount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Tax (8%)</span>
                          <span className="font-semibold">${tax.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                          <span className="font-semibold">Total</span>
                          <span className="font-bold text-xl text-blue-600">${total.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="mb-6">
                        <label className="mb-2 block text-sm font-semibold">Promo Code</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Enter code" 
                            className="flex-1 min-w-0 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20" 
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                          />
                          <button 
                            onClick={handleApplyPromo}
                            disabled={!promoCode.trim()}
                            className="shrink-0 rounded-lg bg-gray-800 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Apply
                          </button>
                        </div>
                        {promoMessage && (
                          <p className={`mt-2 text-xs ${promoMessage.includes('Invalid') ? 'text-red-600' : 'text-green-600'}`}>
                            {promoMessage}
                          </p>
                        )}
                        {!promoMessage && (
                          <p className="mt-2 text-xs text-gray-500">Try code "SAVE10" for 10% off</p>
                        )}
                      </div>
                      <button className="w-full rounded-lg bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-700 transition-colors">
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