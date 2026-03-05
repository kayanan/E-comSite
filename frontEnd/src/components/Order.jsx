import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getToken } from "../auth/auth";
const Order = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/orders`, {
          headers: { "Authorization": `Bearer ${getToken()}` }
        });
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError("Failed to fetch orders. Please try again later.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [baseUrl]);

  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'PLACED':
        return 'bg-info';
      case 'SHIPPED':
        return 'bg-primary';
      case 'DELIVERED':
        return 'bg-success';
      case 'CANCELLED':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  const calculateOrderTotal = (items) => {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto mt-20 px-4">
        <div className="flex justify-center items-center h-[300px]">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto mt-20 px-4">
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto mt-20 px-4">
      
      <h2 className="text-center text-2xl font-semibold mb-6">
        Order Management
      </h2>
  
      <div className="bg-white shadow rounded-lg mb-4">
  
        {/* Header */}
        <div className="px-4 py-3 bg-blue-600 text-white rounded-t-lg">
          <h5 className="font-semibold">
            Orders ({orders.length})
          </h5>
        </div>
  
        {/* Table */}
        <div className="overflow-x-auto">
  
          <table className="w-full text-left border-collapse">
  
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Items</th>
                <th className="p-3">Total</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
  
            <tbody>
  
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <React.Fragment key={order.orderId}>
  
                    {/* Main Row */}
                    <tr className="border-t hover:bg-gray-50">
  
                      <td className="p-3 font-semibold">
                        {order.orderId}
                      </td>
  
                      <td className="p-3">
                        <div>{order.customerName}</div>
                        <div className="text-sm text-gray-500">
                          {order.email}
                        </div>
                      </td>
  
                      <td className="p-3">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
  
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
  
                      <td className="p-3">
                        {order.items.length}
                      </td>
  
                      <td className="p-3 font-semibold">
                        {formatCurrency(calculateOrderTotal(order.items))}
                      </td>
  
                      <td className="p-3">
                        <button
                          className="border border-blue-600 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-600 hover:text-white transition"
                          onClick={() => toggleOrderDetails(order.orderId)}
                        >
                          {expandedOrder === order.orderId
                            ? "Hide Details"
                            : "View Details"}
                        </button>
                      </td>
  
                    </tr>
  
                    {/* Expanded Details */}
                    {expandedOrder === order.orderId && (
                      <tr>
                        <td colSpan="7" className="p-0">
  
                          <div className="bg-gray-100 p-4">
  
                            <h6 className="font-semibold mb-3">
                              Order Items
                            </h6>
  
                            <div className="overflow-x-auto">
  
                              <table className="w-full border border-gray-300">
  
                                <thead className="bg-gray-200">
                                  <tr>
                                    <th className="p-2 border">Product</th>
                                    <th className="p-2 border text-center">Quantity</th>
                                    <th className="p-2 border text-right">Price</th>
                                  </tr>
                                </thead>
  
                                <tbody>
  
                                  {order.items.map((item, index) => (
                                    <tr key={index} className="border-t">
  
                                      <td className="p-2 border">
                                        {item.productName}
                                      </td>
  
                                      <td className="p-2 border text-center">
                                        {item.quantity}
                                      </td>
  
                                      <td className="p-2 border text-right">
                                        {formatCurrency(item.totalPrice)}
                                      </td>
  
                                    </tr>
                                  ))}
  
                                  <tr className="bg-blue-100 font-semibold">
  
                                    <td colSpan="2" className="p-2 border text-right">
                                      Total
                                    </td>
  
                                    <td className="p-2 border text-right">
                                      {formatCurrency(calculateOrderTotal(order.items))}
                                    </td>
  
                                  </tr>
  
                                </tbody>
  
                              </table>
  
                            </div>
  
                          </div>
  
                        </td>
                      </tr>
                    )}
  
                  </React.Fragment>
                ))
              )}
  
            </tbody>
  
          </table>
  
        </div>
  
      </div>
  
    </div>
  );ß
};

export default Order;