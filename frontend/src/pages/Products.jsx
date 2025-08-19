import { useContext } from "react"
import { ThemeContext } from "../context/ThemeContext"
import { ProductsContext } from "../context/ProductsContext"
import ProductCard from "../components/Product/ProductCard/ProductCard"
import ProductsPageHeader from "../components/Product/ProductsPageHeader/ProductsPageHeader"
import Loading from "../components/Loading/Loading"
import { RefreshCcw } from "lucide-react"

function Products() {
  const { products, error, loadingProducts } = useContext(ProductsContext)
  const { darkMode } = useContext(ThemeContext)


  if (loadingProducts && products.length === 0) {
    return (
      <Loading />
    )
  }

  if (error && products.length === 0) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${darkMode ? "bg-red-900/20" : "bg-red-100"}`}
              >
                <span className={`text-2xl ${darkMode ? "text-red-400" : "text-red-600"}`}>⚠</span>
              </div>
              <h2 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                Error Loading Products
              </h2>
              <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{error}</p>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Please try refreshing the page or check back later.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => window.location.reload()}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${darkMode ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-100 text-blue-600 hover:bg-blue-200"}`}
                >
                  Refresh Page <RefreshCcw className="inline-block ml-1 w-4 h-4" />
                </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>

      {/* Header */}
      <ProductsPageHeader />

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            return <ProductCard key={product._id} product={product} />
          }
          )}
        </div>
      </div>
    </div>

  )
}

export default Products
