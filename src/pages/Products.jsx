// import { useState, useEffect } from 'react';
// import { Link } from 'react-router';


// function Products() {

//     const [products, setProducts] = useState([])

//     useEffect(() => {
//         fetch('https://api.escuelajs.co/api/v1/products')
//             .then(response => response.json())
//             .then(data => {
//                 setProducts(data);
//             })
//             .catch(error => {
//                 console.error('Error fetching data:', error);
//             });
//     }, [])


//     return (
//         <>
//         <Link to={"/"}>Home</Link>
//             <h1>Products</h1>
//             <ul>
//                 {products.map(product => (
//                     <Link  to={`/products/${product.id}`} key={product.id}>
//                         <li key={product.id}>
//                             <img width="200" src={product.images} alt={product.title} />
//                             <h2>{product.title}</h2>
//                             <p>{product.description}</p>
//                             <p>Price: ${product.price}</p>
//                         </li>
//                     </Link>
//                 ))}
//             </ul>
//         </>
//     )
// }

// export default Products;





import { useState, useEffect, useCallback, useContext } from "react"
import { Link } from "react-router"
import { ArrowLeft, ShoppingCart, Tag, Calendar, Loader2, Sun, Moon } from "lucide-react"
import { ThemeContext } from "../context/ThemeContext"

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [totalProducts, setTotalProducts] = useState(0)
  const { darkMode, setDarkMode } = useContext(ThemeContext)
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev)
  }
  

  const PRODUCTS_PER_PAGE = 20

  const fetchProducts = useCallback(async (page = 0, reset = false) => {
    try {
      if (page === 0) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      const offset = page * PRODUCTS_PER_PAGE
      const response = await fetch(
        `https://api.escuelajs.co/api/v1/products?offset=${offset}&limit=${PRODUCTS_PER_PAGE}`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }

      const data = await response.json()

      if (reset || page === 0) {
        setProducts(data)
        setTotalProducts(data.length)
      } else {
        setProducts((prev) => [...prev, ...data])
        setTotalProducts((prev) => prev + data.length)
      }

      // Check if we have more products to load
      setHasMore(data.length === PRODUCTS_PER_PAGE)
      setCurrentPage(page)
    } catch (error) {
      setError(error.message)
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts(0, true)
  }, [fetchProducts])

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000 &&
        hasMore &&
        !loadingMore &&
        !loading
      ) {
        fetchProducts(currentPage + 1)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [currentPage, hasMore, loadingMore, loading, fetchProducts])

  const loadMoreProducts = () => {
    if (hasMore && !loadingMore) {
      fetchProducts(currentPage + 1)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getValidImageUrl = (images) => {
    if (!images || images.length === 0) {
      return "https://via.placeholder.com/300x300?text=No+Image"
    }

    let imageUrl = images[0]
    if (typeof imageUrl === "string") {
      imageUrl = imageUrl.replace(/[[\]"]/g, "")
    }

    try {
      new URL(imageUrl)
      return imageUrl
    } catch {
      return "https://via.placeholder.com/300x300?text=Invalid+Image"
    }
  }

  if (loading && products.length === 0) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2
                className={`w-8 h-8 animate-spin mx-auto mb-4 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
              />
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>Loading products...</p>
            </div>
          </div>
        </div>
      </div>
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
              <button
                onClick={() => fetchProducts(0, true)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  darkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <div
        className={`sticky top-0 z-50 shadow-sm transition-colors duration-200 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className={`inline-flex items-center transition-colors ${darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Link>
              <div className={`h-6 w-px ${darkMode ? "bg-gray-600" : "bg-gray-300"}`} />
              <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Products</h1>
            </div>
            {/* <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Showing {totalProducts} products
              {hasMore && (
                <span className={`ml-1 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>(Loading more...)</span>
              )}
            </div> */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg cursor-pointer transition-colors ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-yellow-400"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
             <Link key={`${product.id}-${index}`} to={`/products/${product.id}`} className="group">    
            <div key={`${product.id}-${index}`} className="group cursor-pointer">
              <div
                className={`rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border flex flex-col h-full ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={getValidImageUrl(product.images) || "/placeholder.svg?height=300&width=300"}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x300?text=Image+Error"
                    }}
                  />
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                        darkMode ? "bg-gray-800/90 text-gray-200" : "bg-white/90 text-gray-700"
                      }`}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {product.category?.name || "Uncategorized"}
                    </span>
                  </div>
                  {/* Price Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-bold bg-blue-600 text-white">
                      ${product.price}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3
                    className={`font-semibold mb-2 line-clamp-2 group-hover:text-blue-500 transition-colors ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {product.title}
                  </h3>
                  <p className={`text-sm mb-3 line-clamp-3 flex-grow ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {product.description}
                  </p>

                  {/* Product Meta */}
                  <div className={`space-y-2 text-xs mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>Created: {formatDate(product.creationAt)}</span>
                    </div>
                    {product.updatedAt !== product.creationAt && (
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>Updated: {formatDate(product.updatedAt)}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className={`pt-3 border-t mt-auto ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                        ${product.price}
                      </span>
                      <button className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMoreProducts}
              disabled={loadingMore}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading More...
                </>
              ) : (
                <>
                  Load More Products
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Loading More Indicator */}
        {loadingMore && (
          <div className="flex justify-center mt-8">
            <div className="text-center">
              <Loader2
                className={`w-6 h-6 animate-spin mx-auto mb-2 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
              />
              <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Loading more products...</p>
            </div>
          </div>
        )}

        {/* End of Results */}
        {!hasMore && products.length > 0 && (
          <div className={`text-center mt-8 py-8 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                darkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <ShoppingCart className={`w-6 h-6 ${darkMode ? "text-gray-400" : "text-gray-400"}`} />
            </div>
            <h3 className={`text-lg font-medium mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
              You've seen all products!
            </h3>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              That's all the products we have for now.
            </p>
          </div>
        )}

        {/* Empty State */}
        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                darkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <ShoppingCart className={`w-8 h-8 ${darkMode ? "text-gray-400" : "text-gray-400"}`} />
            </div>
            <h3 className={`text-lg font-medium mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
              No products found
            </h3>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              There are no products available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products
