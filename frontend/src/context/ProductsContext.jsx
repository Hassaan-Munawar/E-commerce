import { createContext, useEffect, useState } from 'react';

export const ProductsContext = createContext();

export default function ProductsProvider({ children }) {

    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoadingProducts(true);
                const response = await fetch("https://h-e-commerce-backend.vercel.app/products");
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }
                const data = await response.json();
                setProducts(data.products.sort(() => Math.random() - 0.5));
            } catch (error) {
                setError(error.message);
                console.error("Error fetching data:", error);
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <ProductsContext.Provider value={{ products, loadingProducts, error }}>
            {children}
        </ProductsContext.Provider>
    );
}
