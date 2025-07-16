// import { useEffect, useState } from "react";
// import { Link, useParams } from "react-router";

// function ProductDetail() {
//     const { id } = useParams();
//     const [product, setProduct] = useState({})

//     useEffect(() => {
//         fetch(`https://api.escuelajs.co/api/v1/products/${id}`)
//             .then(response => response.json())
//             .then(data => {                                
//                 setProduct(data);                
//             })
//             .catch(error => {
//                 console.error('Error fetching data:', error);
//             });
//     }, [])


//     return (
//         <>
//         <Link to={"/products"}>Back</Link>
//             <h1> Single Product</h1>
//             <ul>
//                         <li key={product.id}>
//                             <img width="200" src={product.images} alt={product.title} />
//                             <h2>{product.title}</h2>
//                             <p>{product.description}</p>
//                             <p>Price: ${product.price}</p>
//                         </li>
//             </ul>
//         </>
//     )
// }

// export default ProductDetail;



import { useState, useEffect, useContext } from "react"
import { Link, useParams } from "react-router"
import { ArrowLeft, ShoppingCart, Tag, Calendar, Loader2, Sun, Moon } from "lucide-react"
import { ThemeContext } from "../context/ThemeContext"

function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const {darkMode, setDarkMode} = useContext(ThemeContext)
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev)
  }
  

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`)
        if (!response.ok) {
          throw new Error("Product not found")
        }
        const data = await response.json()
        setProduct(data)
      } catch (error) {
        setError(error.message)
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getValidImageUrl = (images, index = 0) => {
    if (!images || images.length === 0) {
      return "https://via.placeholder.com/600x600?text=No+Image"
    }

    let imageUrl = images[index] || images[0]
    if (typeof imageUrl === "string") {
      imageUrl = imageUrl.replace(/[[\]"]/g, "")
    }

    try {
      new URL(imageUrl)
      return imageUrl
    } catch {
      return "https://via.placeholder.com/600x600?text=Invalid+Image"
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2
                className={`w-8 h-8 animate-spin mx-auto mb-4 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
              />
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>Loading product...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
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
              <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{error}</p>
              <Link to="/products"
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
      <div
        className={`shadow-sm transition-colors duration-200 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}
      >
        <div className="container flex justify-between mx-auto px-4 py-6">
          <Link
          to={"/products"}
            className={`inline-flex items-center transition-colors ${
              darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg cursor-pointer transition-colors ${
              darkMode ? "bg-gray-700 hover:bg-gray-600 text-yellow-400" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Product Detail */}
      <div className="container mx-auto px-4 py-8">
        <div
          className={`rounded-lg shadow-sm overflow-hidden transition-colors duration-200 ${
            darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div
                className={`aspect-square relative overflow-hidden rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <img
                  src={getValidImageUrl(product.images, selectedImage) || "/placeholder.svg?height=600&width=600"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/600x600?text=Image+Error"
                  }}
                />
              </div>
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.slice(0, 4).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 hover:cursor-pointer w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index
                          ? darkMode
                            ? "border-blue-400"
                            : "border-blue-600"
                          : darkMode
                            ? "border-gray-600"
                            : "border-gray-200"
                      }`}
                    >
                      <img
                        src={getValidImageUrl(product.images, index) || "/placeholder.svg?height=80&width=80"}
                        alt={`${product.title} ${index + 1}`}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/80x80?text=Error"
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      darkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {product.category?.name || "Uncategorized"}
                  </span>
                </div>
                <h1 className={`text-3xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {product.title}
                </h1>
                <div className={`text-4xl font-bold mb-6 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                  ${product.price}
                </div>
              </div>

              <div>
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Description
                </h3>
                <p className={`leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {product.description}
                </p>
              </div>

              <div className={`space-y-3 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Created: {formatDate(product.creationAt)}</span>
                </div>
                {product.updatedAt !== product.creationAt && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Last updated: {formatDate(product.updatedAt)}</span>
                  </div>
                )}
              </div>

              <div className={`pt-6 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                    darkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section Placeholder */}
        <div
          className={`mt-8 rounded-lg shadow-sm p-6 transition-colors duration-200 ${
            darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
          }`}
        >
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>Related Products</h2>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Related products would be displayed here...
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
