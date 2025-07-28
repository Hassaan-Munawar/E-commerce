import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { Loader2 } from "lucide-react";

function Loading() {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="text-center">
        <Loader2
          className={`w-8 h-8 animate-spin mx-auto mb-4 ${
            darkMode ? "text-blue-400" : "text-blue-600"
          }`}
        />
        <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>Loading..</p>
      </div>
    </div>
  );
}

export default Loading;
