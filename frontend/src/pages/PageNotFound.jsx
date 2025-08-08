import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

function PageNotFound() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-red-600 text-2xl">⚠</span>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Page Not Found</h2>
                        {/* <p className="text-gray-600 mb-4">{error}</p> */}
                        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Move to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PageNotFound