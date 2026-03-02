

const Header = () => {
  return (
    <header className="sticky h-16 shadow-sm bg-white w-full">
      <div className="container h-full mx-auto px-4 lg:px-8 flex items-center justify-between">
        <a className="flex items-center gap-2">
          <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center font-bold text-xl text-white">
            T
          </div>
          <span className="hidden sm:inline-block text-xl font-bold">TechStore</span>
        </a>
      </div>
    </header>
  )
}

export default Header