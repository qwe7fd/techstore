import { Star } from "lucide-react";

const ProductCard = ({ name, image, category, price, rating }) => {
  return (
    <a
      className="group block rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-shadow"
      href="#"
    >
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img 
          src={image} 
          alt={name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4">
        <h3 className="mb-2 font-medium text-lg line-clamp-2">{name}</h3>
      
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <Star className="h-4 w-4"></Star>
            </div>
            <span className="text-sm text-gray-600">({rating})</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-blue-600 text-lg font-bold">${price}</span>
          <span className="text-gray-500 text-xs uppercase">{category}</span>
        </div>
      </div>
    </a>
  )
}

export default ProductCard;