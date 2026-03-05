import axios from 'axios';
import React, { useState } from 'react';
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { getToken } from "../auth/auth";

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    setIsSubmitting(true);

    const orderItems = cartItems.map(item => ({
      productId: item.id,
      quantity: item.quantity
    }));

    const data = {
      customerName: name,
      email: email,
      items: orderItems
    };

    try {
        const response = await axios.post(`${baseUrl}/api/orders/place`, data, {
        headers: { "Authorization": `Bearer ${getToken()}` }
      });
      console.log(response, 'order placed');

      // Show success notification
      toast.success('Order placed successfully!');

      // Clear cart and redirect after a short delay
      localStorage.removeItem('cart');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const convertBase64ToDataURL = (base64String, mimeType = 'image/jpeg') => {
    if (!base64String) return '/public/fallback-image.jpg'; // Return fallback image if no data

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
  return (
    <>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
  
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
  
            {/* Header */}
            <div className="flex justify-between items-center border-b p-4">
              <h5 className="text-lg font-semibold">Checkout</h5>
              <button
                className="text-gray-500 hover:text-gray-700 text-xl"
                onClick={handleClose}
              >
                ✕
              </button>
            </div>
  
            <form noValidate onSubmit={handleConfirm}>
  
              {/* Body */}
              <div className="p-4">
  
                <div className="mb-4">
  
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex mb-3 border-b pb-3"
                    >
                      <img
                        src={convertBase64ToDataURL(item.imageData)}
                        alt={item.name}
                        className="mr-3 rounded w-[80px] h-[80px] object-cover"
                      />
  
                      <div className="flex-1">
                        <h6 className="font-semibold">{item.name}</h6>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          Price: Rs. {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
  
                  <div className="text-center my-4">
                    <h5 className="font-bold">
                      Total: Rs. {totalPrice.toFixed(2)}
                    </h5>
                  </div>
  
                  {/* Name */}
                  <div className="mb-3">
                    <label className="block mb-1 font-medium">
                      Name
                    </label>
  
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                    />
  
                    <div className="text-red-500 text-sm">
                      Please provide your name.
                    </div>
                  </div>
  
                  {/* Email */}
                  <div className="mb-3">
                    <label className="block mb-1 font-medium">
                      Email
                    </label>
  
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                    />
  
                    <div className="text-red-500 text-sm">
                      Please provide a valid email address.
                    </div>
                  </div>
  
                </div>
  
              </div>
  
              {/* Footer */}
              <div className="flex justify-end gap-3 border-t p-4">
  
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Close
                </button>
  
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Processing...
                    </>
                  ) : (
                    "Confirm Purchase"
                  )}
                </button>
  
              </div>
  
            </form>
  
          </div>
  
        </div>
      )}
    </>
  );
};

export default CheckoutPopup;