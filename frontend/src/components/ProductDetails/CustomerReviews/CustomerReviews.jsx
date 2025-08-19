import { useContext } from "react"
import { ThemeContext } from "../../../context/ThemeContext"
import {
    Star
} from "lucide-react"

function CustomerReviews({product}) {
    const {darkMode} = useContext(ThemeContext)

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 >= 0.5
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

        return (
            <div className="flex items-center gap-0.5">
                {[...Array(fullStars)].map((_, i) => (
                    <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                {hasHalfStar && <Star className="w-4 h-4 fill-yellow-400/50 text-yellow-400/50" />}
                {[...Array(emptyStars)].map((_, i) => (
                    <Star key={`empty-${i}`} className="w-4 h-4 fill-gray-300 stroke-gray-400" />
                ))}
            </div>
        )
    }

     const formatDate = (dateString) => {
        if (!dateString) return "N/A"
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    return (
        <>
            {product.reviews && product.reviews.length > 0 && (
                <div
                    className={`mt-8 rounded-lg shadow-sm p-6 transition-colors duration-200 ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
                        }`}
                >
                    <p className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
                        Customer Reviews
                    </p>
                    <div className="space-y-6">
                        {product.reviews.map((review, index) => (
                            <div key={index}>
                                <div className="flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 text-gray-700 font-semibold text-lg">
                                        {review.reviewerName.charAt(0)}
                                    </div>
                                    <div className="grid gap-2 flex-1">
                                        <div className="flex justify-between items-center">
                                            <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                                                {review.reviewerName}
                                            </h3>
                                            <div className="flex items-center gap-0.5">{renderStars(review.rating)}</div>
                                        </div>
                                        <time className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                            {formatDate(review.date)}
                                        </time>
                                        <p className={`leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                            {review.comment}
                                        </p>
                                    </div>
                                </div>
                                {index < product.reviews.length - 1 && (
                                    <div className={`border-t my-6 ${darkMode ? "border-gray-700" : "border-gray-200"}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

export default CustomerReviews