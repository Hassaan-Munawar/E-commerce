import { useContext, useState, useEffect, useRef } from "react"
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, Sun, Moon, LogOut } from "lucide-react"
import { ThemeContext } from "../../context/ThemeContext"
import { AuthContext } from "../../context/AuthContext"
import { UserInfoContext } from "../../context/UserInfoContext"
import { ProductsContext } from "../../context/ProductsContext"
import { Link } from "react-router-dom"
import Loading from "../Loading/Loading"
import supabase from "../../utils/supabase"
import { toast } from "react-toastify"
import { AppRoutes } from "../../constant/AppRoutes"
import axios from "axios"


export default function CartLayout() {
  const { darkMode, setDarkMode } = useContext(ThemeContext)
  const { user } = useContext(AuthContext)
  const { products, loadingProducts } = useContext(ProductsContext)
  const { userInfo, setUserInfo } = useContext(UserInfoContext)
  const [cartItems, setCartItems] = useState([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [loadingCart, setLoadingCart] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    setLoadingCart(true)
    if (!products || !userInfo?.cart?.length) {
      setCartItems([])
      setLoadingCart(false)
      return
    }

    const cartProductsWithQuantity = userInfo?.cart?.map((cartItem) => {
      const product = products.find((p) => p._id === cartItem.productId)
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
      });
    setLoadingCart(false);
  };

  const removeItem = (productId) => {
    setLoadingCart(true);
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
      });
    setLoadingCart(false);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0)
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

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev)
    setDropdownOpen(false)
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUserInfo(null)
      toast.success("Logged out successfully!")
      setDropdownOpen(false)
    } else {
      toast.error("Failed to log out.")
    }
  }

  const getInitials = (name, email) => {
    const display = name || email
    if (!display) return "UN"
    const parts = display.split(" ")
    return parts.length === 1 ? parts[0][0].toUpperCase() : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  if (loadingCart || loadingProducts) {
    return <Loading />
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      {/* Header */}

      <div
        className={`sticky top-0 z-50 shadow-sm transition-colors ${darkMode ? "bg-gray-800 border-b border-gray-700" : "bg-white border-b border-gray-200"}`}
      >
        <div className="container flex justify-between mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Link
              to="/products"
              className={`inline-flex items-center transition-colors ${darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
                }`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
            <div className={`h-6 w-px ${darkMode ? "bg-gray-600" : "bg-gray-300"}`} />
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <div
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center cursor-pointer"
                >
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url || "/placeholder.svg"}
                      alt={user.user_metadata?.full_name || user.email || "User avatar"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {getInitials(user.user_metadata?.full_name, user.email)}
                    </span>
                  )}
                </div>

                {dropdownOpen && (
                  <div className="absolute right-0 w-56 mt-2 rounded-md shadow-lg bg-white z-10">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700">
                        <p className="font-medium leading-none">{user.user_metadata?.full_name || "User"}</p>
                        <p className="text-xs mt-1 leading-none text-gray-500">{user.email}</p>
                      </div>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={toggleDarkMode}
                        className=" w-full flex text-gray-700 items-center gap-3 cursor-pointer text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        {darkMode ? (
                          <span className="flex items-center gap-2">
                            <Sun className="w-5 h-5" />
                            Light Mode
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Moon className="w-5 h-5" />
                            Dark Mode
                          </span>
                        )}
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className=" w-full flex items-center gap-3 cursor-pointer text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100 hover:text-red-900"
                      >
                        <LogOut className="w-4 h-4" />  Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth">
                <button className="inline-flex cursor-pointer items-center px-4 py-2 font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl bg-blue-600 text-white hover:bg-blue-700">
                  Log in
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}

      {
        !loadingProducts && !loadingCart && userInfo?.cart?.length === 0 ? (
          <div className="max-w-4xl flex flex-col justify-center items-center mx-auto px-4">
            <div className="text-center py-16">
              <ShoppingCart className={`mx-auto h-24 w-24 mb-4 ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
              <h2 className={`text-2xl font-semibold mb-2 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                Your cart is empty
              </h2>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>Add some items to get started!</p>
            </div>
          </div>) : (
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
                                    <span className="text-green-600 dark:text-green-400">{item.availabilityStatus}</span>
                                  )}
                                </div>
                                {item.discountPercentage > 0 && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <span
                                      className={`text-sm line-through ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                                    >
                                      ${item.price.toFixed(2)}
                                    </span>
                                    <span className="text-sm bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded">
                                      {item.discountPercentage.toFixed(0)}% OFF
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="text-lg font-semibold">${item.finalPrice.toFixed(2)}</div>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                                <button
                                  className={`h-8 w-8 flex cursor-pointer items-center justify-center transition-colors ${darkMode ? "hover:bg-gray-700 hover:text-white" : "hover:bg-gray-200 hover:text-black"
                                    }`}
                                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="px-3 py-1 text-sm font-medium text-center border-l border-r border-gray-300 dark:border-gray-600">
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
              <div className="lg:col-span-4 mt-8 lg:mt-0">
                <div
                  className={`rounded-lg shadow-sm border sticky top-30 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                    }`}
                >
                  <div className="p-6">
                    <h2 className={`text-lg font-semibold mb-4 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                      Order Summary
                    </h2>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className={darkMode ? "text-gray-400" : "text-gray-600"}>Subtotal ({totalItems} items)</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                      </div>

                      {totalSavings > 0 && (
                        <div className="flex justify-between text-green-600 dark:text-green-400">
                          <span>Discount savings</span>
                          <span className="font-medium">-${totalSavings.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span className={darkMode ? "text-gray-400" : "text-gray-600"}>Shipping</span>
                        <span className="font-medium">
                          {shipping === 0 ? (
                            <span className="text-green-600 dark:text-green-400">Free</span>
                          ) : (
                            `$${shipping.toFixed(2)}`
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className={darkMode ? "text-gray-400" : "text-gray-600"}>Tax</span>
                        <span className="font-medium">${tax.toFixed(2)}</span>
                      </div>

                      {shipping === 0 && (
                        <div className="text-xs p-2 rounded border bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 border-green-300 dark:border-green-700">
                          🎉 You qualify for free shipping!
                        </div>
                      )}

                      {subtotal < 100 && shipping > 0 && (
                        <div className="text-xs p-2 rounded border bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 border-blue-300 dark:border-blue-700">
                          Add ${(100 - subtotal).toFixed(2)} more for free shipping
                        </div>
                      )}
                    </div>

                    <hr className={`${darkMode ? "border-gray-700" : "border-gray-200"} my-4`} />

                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>

                    <button className="w-full mt-6 cursor-pointer px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      Proceed to Checkout
                    </button>

                    <div className="mt-4 text-center">
                      <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Secure checkout with SSL encryption
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </div >
  )
}