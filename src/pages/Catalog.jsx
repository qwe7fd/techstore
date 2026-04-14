import { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import FiltersSidebar from "../components/FiltersSidebar";
import { SlidersHorizontal } from "lucide-react";
import { ChevronDown, Check } from "lucide-react";
import { getProducts } from "../services/productsService";

const Catalog = () => {
  const [sortBy, setSortBy] = useState("name-asc");
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [ratingFilters, setRatingFilters] = useState({ 5: false, 4: false, 3: false });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const dropdownRef = useRef(null);

  const sortOptions = [
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "price-asc", label: "Price (Low to High)" },
    { value: "price-desc", label: "Price (High to Low)" }
  ];

  const selectedOption = sortOptions.find(opt => opt.value === sortBy);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const clearFilters = () => {
    setPriceRange([0, 3000]);
    setRatingFilters({ 5: false, 4: false, 3: false });
  }

  const filteredAndSortedProducts = () => {
    let result = [...products];

    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    const activeRatings = Object.keys(ratingFilters).filter(key => ratingFilters[key]);
    if (activeRatings.length > 0) {
      result = result.filter(product => {
        return activeRatings.some(rating => product.rating >= Number(rating));
      });
    }

    switch (sortBy) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return result;
  };

  const displayedProducts = filteredAndSortedProducts();

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
                  className="lg:hidden flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <SlidersHorizontal className="h-4 w-4"/>
                  Filters
                </button>
                <p className="text-sm text-gray-600">{displayedProducts.length} products</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex w-45 items-center justify-between rounded-md bg-white px-3 py-2 text-sm text-gray-900"
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
                            setIsOpen(false);
                          }}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900"
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
                        className="text-gray-500 hover:text-gray-700"
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
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedProducts.map((product) => (
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