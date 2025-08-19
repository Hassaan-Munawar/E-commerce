import { useContext, useState, useEffect, useRef } from "react"
import { ArrowLeft, Sun, Moon, LogOut } from "lucide-react"
import { ThemeContext } from "../../../context/ThemeContext"
import { AuthContext } from "../../../context/AuthContext"
import { UserInfoContext } from "../../../context/UserInfoContext"
import { ProductsContext } from "../../../context/ProductsContext"
import { Link } from "react-router-dom"
import Loading from "../../Loading/Loading"
import supabase from "../../../utils/supabase"
import { toast } from "react-toastify"
import CartItems from "../CartItems/CartItems"


export default function CartLayout() {
  const { darkMode, setDarkMode } = useContext(ThemeContext)
  const { user } = useContext(AuthContext)
  const { loadingProducts } = useContext(ProductsContext)
  const { setUserInfo } = useContext(UserInfoContext)
  const [dropdownOpen, setDropdownOpen] = useState(false)
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

  if (loadingProducts) {
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
                    <span className="text-lg text-gray-700 font-semibold">
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

      <CartItems />

    </div >
  )
}