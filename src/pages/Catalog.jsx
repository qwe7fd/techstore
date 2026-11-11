import { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import FiltersSidebar from "../components/FiltersSidebar";
import { SlidersHorizontal, Search } from "lucide-react";
import { ChevronDown, Check } from "lucide-react";
import { getProducts } from "../services/productsService";

const PAGE_SIZE = 12;

const Catalog = () => {
  const [sortBy, setSortBy] = useState("name-asc");
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [priceQuery, setPriceQuery] = useState([0, 3000]);
  const [ratingFilters, setRatingFilters] = useState({ 5: false, 4: false, 3: false });
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadTick, setReloadTick] = useState(0);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const dropdownRef = useRef(null);

  // sort_by/order values the API understands (whitelisted server-side)
  const sortOptions = [
    { value: "name-asc", label: "Name (A-Z)", sort_by: "title", order: "asc" },
    { value: "name-desc", label: "Name (Z-A)", sort_by: "title", order: "desc" },
    { value: "price-asc", label: "Price (Low to High)", sort_by: "price", order: "asc" },
    { value: "price-desc", label: "Price (High to Low)", sort_by: "price", order: "desc" }
  ];

  const selectedOption = sortOptions.find(opt => opt.value === sortBy);

  // The checked ratings mean "5+, 4+, 3+" and a product passes when any
  // applies — which is exactly rating >= the lowest checked value.
  const activeRatings = Object.keys(ratingFilters)
    .filter(key => ratingFilters[key])
    .map(Number);
  const minRating = activeRatings.length > 0 ? Math.min(...activeRatings) : undefined;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce the search box before it hits the API.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // The price range slider fires continuously while dragging —
  // debounce it too before querying the server.
  useEffect(() => {
    const timer = setTimeout(() => {
      setPriceQuery(priceRange);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [priceRange]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const data = await getProducts({
          page,
          limit: PAGE_SIZE,
          search: searchQuery || undefined,
          min_price: priceQuery[0] !== 0 ? priceQuery[0] : undefined,
          max_price: priceQuery[1] !== 3000 ? priceQuery[1] : undefined,
          min_rating: minRating,
          sort_by: selectedOption?.sort_by,
          order: selectedOption?.order,
        });
        setProducts(data.items);
        setMeta(data.meta);
      } catch (err) {
        setLoadError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [page, searchQuery, sortBy, priceQuery, ratingFilters, reloadTick]);

  const clearFilters = () => {
    setSearchInput("");
    setPriceRange([0, 3000]);
    setPriceQuery([0, 3000]);
    setRatingFilters({ 5: false, 4: false, 3: false });
    setPage(1);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-gray-50">
          <div className="container mx-auto py-8 px-4 lg:px-8">
            <div className="mb-8">
              <h1 className="mb-2 text-2xl font-medium">Premium Electronics</h1>
              <p className="text-gray-600">Discover our curated collection of high-quality tech products</p>
            </div>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="h-4 w-4"/>
                  Filters
                </button>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
                {meta && (
                  <p className="hidden text-sm text-gray-600 lg:block">{meta.total_items} products</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex w-45 items-center justify-between rounded-md bg-white px-3 py-2 text-sm text-gray-900 cursor-pointer"
                  >
                    <span className="font-semibold">{selectedOption?.label}</span>
                    <ChevronDown className="opacity-50 size-4"/>
                  </button>
                  
                  {isOpen && (
                    <div className="absolute top-full z-10 mt-2 w-full rounded-xl border border-gray-200 bg-white p-1 shadow-lg">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setPage(1);
                            setIsOpen(false);
                          }}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 cursor-pointer"
                        >
                          <span className="font-medium">{option.label}</span>
                          {sortBy === option.value && (
                            <Check className="size-4 opacity-50"/>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-8">
              {isFiltersOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                  <div 
                    className="absolute inset-0 bg-black/50"
                    onClick={() => setIsFiltersOpen(false)}
                  />
                  <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto">
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                      <h2 className="font-semibold flex items-center gap-2 text-lg">
                        <SlidersHorizontal className="h-5 w-5"/>
                        Filters
                      </h2>
                      <button
                        onClick={() => setIsFiltersOpen(false)}
                        className="text-gray-500 hover:text-gray-700 cursor-pointer"
                      >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="p-6">
                      <FiltersSidebar
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        ratingFilters={ratingFilters}
                        setRatingFilters={setRatingFilters}
                        clearFilters={clearFilters}
                        showTitle={false}
                      />
                    </div>
                  </div>
                </div>
              )}

              <aside className="hidden lg:block w-64 shrink-0 sticky top-20 self-start rounded-lg border border-gray-200 bg-white p-6">
                <FiltersSidebar
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  ratingFilters={ratingFilters}
                  setRatingFilters={setRatingFilters}
                  clearFilters={clearFilters}
                />
              </aside>

              <div className="flex-1">
                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">Loading products...</p>
                  </div>
                ) : loadError ? (
                  <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                    <p className="mb-4 text-red-600">{loadError}</p>
                    <button
                      onClick={() => setReloadTick(t => t + 1)}
                      className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      Retry
                    </button>
                  </div>
                ) : products.length === 0 ? (
                  <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                    <p className="mb-2 text-lg font-semibold">No products match your filters</p>
                    <p className="mb-6 text-sm text-gray-600">Try adjusting the search or clearing the filters.</p>
                    <button
                      onClick={clearFilters}
                      className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {products.map((product) => (
                        <ProductCard
                          key={product.id}
                          id={product.id}
                          name={product.name}
                          image={product.image}
                          category={product.category}
                          price={product.price}
                          rating={product.rating}
                        />
                      ))}
                    </div>
                    {meta && meta.total_pages > 1 && (
                      <div className="mt-10 flex items-center justify-center gap-4">
                        <button
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={page <= 1}
                          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          Previous
                        </button>
                        <span className="text-sm text-gray-600">
                          Page {meta.current_page} of {meta.total_pages}
                        </span>
                        <button
                          onClick={() => setPage(p => Math.min(meta.total_pages, p + 1))}
                          disabled={page >= meta.total_pages}
                          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Catalog;
