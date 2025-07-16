import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { Loader2 } from "lucide-react";

function Loading({text}) {
    const { darkMode } = useContext(ThemeContext);
  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2
                className={`w-8 h-8 animate-spin mx-auto mb-4 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
              />
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>{text}</p>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Loading