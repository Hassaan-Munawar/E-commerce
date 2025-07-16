import { Link } from "react-router"
import { ShoppingBag, ArrowRight } from "lucide-react"

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Welcome to Our Store</h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover amazing products from our curated collection. Browse through hundreds of items and find exactly
            what you're looking for.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Browse Products
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home;