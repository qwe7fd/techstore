

const Footer = () => {
  return (
    <footer className="w-full border-t bg-gray-50">
      <div className="container mx-auto py-12 px-4 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center font-bold text-xl text-white">
                T
              </div>
              <span className="text-xl font-bold">TechStore</span>
            </div>
            <p class="text-sm text-gray-600 mb-4">
              Your trusted destination for premium electronics and tech accessories. Quality products, competitive prices, exceptional service.
            </p>
            <div class="flex gap-3">
              <a href="#" class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white transition-colors" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-facebook h-4 w-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white transition-colors" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-twitter h-4 w-4"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-instagram h-4 w-4"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
              </a>
              <a href="#" class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white transition-colors" aria-label="YouTube">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-youtube h-4 w-4"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path><path d="m10 15 5-3-5-3z"></path></svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-lg">Quick Links</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><a href="#" className="hover:text-blue-600">Shop All Products</a></li>
              <li><a href="#" className="hover:text-blue-600">Special Deals</a></li>
              <li><a href="#" className="hover:text-blue-600">About Us</a></li>
              <li><a href="#" className="hover:text-blue-600">Contact Support</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Customer Service</h3>
            <ul className="text-sm text-gray-600">
              <li><a href="#" className="hover:text-blue-600">Shipping Information</a></li>
              <li><a href="#" className="hover:text-blue-600">Return & Exchanges</a></li>
              <li><a href="#" className="hover:text-blue-600">FAQ</a></li>
              <li><a href="#" className="hover:text-blue-600">Track Order</a></li>
            </ul>
            <div className="mt-4 text-sm text-gray-600">
              <p className="mb-1">Customer Support</p>
              <p className="font-semibold text-black">1-800-TECH-SHOP</p>
              <p>support@techstore.com</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-gray-600 mb-4">Subscribe to get special offers, free giveaways, and updates.</p>
            <form className="space-y-2">
              <input className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200/60" type="email" placeholder="Enter your email" />
              <button type="submit" class="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 transition-colors">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
      <div className="border-t mt-12 pt-8 text-center text-sm text-gray-600">
        <p>&copy; 2026 TechStore. All rights reserved.</p>
        <div className="mt-2 flex justify-center gap-4">
          <a href="#" className="hover:text-blue-600">Privacy Policy</a>
          <a href="#" className="hover:text-blue-600">Terms of Service</a>
          <a href="#" className="hover:text-blue-600">Cookie Policy</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer;