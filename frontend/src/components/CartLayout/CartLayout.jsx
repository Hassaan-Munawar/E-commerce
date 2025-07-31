import { useContext, useRef, useState, useEffect } from "react"
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft } from "lucide-react"
import { ThemeContext } from "../../context/ThemeContext"
import { AuthContext } from "../../context/AuthContext"
import { UserInfoContext } from "../../context/UserInfoContext"
import { Link } from "react-router";
import { Sun, Moon, LogOut } from "lucide-react"
import supabase from "../../utils/supabase"
import { toast } from "react-toastify"

export default function CartLayout() {
  const { darkMode, setDarkMode } = useContext(ThemeContext)
  const { user } = useContext(AuthContext)
  const { userInfo, setUserInfo } = useContext(UserInfoContext)
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      name: "Premium Wireless Headphones",
      price: 199.99,
      quantity: 1,
      image: "https://www.westpoint.pk/cdn/shop/files/WP205_14b1b734-e67c-458d-8067-fcd025ade1b5_1024x1024.jpg?v=1743769031",
      color: "Black",
    },
    {
      id: "2",
      name: "Organic Cotton T-Shirt",
      price: 29.99,
      quantity: 2,
      image: "https://afraz.pk/cdn/shop/files/Tealcolorroundnecktshirtformen_BuyonlineinPakistan_AFRAZ_Frontview_46753622360376.jpg?v=1721759197",
      size: "M",
      color: "Navy Blue",
    },
    {
      id: "3",
      name: "Leather Crossbody Bag",
      price: 89.99,
      quantity: 1,
      image: "https://www.borsa.pk/cdn/shop/files/IMG_0911.jpg?v=1718274711&width=1080",
      color: "Brown",
    },
  ])

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(id)
      return
    }
    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev)
  }

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    setUserInfo(null)
    if (!error) {
      toast.success("Logged out successfully!")
      setDropdownOpen(false)
    } else {
      toast.error("Failed to log out.")
    }
  }

  // Function to get initials for AvatarFallback
  const getInitials = (name, email) => {
    const display = name || email
    if (!display) return "UN" // Unknown User
    const parts = display.split(" ")
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }


  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingCart className="mx-auto h-24 w-24 text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some items to get started!</p>
            <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
  <div
    className={`shadow-sm transition-colors duration-200 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}
  >
    <div className="container flex justify-between mx-auto px-4 py-6">
      <div className="flex items-center gap-3">
        <Link
          to="/products"
          className={`inline-flex items-center transition-colors ${darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Continue Shopping
        </Link>
        <div className={`h-6 w-px ${darkMode ? "bg-gray-600" : "bg-gray-300"}`} />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-lg cursor-pointer transition-colors ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-yellow-400" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

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
                <span className="text-lg font-semibold text-gray-700">
                  {getInitials(user.user_metadata?.full_name, user.email)}
                </span>
              )}
            </div>

            {dropdownOpen && (
              <div className="bg-white text-gray-700 absolute right-0 w-56 mt-2 rounded-md shadow-lg z-10">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm">
                    <p className="font-medium leading-none">{user.user_metadata?.full_name || "User"}</p>
                    <p className={`text-xs mt-1 leading-none ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{user.email}</p>
                  </div>
                  <div className="border-t my-1 border-gray-100"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 cursor-pointer text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100 hover:text-red-900"
                    
                  >
                    <LogOut className="w-4 h-4" /> Log out
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
  <div className="mx-auto p-4 sm:p-6 lg:p-8">
    <div className="mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold">
        Shopping Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
      </h1>
    </div>

    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-8">
        <div className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-lg shadow-sm border`}>
          {cartItems.map((item, index) => (
            <div key={item.id}>
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <div className="mb-2 sm:mb-0">
                        <h3 className={`text-lg font-medium mb-1 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>{item.name}</h3>
                        <div className="flex flex-wrap gap-2 text-sm">
                          {item.size && <span className={darkMode ? "text-gray-400" : "text-gray-600"}>Size: {item.size}</span>}
                          {item.color && <span className={darkMode ? "text-gray-400" : "text-gray-600"}>Color: {item.color}</span>}
                        </div>
                      </div>
                      <div className="text-lg font-semibold">${item.price.toFixed(2)}</div>
                    </div>

                    {/* Quantity + Remove */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border-2 border-gray-300 rounded-lg">
                        <button
                          className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 hover:text-black cursor-pointer"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center border-l border-r border-gray-300">
                          {item.quantity}
                        </span>
                        <button
                          className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 hover:text-black cursor-pointer"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        className="inline-flex items-center px-3 py-1 text-sm cursor-pointer dark:text-red-400 text-red-700 dark:hover:text-red-300 bg-red-50 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {index < cartItems.length - 1 && <hr className="border-gray-200 dark:border-gray-700" />}
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-4 mt-8 lg:mt-0">
        <div className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-lg shadow-sm border sticky top-8`}>
          <div className="p-6">
            <h2 className={`text-lg font-semibold mb-4 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className={darkMode ? "text-gray-400" : "text-gray-600"}>Subtotal ({totalItems} items)</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className={darkMode ? "text-gray-400" : "text-gray-600"}>Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span className={darkMode ? "text-gray-400" : "text-gray-600"}>Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>

              {shipping === 0 && (
                <div className="text-xs text-green-600 bg-green-50 dark:bg-green-900 p-2 rounded border border-green-200 dark:border-green-700">
                  🎉 You qualify for free shipping!
                </div>
              )}

              {subtotal < 100 && shipping > 0 && (
                <div className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-900 p-2 rounded border border-blue-200 dark:border-blue-700">
                  Add ${(100 - subtotal).toFixed(2)} more for free shipping
                </div>
              )}
            </div>

            <hr className="border-gray-200 dark:border-gray-700 my-4" />

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button className="w-full cursor-pointer mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
              Proceed to Checkout
            </button>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Secure checkout with SSL encryption</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  )
}

