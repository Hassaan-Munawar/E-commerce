import { ShoppingBag, ArrowRight } from "lucide-react"
import { useEffect, useRef, useState, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext"
import { AuthContext } from "../../context/AuthContext"
import supabase from "../../utils/supabase"
import { toast } from "react-toastify"
import { Link } from "react-router"

export default function HomeLayout() {
    const { darkMode } = useContext(ThemeContext)
    const { user } = useContext(AuthContext)
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
        if (!error) {
            toast.success("Logged out successfully!")
            setDropdownOpen(false)
        } else {
            toast.error("Failed to log out.")
        }
    }

    const bgColor = darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-indigo-100"
    const textColor = darkMode ? "text-white" : "text-gray-900"
    const descColor = darkMode ? "text-gray-300" : "text-gray-600"

    // Function to get initials for AvatarFallback
    const getInitials = (name, email) => {
        const display = name || email
        if (!display) return "UN" // Unknown User
        const parts = display.split(" ")
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${bgColor} ${textColor}`}>
            <div className="flex justify-end p-4">
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
                            <div className="absolute right-0 w-56 mt-2 rounded-md shadow-lg bg-white z-10">
                                <div className="py-1">
                                    <div className="px-4 py-2 text-sm text-gray-700">
                                        <p className="font-medium leading-none">{user.user_metadata?.full_name || "User"}</p>
                                        <p className="text-xs mt-1 leading-none text-gray-500">{user.email}</p>
                                    </div>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100 hover:text-red-900"
                                    >
                                        Log out
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
            <div className="container mx-auto px-4 py-20">
                <div className="text-center">
                    {/* Shopping Bag Icon */}
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                        <ShoppingBag className="w-10 h-10 text-white" />
                    </div>
                    {/* Heading */}
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Our Store</h1>
                    {/* Description */}
                    <p className={`text-xl mb-8 max-w-2xl mx-auto ${descColor}`}>
                        Discover amazing products from our curated collection. Browse through hundreds of items and find exactly
                        what you're looking for.
                    </p>
                    {/* Call to Action Button */}
                    {user ? (
                        <Link
                            to="/products"
                            className="inline-flex items-center px-8 py-4 font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Browse Products
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    ) : (
                        <button
                            onClick={() => toast.error("Please log in to browse products.")}
                            className="inline-flex items-center px-8 py-4 font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Browse Products
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}