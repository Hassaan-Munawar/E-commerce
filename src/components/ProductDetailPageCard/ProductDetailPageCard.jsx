import { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { ShoppingCart, Tag, Calendar } from "lucide-react"

function ProductDetailPageCard({product}) {
    const { darkMode } = useContext(ThemeContext);
     const [selectedImage, setSelectedImage] = useState(0)

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
    return (
        <div className="container mx-auto px-4 py-8">
        <div
            className={`rounded-lg shadow-sm overflow-hidden transition-colors duration-200 ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
                }`}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                {/* Product Images */}
                <div className="space-y-4">
                    <div
                        className={`aspect-square relative overflow-hidden rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"
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
                                    className={`flex-shrink-0 hover:cursor-pointer w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index
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
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${darkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-800"
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
                            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center ${darkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
                                }`}
                        >
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Related Products Section Placeholder */ }
    <div
        className={`mt-8 rounded-lg shadow-sm p-6 transition-colors duration-200 ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
            }`}
    >
        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>Related Products</h2>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Related products would be displayed here...
        </p>
    </div>
    </div>
  )
}

export default ProductDetailPageCard