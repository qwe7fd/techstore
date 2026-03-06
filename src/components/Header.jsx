

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
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </button>
        <a className="h-10 w-10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" id="Shopping-Cart--Streamline-Lucide" height={20} width={20} >
            <path d="M7 21a1 1 0 1 0 2 0 1 1 0 1 0 -2 0" strokeWidth={2} /><path d="M18 21a1 1 0 1 0 2 0 1 1 0 1 0 -2 0" strokeWidth={1.5} /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95 -1.57l1.65 -7.43H5.12" strokeWidth={1.5} />
          </svg>
          {/*TODO: Иконка корзины с индикатором количества товаров (Badge). Счетчик обновляется в реальном времени при добавлении/удалении позиций. */}
        </a>
      </div>
      </div>
    </header>
  )
}

export default Header