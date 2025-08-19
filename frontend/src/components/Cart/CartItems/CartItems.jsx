import { useContext, useState, useEffect } from "react"
import { AppRoutes } from "../../../constant/AppRoutes"
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react"
import { UserInfoContext } from "../../../context/UserInfoContext"
import { ThemeContext } from "../../../context/ThemeContext"
import { ProductsContext } from "../../../context/ProductsContext"
import Loading from "../../Loading/Loading"
import axios from "axios"
import { toast } from "react-toastify"
import CartOrderSummary from "../CartOrderSummary/CartOrderSummary"

function CartItems() {
    const { darkMode } = useContext(ThemeContext)
    const { products } = useContext(ProductsContext)
    const { userInfo, setUserInfo } = useContext(UserInfoContext)
    const [cartItems, setCartItems] = useState([])
    const [loadingCart, setLoadingCart] = useState(false)

    useEffect(() => {
        setLoadingCart(true)
        if (!products || !userInfo?.cart?.length) {
            setCartItems([])
            setLoadingCart(false)
            return
        }

        const cartProductsWithQuantity = userInfo?.cart?.map((cartItem) => {
            const product = products?.find((p) => p._id === cartItem.productId)
            if (product) {
                return {
                    ...product,
                    quantity: cartItem.quantity,
                    finalPrice: product.discountPercentage
                        ? product.price * (1 - product.discountPercentage / 100)
                        : product.price,
                }
            }
            return null
        })
            .filter(Boolean)

        setCartItems(cartProductsWithQuantity)
        setLoadingCart(false)

    }, [products, userInfo])


    const updateQuantity = (productId, newQuantity) => {
        setLoadingCart(true)
        if (newQuantity === 0) return removeItem(productId);

        const updatedCart = userInfo?.cart?.map(item =>
            item.productId === productId ? { ...item, quantity: newQuantity } : item
        );

        axios.put(AppRoutes.editUser, { id: userInfo?._id, cart: updatedCart })
            .then(() => {
                setCartItems(items =>
                    items.map(item =>
                        item._id === productId ? { ...item, quantity: newQuantity } : item
                    )
                );
                setUserInfo(prev => ({
                    ...prev,
                    cart: updatedCart
                }));
            })
            .catch((error) => {
                toast.error(error.message);
                console.error(error.message);
            }).finally(() => {
                setLoadingCart(false)
            })
    };

    const removeItem = (productId) => {
        setLoadingCart(true)
        const updatedCart = userInfo?.cart?.filter(item => item.productId !== productId);

        axios.put(AppRoutes.editUser, { id: userInfo?._id, cart: updatedCart })
            .then(() => {
                setCartItems(items => items.filter(item => item._id !== productId));
                setUserInfo(prev => ({
                    ...prev,
                    cart: updatedCart
                }));
            })
            .catch((error) => {
                toast.error(error.message);
                console.error(error.message);
            }).finally(() => {
                setLoadingCart(false)
            })
    };

    const subtotal =  cartItems.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0)
    const shipping = subtotal > 100 ? 0 : 9.99
    const tax = subtotal * 0.08
    const total = subtotal + shipping + tax
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const totalSavings = cartItems.reduce((sum, item) => {
        if (item.discountPercentage) {
            const originalPrice = item.price * item.quantity
            const discountedPrice = item.finalPrice * item.quantity
            return sum + (originalPrice - discountedPrice)
        }
        return sum
    }, 0)

    if (loadingCart) {
        return <Loading />
    }
    return (
        <>
            {
                !loadingCart && userInfo?.cart?.length === 0 ? (
                    <div className="max-w-4xl flex flex-col justify-center items-center mx-auto px-4">
                        <div className="text-center py-16">
                            <ShoppingCart className={`mx-auto h-24 w-24 mb-4 ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
                            <h2 className={`text-2xl font-semibold mb-2 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                                Your cart is empty
                            </h2>
                            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>Add some items to get started!</p>
                        </div>
                    </div>
                ) : (
                    <div className="mx-auto p-4 sm:p-6 lg:p-8">
                        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-8">
                                <div
                                    className={`rounded-lg shadow-sm border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                                        }`}
                                >
                                    {cartItems.map((item, index) => (
                                        <div key={item._id}>
                                            <div className="p-4 sm:p-6">
                                                <div className={`flex flex-col sm:flex-row gap-4`}>
                                                    <img
                                                        src={item.images?.[0] || "/placeholder.svg?height=96&width=96"}
                                                        alt={item.title}
                                                        className={`w-20 ${darkMode ? "bg-gray-700" : "bg-gray-100"}  h-20 sm:w-24 sm:h-24 object-cover rounded-lg`}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-col sm:flex-row sm:justify-between">
                                                            <div className="mb-2 sm:mb-0">
                                                                <h3 className={`text-lg font-medium mb-1 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                                                                    {item.title}
                                                                </h3>
                                                                <div className="flex flex-wrap gap-2 text-sm">
                                                                    {
                                                                        item.brand ? <span className={darkMode ? "text-gray-400" : "text-gray-600"}>Brand: {item.brand}</span> : null
                                                                    }
                                                                    {item.availabilityStatus && (
                                                                        <span className={`${darkMode ? "text-green-400" : "text-green-600"}`}>{item.availabilityStatus}</span>
                                                                    )}
                                                                </div>
                                                                {item.discountPercentage > 0 && (
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <span
                                                                            className={`text-sm line-through ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                                                                        >
                                                                            ${item.price.toFixed(2)}
                                                                        </span>
                                                                        <span className={`text-sm ${darkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800 "}  px-2 py-1 rounded`}>
                                                                            {item.discountPercentage.toFixed(0)}% OFF
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="text-lg font-semibold">${item.finalPrice.toFixed(2)}</div>
                                                        </div>

                                                        <div className="flex items-center justify-between mt-4">
                                                            <div className={`flex ${darkMode ? "border-gray-600" : "border-gray-300 "} items-center border-2 rounded-lg overflow-hidden`}>
                                                                <button
                                                                    className={`h-8 w-8 flex cursor-pointer items-center justify-center transition-colors ${darkMode ? "hover:bg-gray-700 hover:text-white" : "hover:bg-gray-200 hover:text-black"
                                                                        }`}
                                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                                >
                                                                    <Minus className="h-3 w-3" />
                                                                </button>
                                                                <span className={`px-3 py-1 ${darkMode ? "border-gray-600" : "border-gray-300"} text-sm font-medium text-center border-l border-r `}>
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    className={`h-8 w-8 flex cursor-pointer items-center justify-center transition-colors ${darkMode ? "hover:bg-gray-700 hover:text-white" : "hover:bg-gray-200 hover:text-black"
                                                                        }`}
                                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                                >
                                                                    <Plus className="h-3 w-3" />
                                                                </button>
                                                            </div>

                                                            <button
                                                                className={`inline-flex cursor-pointer items-center px-3 py-1 text-sm rounded-md transition-colors duration-200 ${darkMode
                                                                    ? "bg-gray-700 text-red-400 hover:bg-gray-600 hover:text-red-300"
                                                                    : "bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-900"
                                                                    }`}
                                                                onClick={() => removeItem(item._id)}
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-1" />
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {index < cartItems.length - 1 && (
                                                <hr className={`${darkMode ? "border-gray-700" : "border-gray-200"}`} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}

                            <CartOrderSummary total={total} totalItems={totalItems} totalSavings={totalSavings} subtotal={subtotal} shipping={shipping} tax={tax} />
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default CartItems