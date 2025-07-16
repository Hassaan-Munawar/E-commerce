import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { Link } from "react-router";
import { ArrowLeft, Sun, Moon } from "lucide-react"

function ProductDetailPageHeader() {
    const { darkMode , setDarkMode} = useContext(ThemeContext);
    const toggleDarkMode = () => {
    setDarkMode((prev) => !prev)
  }
  return (
     <div
        className={`shadow-sm transition-colors duration-200 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}
      >
        <div className="container flex justify-between mx-auto px-4 py-6">
          <Link
            to="/products"
            className={`inline-flex items-center transition-colors ${
              darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg cursor-pointer transition-colors ${
              darkMode ? "bg-gray-700 hover:bg-gray-600 text-yellow-400" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>

  )
}

export default ProductDetailPageHeader