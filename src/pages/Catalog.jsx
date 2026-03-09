import { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { SlidersHorizontal } from "lucide-react";
import { ChevronDown, Check } from "lucide-react";
import { Range, getTrackBackground } from "react-range";

const Catalog = () => {
  const [sortBy, setSortBy] = useState("name-asc");
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 3000]);

  const dropdownRef = useRef(null);
  const PRICE_MIN = 0;
  const PRICE_MAX = 3000;
  const PRICE_STEP = 50;

  const sortOptions = [
    { value: "name-asc", label: "Name (A-Z)" },
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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto py-8 px-4 lg:px-8">
            <div className="mb-8">
              <h1 className="mb-2 text-2xl">Premium Electronics</h1>
              <p className="text-gray-600">Discover our curated collection of high-quality tech products</p>
            </div>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <button className="hidden"></button>
                <p className="text-sm text-gray-600">{/* TODO: Display product count */}X products</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex w-45 items-center justify-between rounded-md bg-white px-3 py-2 text-sm text-gray-900"
                  >
                    <span>{selectedOption?.label}</span>
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
              <aside className="hidden lg:block w-64 shrink-0 sticky top-24 rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="mb-6 font-semibold flex items-center gap-2 text-[20px]">
                  <SlidersHorizontal className="h-5 w-5"/>
                  Filters
                </h2>
                <div className="space-y-6">
                  <h3 className="mb-4 font-semibold text-lg">Rating</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li>
                      <label htmlFor="rating-5" className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 select-none">
                        <input id="rating-5" type="checkbox" className="peer sr-only opacity-50" />
                        <span className="flex h-4 w-4 items-center justify-center rounded-sm border border-gray-300 bg-[#f3f3f5] transition-colors peer-checked:border-black peer-checked:bg-black peer-focus-visible:ring-2 peer-focus-visible:ring-black/40 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white [&>svg]:opacity-0 [&>svg]:transition-opacity peer-checked:[&>svg]:opacity-100">
                          <Check className="size-3.5 text-white" />
                        </span>
                        <span>5+ Stars</span>
                      </label>
                    </li>
                    <li>
                      <label htmlFor="rating-4" className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 select-none">
                        <input id="rating-4" type="checkbox" className="peer sr-only" />
                        <span className="flex h-4 w-4 items-center justify-center rounded-sm border border-gray-300 bg-[#f3f3f5] transition-colors peer-checked:border-black peer-checked:bg-black peer-focus-visible:ring-2 peer-focus-visible:ring-black/40 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white [&>svg]:opacity-0 [&>svg]:transition-opacity peer-checked:[&>svg]:opacity-100">
                          <Check className="size-3.5 text-white" />
                        </span>
                        <span>4+ Stars</span>
                      </label>
                    </li>
                    <li>
                      <label htmlFor="rating-3" className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 select-none">
                        <input id="rating-3" type="checkbox" className="peer sr-only" />
                        <span className="flex h-4 w-4 items-center justify-center rounded-sm border border-gray-300 bg-[#f3f3f5] transition-colors peer-checked:border-black peer-checked:bg-black peer-focus-visible:ring-2 peer-focus-visible:ring-black/40 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white [&>svg]:opacity-0 [&>svg]:transition-opacity peer-checked:[&>svg]:opacity-100">
                          <Check className="size-3.5 text-white" />
                        </span>
                        <span>3+ Stars</span>
                      </label>
                    </li>
                  </ul>

                  <div>
                    <h3 className="mb-2 font-semibold text-lg">Price Range</h3>
                    <div className="space-y-3">
                      <Range
                        values={priceRange}
                        step={PRICE_STEP}
                        min={PRICE_MIN}
                        max={PRICE_MAX}
                        onChange={(values) => setPriceRange(values)}
                        renderTrack={({ props, children }) => (
                          <div
                            onMouseDown={props.onMouseDown}
                            onTouchStart={props.onTouchStart}
                            className="flex h-9 w-full items-center px-2 mb-2"
                          >
                            <div
                              ref={props.ref}
                              className="h-4 w-full rounded-full"
                              style={{
                                background: getTrackBackground({
                                  values: priceRange,
                                  colors: ["#d1d5db", "#111111", "#d1d5db"],
                                  min: PRICE_MIN,
                                  max: PRICE_MAX
                                })
                              }}
                            >
                              {children}
                            </div>
                          </div>
                        )}
                        renderThumb={({ props, index }) => (
                          <div
                            {...props}
                            className="relative h-4 w-4 rounded-full border border-black bg-white shadow-sm focus:outline-none"
                          >
                          </div>
                        )}
                      />
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Catalog;