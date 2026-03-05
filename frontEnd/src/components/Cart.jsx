import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import axios from "axios";
import CheckoutPopup from "./CheckoutPopup";
import { getToken } from "../auth/auth";
const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartImage, setCartImage] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchImagesAndUpdateCart = async () => {
      console.log("Cart", cart);
      try {
        const response = await axios.get(`${baseUrl}/api/products` ,{headers: { "Authorization": `Bearer ${getToken()}` } });
        console.log("cart", cart);
        setCartItems(cart);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    if (cart.length) {
      fetchImagesAndUpdateCart();
    } else {
      setCartItems([]);
    }
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const converUrlToFile = async (blobData, fileName) => {
    const file = new File([blobData], fileName, { type: blobData.type });
    return file;
  };

  const handleIncreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) => {
      if (item.id === itemId) {
        if (item.quantity < item.stockQuantity) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          toast.info("Cannot add more than available stock");
        }
      }
      return item;
    });
    setCartItems(newCartItems);
  };

  const handleDecreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
        : item
    );
    setCartItems(newCartItems);
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    const newCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(newCartItems);
  };
  const convertBase64ToDataURL = (base64String, mimeType = 'image/jpeg') => {
  // ✅ Fallback image if base64String is empty or undefined
  const fallbackImage = "/fallback-image.jpg"; // make sure this image exists in your public folder

  if (!base64String) return fallbackImage;

  if (base64String.startsWith("data:")) {
    return base64String;
  }

  if (base64String.startsWith("http")) {
    return base64String;
  }

  return `data:${mimeType};base64,${base64String}`;
};

  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        const { imageUrl, imageName, imageData, imageType, quantity, ...rest } = item;
        const updatedStockQuantity = item.stockQuantity - item.quantity;

        const updatedProductData = { ...rest, stockQuantity: updatedStockQuantity };
        console.log("updated product data", updatedProductData);

        const cartProduct = new FormData();
        cartProduct.append("imageFile", cartImage);
        cartProduct.append(
          "product",
          new Blob([JSON.stringify(updatedProductData)], { type: "application/json" })
        );

        await axios
          .put(`${baseUrl}/api/product/${item.id}`, cartProduct, {
            headers: {
              "Content-Type": "multipart/form-data",
              "Authorization": `Bearer ${getToken()}`
            },
          })
          .then((response) => {
            console.log("Product updated successfully:", (cartProduct));
          })
          .catch((error) => {
            console.error("Error updating product:", error);
          });
      }
      clearCart();
      setCartItems([]);
      setShowModal(false);
    } catch (error) {
      console.log("error during checkout", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 pt-10 px-4">
      <div className="flex justify-center">
        <div className="w-full lg:w-10/12">
  
          <div className="bg-white rounded-lg shadow">
  
            <div className="border-b p-4">
              <h4 className="text-lg font-semibold">Shopping Cart</h4>
            </div>
  
            <div className="p-4">
  
              {cartItems.length === 0 ? (
  
                <div className="text-center py-10">
                  <div className="text-5xl text-gray-400">🛒</div>
                  <h5 className="mt-3 text-lg">Your cart is empty</h5>
  
                  <a
                    href="/"
                    className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Continue Shopping
                  </a>
                </div>
  
              ) : (
                <>
  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
  
                      <thead>
                        <tr className="border-b">
                          <th className="p-2">Product</th>
                          <th className="p-2">Price</th>
                          <th className="p-2">Quantity</th>
                          <th className="p-2">Total</th>
                          <th className="p-2">Action</th>
                        </tr>
                      </thead>
  
                      <tbody>
  
                        {cartItems.map((item) => (
  
                          <tr key={item.id} className="border-b">
  
                            <td className="p-2">
                              <div className="flex items-center gap-3">
  
                                <img
                                  src={convertBase64ToDataURL(item.imageData)}
                                  alt={item.name}
                                  className="rounded w-20 h-20 object-cover"
                                />
  
                                <div>
                                  <h6 className="font-semibold">{item.name}</h6>
                                  <small className="text-gray-500">
                                    {item.brand}
                                  </small>
                                </div>
  
                              </div>
                            </td>
  
                            <td className="p-2">Rs. {item.price}</td>
  
                            <td className="p-2">
  
                              <div className="flex items-center border rounded w-[120px]">
  
                                <button
                                  className={`px-3 py-1 border-r ${
                                    item.quantity === 1
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                  type="button"
                                  onClick={() =>
                                    handleDecreaseQuantity(item.id)
                                  }
                                >
                                  −
                                </button>
  
                                <input
                                  type="text"
                                  className="w-full text-center outline-none"
                                  value={item.quantity}
                                  readOnly
                                />
  
                                <button
                                  className={`px-3 py-1 border-l ${
                                    item.quantity === item.stockQuantity
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                  type="button"
                                  onClick={() =>
                                    handleIncreaseQuantity(item.id)
                                  }
                                >
                                  +
                                </button>
  
                              </div>
  
                            </td>
  
                            <td className="p-2 font-bold">
                              Rs. {(item.price * item.quantity).toFixed(2)}
                            </td>
  
                            <td className="p-2">
                              <button
                                className={`border border-red-500 text-red-500 px-2 py-1 rounded hover:bg-red-500 hover:text-white ${
                                  item.quantity === 1
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleRemoveFromCart(item.id)
                                }
                              >
                                🗑
                              </button>
                            </td>
  
                          </tr>
  
                        ))}
  
                      </tbody>
                    </table>
                  </div>
  
                  <div className="bg-gray-50 rounded mt-4 p-4 flex justify-between items-center">
                    <h5 className="font-semibold">Total:</h5>
                    <h5 className="font-semibold">
                      Rs. {totalPrice.toFixed(2)}
                    </h5>
                  </div>
  
                  <div className="grid mt-4">
                    <button
                      className="bg-blue-600 text-white py-3 rounded-lg text-lg hover:bg-blue-700"
                      type="button"
                      onClick={() => setShowModal(true)}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
  
                </>
              )}
  
            </div>
          </div>
  
        </div>
      </div>
  
      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        handleCheckout={handleCheckout}
      />
  
    </div>
  );
};

export default Cart;