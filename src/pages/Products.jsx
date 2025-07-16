import { useContext } from "react"
import { ThemeContext } from "../context/ThemeContext"
import { ProductsContext } from "../context/ProductsContext"
import ProductCard from "../components/ProductCard/ProductCard"
import ProductsPageHeader from "../components/ProductsPageHeader/ProductsPageHeader"
import Loading from "../components/Loading/Loading"

function Products() {
  const { products, error, loading } = useContext(ProductsContext)
  const { darkMode } = useContext(ThemeContext)


  if (loading && products.length === 0) {
    return (
      <Loading text={"Loading products..."} />
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
          {products.map((product, index) => {
            return <ProductCard key={`${product.id}-${index}`} product={product} />
          }
          )}
        </div>
      </div>
    </div>

  )
}

export default Products
