import { Link } from "react-router"
import { ThemeContext } from "../../context/ThemeContext"
import { useContext } from "react"
import { ShoppingCart, Tag, Calendar } from "lucide-react"

export default function ProductCard({ product }) {
    const { darkMode } = useContext(ThemeContext)

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const getValidImageUrl = (image) => {
        if (!image) {
            return "https://via.placeholder.com/300x300?text=No+Image"
        }

        let imageUrl = image
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

    return (
        <Link to={`/products/${product._id}`} className="group block h-full">
            <div
                className={`rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border h-full flex flex-col ${darkMode
                    ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                    : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
            >
                {/* Product Image - Fixed height */}
                <div className={`relative aspect-square overflow-hidden ${darkMode ? "bg-gray-700" : "bg-gray-100"}  flex-shrink-0`}>
                    <img
                        src={getValidImageUrl(product.images[0]) || "/placeholder.svg?height=300&width=300"}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/300x300?text=Image+Error"
                        }}
                    />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                        <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${darkMode ? "bg-gray-800/90 text-gray-200" : "bg-white/90 text-gray-700"
                                }`}
                        >
                            <Tag className="w-3 h-3 mr-1" />
                            {product.category || "Uncategorized"}
                        </span>
                    </div>

                    {/* Price Badge */}
                    <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-bold bg-blue-600 text-white">
                            ${product.price}
                        </span>
                    </div>
                </div>

                {/* Product Info - Flexible content area */}
                <div className="p-4 flex flex-col flex-grow">
                    {/* Title - Fixed space */}
                    <h3
                        className={`font-semibold truncate mb-2 line-clamp-2 min-h-[3rem] group-hover:text-blue-500 transition-colors ${darkMode ? "text-white" : "text-gray-900"
                            }`}
                    >
                        {product.title}
                    </h3>

                    {/* Description - Flexible space */}
                    <p className={`text-sm mb-3 line-clamp-3 flex-grow ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {product.description}
                    </p>

                
                    {/* Action Button - Fixed at bottom */}
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
        </Link>
    )
}
