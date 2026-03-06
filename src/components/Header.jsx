import { Search } from "lucide-react"
import { ShoppingCart } from "lucide-react"

const Header = () => {
  return (
    <header className="sticky h-16 shadow-sm bg-white w-full">
      <div className="container h-full mx-auto px-4 lg:px-8 flex items-center justify-between">
        <a
          href="/" 
          className="flex items-center gap-2"
        >
          <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-[10px] flex items-center justify-center font-bold text-xl text-white">
            T
          </div>
          <span className="hidden sm:inline-block text-xl font-bold">TechStore</span>
        </a>
        
      <nav className="flex justify-between">
        <ul className="flex items-center gap-8">
          <li><a href="#" className="text-gray-700 hover:text-blue-600">Products</a></li>
          <li><a href="#" className="text-gray-700 hover:text-blue-600">Categories</a></li>
          <li><a href="#" className="text-gray-700 hover:text-blue-600">Deals</a></li>
          <li><a href="#" className="text-gray-700 hover:text-blue-600">About</a></li>
        </ul>
      </nav>

      <div className="flex items-center gap-4">
        <button className="flex h-10 w-10 items-center justify-center">
          <Search className="h-5 w-5"/>
        </button>
        <a className="h-10 w-10 flex items-center justify-center">
          <ShoppingCart className="h-5 w-5"/>
          {/*TODO: Иконка корзины с индикатором количества товаров (Badge). Счетчик обновляется в реальном времени при добавлении/удалении позиций. */}
        </a>
      </div>
      </div>
    </header>
  )
}

export default Header