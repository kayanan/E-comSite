import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";
const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastProduct, setToastProduct] = useState(null);

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  useEffect(() => {
    console.log(data, 'data from home page');
  }, [data]);

  useEffect(() => {
    let toastTimer;
    if (showToast) {
      toastTimer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
    return () => clearTimeout(toastTimer);
  }, [showToast]);

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

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart(product);
    setToastProduct(product);
    setShowToast(true);
  };

  const filteredProducts = selectedCategory
    ? data.filter((product) => product.category === selectedCategory)
    : data ? data : [];
  if (isError) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="text-center">
          <img src={unplugged} alt="Error" className="img-fluid" width="100" />
          <h4 className="mt-3">Something went wrong</h4>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="fixed top-5 right-5 z-50">
  {showToast && (
    <div className="bg-white shadow-xl rounded-xl w-80 border overflow-hidden animate-slideIn">

      <div className="flex justify-between items-center bg-green-500 text-white px-4 py-2">
        <span className="font-semibold">Added to Cart</span>
        <button
          onClick={() => setShowToast(false)}
          className="text-white text-lg"
        >
          ✕
        </button>
      </div>

      <div className="p-4 flex items-center gap-3">
        <img
          src={convertBase64ToDataURL(toastProduct?.imageData)}
          className="w-12 h-12 rounded-lg object-cover border"
        />
        <div>
          <p className="font-semibold">{toastProduct?.name}</p>
          <p className="text-sm text-gray-500">
            Successfully added to cart
          </p>
        </div>
      </div>
    </div>
  )}
</div>
      <div className="max-w-7xl mx-auto mt-16 px-4">
  <h2 className="text-2xl font-bold mb-6 text-gray-800">
    Products
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

    {!filteredProducts || filteredProducts.length === 0 ? (
      <div className="col-span-full text-center py-16">
        <img src={unplugged} className="mx-auto w-24 opacity-60 mb-4" />
        <h4 className="text-xl font-semibold text-gray-700">
          No Products Available
        </h4>
      </div>
    ) : (
      filteredProducts.map((product) => {
        const {
          id,
          brand,
          name,
          price,
          productAvailable,
          imageData,
          stockQuantity,
        } = product;

        return (
          <div
            key={id}
            className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
          >
            <Link to={`/product/${id}`}>

              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={convertBase64ToDataURL(imageData)}
                  alt={name}
                  className="w-full h-44 object-contain group-hover:scale-105 transition duration-300"
                  onError={(e) => (e.target.src = unplugged)}
                />

                {!productAvailable && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Unavailable
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col h-full">

                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {name}
                </h3>

                <p className="text-sm text-gray-500 mb-2">
                  {brand}
                </p>

                <p className="text-xl font-bold text-blue-600 mb-3">
                  Rs. {price.toLocaleString("en-LK")}
                </p>

                <button
                  onClick={(e) => handleAddToCart(e, product)}
                    disabled={!productAvailable || stockQuantity === 0}
                   className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {stockQuantity !== 0
                    ? "Add to Cart"
                    : "Out of Stock"}
                 
                </button>
                
                </div>

            </Link>
          </div>
        );
      })
    )}
  </div>
</div>
    </>
  );
};

export default Home;