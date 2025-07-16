import { ArrowLeft, Sun, Moon } from "lucide-react"
import { useContext } from "react";
import { Link } from "react-router";
import { ThemeContext } from "../../context/ThemeContext";


export default function ProductsPageHeader() {
    const { darkMode, setDarkMode } = useContext(ThemeContext);
    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev)
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
                        <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Products</h1>
                    </div>
                    <button
                        onClick={toggleDarkMode}
                        className={`p-2 rounded-lg cursor-pointer transition-colors ${darkMode
                            ? "bg-gray-700 hover:bg-gray-600 text-yellow-400"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            }`}
                        aria-label="Toggle theme"
                    >
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    )
}

