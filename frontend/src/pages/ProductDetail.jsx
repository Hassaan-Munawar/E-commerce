import { useState, useEffect, useContext } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { ThemeContext } from "../context/ThemeContext"
import { ProductsContext } from "../context/ProductsContext"
import ProductDetailPageHeader from "../components/ProductDetailPageHeader/ProductDetailPageHeader"
import ProductDetailPageCard from "../components/ProductDetailPageCard/ProductDetailPageCard"
import Loading from "../components/Loading/Loading"

function ProductDetail() {
  const { id } = useParams()
  const { products } = useContext(ProductsContext)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const { darkMode } = useContext(ThemeContext)
  
  

  // Fixed: Move product finding logic to useEffect
  useEffect(() => {
    if (products && products.length > 0 && id) {
      setLoading(true)
      const getProduct = products.find((item) => item._id == id)
      setProduct(getProduct)
      setLoading(false)      
    }
  }, [products, id])

  

  if (loading) {
    return (
      <Loading />
    )
  }

  if (!product) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  darkMode ? "bg-red-900/20" : "bg-red-100"
                }`}
              >
                <span className={`text-2xl ${darkMode ? "text-red-400" : "text-red-600"}`}>⚠</span>
              </div>
              <h2 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                Product Not Found
              </h2>
              <Link
                to="/products"
                className={`inline-flex items-center transition-colors ${
                  darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
                }`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <ProductDetailPageHeader id={id} />
     
      {/* Product Detail */}
      <ProductDetailPageCard product={product} />
      
       
    </div>
  )
}

export default ProductDetail

