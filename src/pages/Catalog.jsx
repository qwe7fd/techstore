import { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { SlidersHorizontal } from "lucide-react";

const Catalog = () => {
  const [sortBy, setSortBy] = useState("name-asc");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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
                    <svg 
                      className="h-4 w-4 text-gray-500 transition-transform opacity-50"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path d="m6 9 6 6 6-6"></path>                    
                    </svg>
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
                            <svg 
                              className="h-5 w-5 text-gray-600 opacity-50" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
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
                <h2 className="mb-6 text-lg font-semibold">
                  <SlidersHorizontal />
                  Filters
                </h2>
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