import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Breadcrumbs = ({ items }) => {
  return (
    <nav aria-label="breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm wrap-break-word sm:gap-2.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="inline-flex items-center gap-1.5">
              {item.href ? (
                <Link 
                  to={item.href}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span 
                  role="link" 
                  aria-disabled="true" 
                  aria-current={isLast ? "page" : undefined}
                  className={isLast ? "text-gray-900 font-normal" : "text-gray-500"}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span role="presentation" aria-hidden="true" className="text-gray-500">
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
