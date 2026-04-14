import { Check, SlidersHorizontal } from "lucide-react";
import { Range, getTrackBackground } from "react-range";

const FiltersSidebar = ({ 
  priceRange, 
  setPriceRange, 
  ratingFilters, 
  setRatingFilters, 
  clearFilters,
  showTitle = true 
}) => {
  const PRICE_MIN = 0;
  const PRICE_MAX = 3000;
  const PRICE_STEP = 50;

  return (
    <div className="space-y-6">
      {showTitle && (
        <h2 className="mb-6 font-semibold flex items-center gap-2 text-[20px]">
          <SlidersHorizontal className="h-5 w-5"/>
          Filters
        </h2>
      )}
      
      <div>
        <h3 className="mb-4 font-semibold text-lg">Rating</h3>
        <ul className="space-y-3">
          {[5, 4, 3].map((rating) => (
            <li key={rating}>
              <label 
                htmlFor={`rating-${rating}`} 
                className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 select-none"
              >
                <input
                  id={`rating-${rating}`}
                  type="checkbox"
                  checked={ratingFilters[rating]}
                  onChange={(event) =>
                    setRatingFilters((prev) => ({ ...prev, [rating]: event.target.checked }))
                  }
                  className="peer sr-only"
                />
                <span className="flex h-4 w-4 items-center justify-center rounded-sm border border-gray-300 bg-[#f3f3f5] transition-colors peer-checked:border-black peer-checked:bg-black peer-focus-visible:ring-2 peer-focus-visible:ring-black/40 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white [&>svg]:opacity-0 [&>svg]:transition-opacity peer-checked:[&>svg]:opacity-100">
                  <Check className="size-3.5 text-white" />
                </span>
                <span>{rating}+ Stars</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

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
                  className="h-4 w-full rounded-none"
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
            renderThumb={({ props }) => {
              const { style, ...rest } = props;
              return (
                <div
                  {...rest}
                  style={{ ...style, cursor: "default" }}
                  className="relative h-4 w-4 cursor-default rounded-full border border-black bg-white shadow-sm focus:outline-none after:absolute after:-inset-1.5 after:rounded-full after:bg-gray-400/30 after:opacity-0 after:transition-opacity hover:after:opacity-100"
                >
                </div>
              );
            }}
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <button 
        onClick={clearFilters}
        className="font-medium w-full rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
        Clear All Filters
      </button>
    </div>
  );
};

export default FiltersSidebar;