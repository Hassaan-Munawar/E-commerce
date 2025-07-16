import { Link } from "react-router";
import { ShoppingBag, ArrowRight, Sun, Moon } from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

function HomeLayout() {
    const { darkMode, setDarkMode } = useContext(ThemeContext);
    const toggleDarkMode = () => setDarkMode(prev => !prev);

    const bgColor = darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-indigo-100";
    const textColor = darkMode ? "text-white" : "text-gray-900";
    const descColor = darkMode ? "text-gray-300" : "text-gray-600";
    const iconBg = darkMode ? "bg-white" : "bg-blue-600";
    const iconColor = darkMode ? "text-gray-900" : "text-white";
    const btnBg = darkMode ? "bg-white text-black hover:bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700";
    const toggleBtnBg = darkMode ? "bg-gray-800 text-yellow-300 hover:bg-gray-700" : "bg-white text-gray-800 hover:bg-gray-200";

    return (
        <div className={`min-h-screen transition-colors duration-300 ${bgColor} ${textColor}`}>
            {/* Theme toggle button */}
            <button
                onClick={toggleDarkMode}
                className={`absolute top-4 right-4 p-2 rounded-full shadow-md transition-colors duration-300 ${toggleBtnBg}`}
                aria-label="Toggle theme"
            >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="container mx-auto px-4 py-20">
                <div className="text-center">
                    {/* Shopping Bag Icon */}
                    <div className={`w-20 h-20 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg`}>
                        <ShoppingBag className={`w-10 h-10 ${iconColor}`} />
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Welcome to Our Store
                    </h1>

                    {/* Description */}
                    <p className={`text-xl mb-8 max-w-2xl mx-auto ${descColor}`}>
                        Discover amazing products from our curated collection. Browse through hundreds of items and find exactly
                        what you're looking for.
                    </p>

                    {/* Call to Action Button */}
                    <Link
                        to="/products"
                        className={`inline-flex items-center px-8 py-4 font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl ${btnBg}`}
                    >
                        Browse Products
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default HomeLayout;

