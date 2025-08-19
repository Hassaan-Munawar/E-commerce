import { useContext, useState } from "react"
import {
    Calendar,
    Star,
    Package,
    Ruler,
    Truck,
    ShieldCheck,
    RefreshCw,
    Barcode,
    QrCode,
    ShoppingCart,
    Tag,
    Eye,
    Loader2,
    RefreshCcw,
} from "lucide-react"
import { ThemeContext } from "../../../context/ThemeContext"
import { ProductsContext } from "../../../context/ProductsContext"
import { Link } from "react-router-dom"
import axios from "axios"
import { UserInfoContext } from "../../../context/UserInfoContext"
import { AppRoutes } from "../../../constant/AppRoutes"
import { toast } from "react-toastify"
import { AuthContext } from "../../../context/AuthContext"
import RelatedProducts from "../RelatedProducts/RelatedProducts"
import CustomerReviews from "../CustomerReviews/CustomerReviews"

export default function ProductDetailPageCard({ product }) {
    const { darkMode } = useContext(ThemeContext)
    const { products, error } = useContext(ProductsContext)
    const [selectedImage, setSelectedImage] = useState(0)
    const [loading, setLoading] = useState(false)
    const { user } = useContext(AuthContext)
    const { userInfo, setUserInfo } = useContext(UserInfoContext)

    const formatDate = (dateString) => {
        if (!dateString) return "N/A"
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

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

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 >= 0.5
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

        return (
            <div className="flex items-center gap-0.5">
                {[...Array(fullStars)].map((_, i) => (
                    <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                {hasHalfStar && <Star className="w-4 h-4 fill-yellow-400/50 text-yellow-400/50" />}
                {[...Array(emptyStars)].map((_, i) => (
                    <Star key={`empty-${i}`} className="w-4 h-4 fill-gray-300 stroke-gray-400" />
                ))}
            </div>
        )
    }

    const addToCart = (productId) => {
        setLoading(true)
        const cart = userInfo?.cart
        cart.push({ productId, quantity: 1 })
        axios.put(AppRoutes.editUser, { id: userInfo?._id, cart })
            .then(() => {
                toast.success("Product added to cart successfully!")
                setUserInfo(prev => ({
                    ...prev,
                    cart: cart
                }));

            })
            .catch((error) => {
                toast.error(error.message)
                console.error(error.message)
            }).finally(() => {
                setLoading(false);
            });
    }

    const checkProductInCart = userInfo?.cart?.some((item) => item.productId === product._id)

    const originalPrice = product.discountPercentage
        ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
        : null



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
        <div className="container mx-auto px-4 py-8">
            <div
                className={`rounded-lg shadow-sm overflow-hidden transition-colors duration-200 ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
                    }`}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                    {/* Product Images */}
                    <div className="space-y-4 flex flex-col items-center">
                        {" "}
                        {/* Added flex and items-center */}
                        <div
                            className={`w-full max-w-sm aspect-square relative overflow-hidden rounded-lg ${
                                // Adjusted max-w-md
                                darkMode ? "bg-gray-700" : "bg-gray-100"
                                }`}
                        >
                            <img
                                src={getValidImageUrl(product.images, selectedImage) || "/placeholder.svg"}
                                alt={product.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = "/placeholder.svg?height=600&width=600"
                                }}
                            />
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="flex space-x-2 overflow-x-auto justify-center">
                                {" "}
                                {/* Added justify-center */}
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
                                            src={getValidImageUrl(product.images, index) || "/placeholder.svg"}
                                            alt={`${product.title} ${index + 1}`}
                                            className="object-cover w-full h-full"
                                            onError={(e) => {
                                                e.target.src = "/placeholder.svg?height=80&width=80"
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
                                    {product.category || "Uncategorized"}
                                </span>
                                {product.tags && product.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {product.tags.map((tag, i) => (
                                            <span
                                                key={i}
                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <h1 className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                                {product.title}
                            </h1>
                            <div className="flex items-center gap-2 mb-4">
                                {renderStars(product.rating)}
                                <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                    ({product.rating?.toFixed(2)} / 5)
                                </span>
                            </div>
                            <div className={`text-4xl font-bold mb-2 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                                ${product.price?.toFixed(2)}
                                {originalPrice && (
                                    <span
                                        className={`ml-3 text-xl font-normal line-through ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                                    >
                                        ${originalPrice}
                                    </span>
                                )}
                                {product.discountPercentage && (
                                    <span className={`ml-2 text-base font-normal ${darkMode ? "text-green-400" : "text-green-600"}`}>
                                        ({product.discountPercentage?.toFixed(2)}% off)
                                    </span>
                                )}
                            </div>
                            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                {product.availabilityStatus} ({product.stock} in stock)
                            </p>
                        </div>
                        <div>
                            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>Description</h3>
                            <p className={`leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{product.description}</p>
                        </div>

                        <div className={`border-t my-6 ${darkMode ? "border-gray-700" : "border-gray-200"}`} />

                        <div className={`space-y-3 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Product Details</h3>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                                {product.brand && (
                                    <div className="flex items-center">
                                        <dt className="font-medium w-24">Brand:</dt>
                                        <dd>{product.brand}</dd>
                                    </div>
                                )}
                                {product.sku && (
                                    <div className="flex items-center">
                                        <dt className="font-medium w-24">SKU:</dt>
                                        <dd>{product.sku}</dd>
                                    </div>
                                )}
                                {product.weight && (
                                    <div className="flex items-center">
                                        <dt className="font-medium w-24">Weight:</dt>
                                        <dd>
                                            <Package className="w-4 h-4 inline-block mr-1" />
                                            {product.weight} kg
                                        </dd>
                                    </div>
                                )}
                                {product.dimensions && (
                                    <div className="flex items-center">
                                        <dt className="font-medium w-24">Dimensions:</dt>
                                        <dd>
                                            <Ruler className="w-4 h-4 inline-block mr-1" />
                                            {product.dimensions.width}x{product.dimensions.height}x{product.dimensions.depth} cm
                                        </dd>
                                    </div>
                                )}
                                {product.warrantyInformation && (
                                    <div className="flex items-center">
                                        <dt className="font-medium w-24">Warranty:</dt>
                                        <dd>
                                            <ShieldCheck className="w-4 h-4 inline-block mr-1" />
                                            {product.warrantyInformation}
                                        </dd>
                                    </div>
                                )}
                                {product.shippingInformation && (
                                    <div className="flex items-center">
                                        <dt className="font-medium w-24">Shipping:</dt>
                                        <dd>
                                            <Truck className="w-4 h-4 inline-block mr-1" />
                                            {product.shippingInformation}
                                        </dd>
                                    </div>
                                )}
                                {product.returnPolicy && (
                                    <div className="flex items-center">
                                        <dt className="font-medium w-24">Return Policy:</dt>
                                        <dd>
                                            <RefreshCw className="w-4 h-4 inline-block mr-1" />
                                            {product.returnPolicy}
                                        </dd>
                                    </div>
                                )}
                                {product.minimumOrderQuantity && (
                                    <div className="flex items-center">
                                        <dt className="font-medium w-24">Min. Order:</dt>
                                        <dd>{product.minimumOrderQuantity}</dd>
                                    </div>
                                )}
                                {product.meta?.barcode && (
                                    <div className="flex items-center">
                                        <dt className="font-medium w-24">Barcode:</dt>
                                        <dd>
                                            <Barcode className="w-4 h-4 inline-block mr-1" />
                                            {product.meta.barcode}
                                        </dd>
                                    </div>
                                )}
                                {product.meta?.qrCode && (
                                    <div className="flex items-center">
                                        <dt className="font-medium w-24">QR Code:</dt>
                                        <dd>
                                            <a
                                                href={product.meta.qrCode}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:underline flex items-center"
                                            >
                                                <QrCode className="w-4 h-4 inline-block mr-1" />
                                                View QR Code
                                            </a>
                                        </dd>
                                    </div>
                                )}
                                {product.meta?.createdAt && (
                                    <div className="flex items-center">
                                        <dt className="font-medium w-24">Created:</dt>
                                        <dd>
                                            <Calendar className="w-4 h-4 inline-block mr-1" />
                                            {formatDate(product.meta.createdAt)}
                                        </dd>
                                    </div>
                                )}
                                {product.meta?.updatedAt && product.meta.updatedAt !== product.meta.createdAt && (
                                    <div className="flex items-center">
                                        <dt className="font-medium w-24">Last updated:</dt>
                                        <dd>
                                            <Calendar className="w-4 h-4 inline-block mr-1" />
                                            {formatDate(product.meta.updatedAt)}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        <div className={`pt-6 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                            {
                                checkProductInCart ? <Link to={"/cart"}
                                    className={`w-full cursor-pointer py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center ${darkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
                                        }`}
                                >
                                    {
                                        loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>
                                            <Eye className="w-5 h-5 mr-2" />
                                            View in Cart
                                        </>
                                    }

                                </Link> : <button
                                    onClick={() => {
                                        if (user) {
                                            addToCart(product._id)
                                        }
                                        else {
                                            toast.error("Please log in to add products")
                                        }
                                    }}
                                    className={`w-full cursor-pointer py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center ${darkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
                                        }`}
                                >
                                    {
                                        loading ? <Loader2 className="w-5 h-5 animate-spin" /> :
                                            <><ShoppingCart className="w-5 h-5 mr-2" />
                                                Add to Cart</>
                                    }
                                </button>
                            }

                        </div>
                    </div>
                </div>
            </div>

            {/* Customer Reviews */}
            <CustomerReviews product={product} />

            {/* Related Products */}
            <RelatedProducts product={product} />

        </div>
    )
}

