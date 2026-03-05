import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import unplugged from "../assets/unplugged.png";
import { getToken } from "../auth/auth";    
const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if search data is available in location state
    if (location.state && location.state.searchData) {
      setSearchData(location.state.searchData);
      setLoading(false);
    } else {
      // If no search data is found, redirect to home
      navigate("/");
    }
  }, [location, navigate]);

  // Function to convert base64 string to data URL
    const convertBase64ToDataURL = (base64String, mimeType = 'image/jpeg') => {
      if (!base64String) return unplugged; // Return fallback image if no data
      
      // If it's already a data URL, return as is
      if (base64String.startsWith('data:')) {
        return base64String;
      }
      
      // If it's already a URL, return as is
      if (base64String.startsWith('http')) {
        return base64String;
      }
      
      // Convert base64 string to data URL
      return `data:${mimeType};base64,${base64String}`;
    };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (productId) => {
    toast.success(`Product with ID ${productId} added to cart!`);
    // Add your cart logic here
  };
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 mt-20 flex justify-center items-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 mt-20">
  
      <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
  
      {searchData.length === 0 ? (
        <div className="bg-blue-100 text-blue-700 px-4 py-3 rounded flex items-center">
          <span className="mr-2">ℹ️</span>
          No products found matching your search criteria.
        </div>
      ) : (
        <>
          <p className="text-gray-500 mb-4">
            {searchData.length} product(s) found
          </p>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  
            {searchData.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-md transition h-full flex flex-col">
  
                <img
                  src={convertBase64ToDataURL(product.productImage)}
                  alt={product.name}
                  className="p-4 h-[200px] object-contain cursor-pointer"
                  onClick={() => handleViewProduct(product.id)}
                />
  
                <div className="p-4 flex flex-col flex-grow">
  
                  <h5 className="font-semibold text-lg">{product.name}</h5>
  
                  <p className="text-gray-500 text-sm mb-1">
                    {product.brand}
                  </p>
  
                  <div className="mb-2">
                    <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded">
                      {product.category}
                    </span>
                  </div>
  
                  <p className="text-sm text-gray-600 mb-2">
                    {product.description.length > 100
                      ? product.description.substring(0, 100) + "..."
                      : product.description}
                  </p>
  
                  <h5 className="text-blue-600 font-semibold mt-auto mb-3">
                    Rs.{product.price.toLocaleString("en-US")}/-
                  </h5>
  
                  <div className="flex justify-between mt-auto">
  
                    <button
                      className="border border-blue-600 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-50"
                      onClick={() => handleViewProduct(product.id)}
                    >
                      View Details
                    </button>
  
                    <button
                      className={`px-3 py-1 rounded text-sm text-white ${
                        product.productAvailable && product.stockQuantity > 0
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      onClick={() => handleAddToCart(product.id)}
                      disabled={!product.productAvailable || product.stockQuantity <= 0}
                    >
                      {product.productAvailable && product.stockQuantity > 0
                        ? "Add to Cart"
                        : "Out of Stock"}
                    </button>
  
                  </div>
                </div>
              </div>
            ))}
  
          </div>
        </>
      )}
    </div>
  );
  
};

export default SearchResults;