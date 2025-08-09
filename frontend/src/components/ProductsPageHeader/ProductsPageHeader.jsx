import { ArrowLeft, Sun, Moon, ShoppingCart, LogOut } from "lucide-react"
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import supabase from "../../utils/supabase";
import { UserInfoContext } from "../../context/UserInfoContext";


export default function ProductsPageHeader() {
    const { darkMode, setDarkMode } = useContext(ThemeContext);
    const { user } = useContext(AuthContext)
    const { userInfo, setUserInfo } = useContext(UserInfoContext);

    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev)
        setDropdownOpen(false)
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
        if (!error) {
            setUserInfo(null)
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


    return (
        <div
            className={`sticky top-0 z-50 shadow-sm transition-colors duration-200 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}
        >
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/"
                            className={`inline-flex items-center transition-colors ${darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Home
                        </Link>
                        <div className={`h-6 w-px ${darkMode ? "bg-gray-600" : "bg-gray-300"}`} />
                    </div>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <Link
                                    className={`relative p-2 rounded-lg cursor-pointer transition-colors ${darkMode
                                        ? "bg-gray-700 hover:bg-gray-600 text-yellow-400"
                                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                        }`}
                                    to="/cart"
                                >
                                    <ShoppingCart className="w-5 h-5" />

                                    {userInfo?.cart?.length > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                            {userInfo?.cart?.length}
                                        </span>
                                    )}
                                </Link>

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
                            </>
                        ) : (
                            <Link to="/auth">
                                <button
                                    className="inline-flex cursor-pointer items-center px-4 py-2 font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl bg-blue-600 text-white hover:bg-blue-700">
                                    Log in
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

