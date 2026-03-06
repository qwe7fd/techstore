import Header from "../components/Header";
import Footer from "../components/Footer";

const Catalog = () => {
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
                <span class="text-sm text-gray-600">Sort by:</span>
                <label htmlFor="products-sort"></label>
                <select id="products-sort">
                  <option value=""></option>
                </select>
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