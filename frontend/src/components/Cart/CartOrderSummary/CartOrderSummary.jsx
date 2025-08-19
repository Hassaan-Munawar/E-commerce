import { useContext } from "react"
import { ThemeContext } from "../../../context/ThemeContext"

function CartOrderSummary({ total, totalItems, totalSavings, subtotal, tax, shipping }) {
    const {darkMode} = useContext(ThemeContext)
    return (
        <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div
                className={`rounded-lg shadow-sm border sticky top-30 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                    }`}
            >
                <div className="p-6">
                    <h2 className={`text-lg font-semibold mb-4 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                        Order Summary
                    </h2>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className={darkMode ? "text-gray-400" : "text-gray-600"}>Subtotal ({totalItems} items)</span>
                            <span className="font-medium">${subtotal.toFixed(2)}</span>
                        </div>

                        {totalSavings > 0 && (
                            <div className={`flex justify-between ${darkMode ? "text-green-400" : "text-green-600"}`}>
                                <span>Discount savings</span>
                                <span className="font-medium">-${totalSavings.toFixed(2)}</span>
                            </div>
                        )}

                        <div className="flex justify-between">
                            <span className={darkMode ? "text-gray-400" : "text-gray-600"}>Shipping</span>
                            <span className="font-medium">
                                {shipping === 0 ? (
                                    <span className={`${darkMode ? "text-green-400" : "text-green-600"}`}>Free</span>
                                ) : (
                                    `$${shipping.toFixed(2)}`
                                )}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className={darkMode ? "text-gray-400" : "text-gray-600"}>Tax</span>
                            <span className="font-medium">${tax.toFixed(2)}</span>
                        </div>

                        {shipping === 0 && (
                            <div className={`${darkMode ? "text-green-300 border-green-700 bg-green-900" : "bg-green-50 text-green-600 border-green-300"}text-xs p-2 rounded border`}>
                                🎉 You qualify for free shipping!
                            </div>
                        )}

                        {subtotal < 100 && shipping > 0 && (
                            <div className={`${darkMode ? "bg-blue-800 text-blue-100" : "bg-blue-50 text-blue-600"} p-2 rounded `}>
                                Add ${(100 - subtotal).toFixed(2)} more for free shipping
                            </div>
                        )}
                    </div>

                    <hr className={`${darkMode ? "border-gray-700" : "border-gray-200"} my-4`} />

                    <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>

                    <button className="w-full mt-6 cursor-pointer px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        Proceed to Checkout
                    </button>

                    <div className="mt-4 text-center">
                        <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Secure checkout with SSL encryption
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartOrderSummary