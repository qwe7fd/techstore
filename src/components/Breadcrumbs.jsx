import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Breadcrumbs = ({ category, productName }) => {
  return (
    <nav className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm wrap-break-word sm:gap-2.5">
        <li className="inline-flex items-center gap-1.5">
          <Link 
            to="/"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            Products
          </Link>
          <span className="text-gray-500">
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </li>
        
        {category && (
          <li className="inline-flex items-center gap-1.5">
            <span className="text-gray-500">
              {category}
            </span>
            <span className="text-gray-500">
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </li>
        )}
        
        {productName && (
          <li className="inline-flex items-center gap-1.5">
            <span className="text-gray-900 font-normal">
              {productName}
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;