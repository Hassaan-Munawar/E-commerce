import { useContext } from "react"
import { Link } from "react-router-dom"
import { ThemeContext } from "../../../context/ThemeContext"
import { ProductsContext } from "../../../context/ProductsContext"

function RelatedProducts({product}) {
    const { darkMode } = useContext(ThemeContext)
    const {products} = useContext(ProductsContext)

    const getValidImageUrl = (images, index = 0) => {
        if (!images || images.length === 0) {
            return "/placeholder.svg?height=600&width=600"
        }
        const imageUrl = images[index] || images[0]
        if (typeof imageUrl === "string" && (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"))) {
            return imageUrl
        }
        return "/placeholder.svg?height=600&width=600"
    }

    // Filter related products
    const relatedProducts = products
        ? products
            .filter(
                (p) =>
                    p._id !== product._id &&
                    (p.category === product.category || p.brand === product.brand)
            )
            .sort(() => Math.random() - 0.5) // Shuffle the array
            .slice(0, 4) // Pick any 4 products
        : [];

    return (
        <>
            {relatedProducts.length > 0 && (
                <div
                    className={`mt-8 rounded-lg shadow-sm p-6 transition-colors duration-200 ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
                        }`}
                >
                    <p className={`text-2xl font-bold mb-8 ${darkMode ? "text-white" : "text-gray-900"}`}>Related Products</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((relatedProduct) => (
                            <Link onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                to={`/products/${relatedProduct._id}`} className="block" key={relatedProduct._id}>
                                <div
                                    className={`rounded-lg overflow-hidden h-full flex flex-col justify-between shadow-sm ${darkMode ? "bg-gray-600" : "bg-gray-100"}`}
                                >
                                    <img
                                        src={getValidImageUrl(relatedProduct.images) || "/placeholder.svg?height=200&width=200"}
                                        alt={relatedProduct.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className={`p-4 ${darkMode ? "bg-gray-700" : "bg-white"}`}>
                                        <h3 className={`font-semibold truncate text-md mb-1  ${darkMode ? "text-white" : "text-gray-900"}`}>
                                            {relatedProduct.title}
                                        </h3>
                                        <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                            ${relatedProduct.price?.toFixed(2)}
                                        </p>
                                        <button
                                            className={`mt-3 w-full py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${darkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
                                                }`}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            )

            }
        </>
    )
}

export default RelatedProducts