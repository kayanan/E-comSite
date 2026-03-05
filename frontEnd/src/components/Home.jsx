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
      {/* Toast Notification */}
      <div className="fixed top-0 right-0 p-3 z-50">
        {showToast && (
          <div className="bg-white shadow-lg rounded-lg w-72 overflow-hidden border">
            
            <div className="flex justify-between items-center bg-green-600 text-white px-3 py-2">
              <strong>Added to Cart</strong>
              <button
                onClick={() => setShowToast(false)}
                className="text-white font-bold"
              >
                ✕
              </button>
            </div>
  
            <div className="p-3">
              {toastProduct && (
                <div className="flex items-center gap-2">
                  <img
                    src={convertBase64ToDataURL(toastProduct.imageData)}
                    alt={toastProduct.name}
                    className="w-10 h-10 rounded object-cover"
                    onError={(e) => {
                      e.target.src = unplugged;
                    }}
                  />
  
                  <div>
                    <div className="font-bold">{toastProduct.name}</div>
                    <small className="text-gray-500">
                      Successfully added to your cart!
                    </small>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
  
      <div className="max-w-7xl mx-auto mt-10 pt-10 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  
          {!filteredProducts || filteredProducts.length === 0 ? (
            <div className="col-span-full text-center my-10">
              <h4 className="text-xl font-semibold">No Products Available</h4>
            </div>
          ) : (
            filteredProducts?.length > 0 &&
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
                <div key={id}>
                  <div
                    className={`h-full rounded-lg shadow-sm overflow-hidden ${
                      !productAvailable ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <Link
                      to={`/product/${id}`}
                      className="block text-gray-900 no-underline"
                    >
                      <img
                        src={convertBase64ToDataURL(imageData)}
                        alt={name}
                        className="w-full h-[150px] object-cover p-2"
                        onError={(e) => {
                          e.target.src = unplugged;
                        }}
                      />
  
                      <div className="p-4 flex flex-col h-full">
                        <h5 className="text-lg font-semibold">
                          {name.toUpperCase()}
                        </h5>
  
                        <p className="text-gray-500 italic">~ {brand}</p>
  
                        <hr className="my-2" />
  
                        <div className="mt-auto">
                          <h5 className="mb-2 font-bold text-lg">
                            Rs. {price.toLocaleString("en-LK")}/-
                          </h5>
  
                          <button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition disabled:bg-gray-400"
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={!productAvailable || stockQuantity === 0}
                          >
                            {stockQuantity !== 0
                              ? "Add to Cart"
                              : "Out of Stock"}
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
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