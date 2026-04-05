import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { useState } from "react";
import AppContext from "../Context/Context";
import axios from "axios";
import { toast } from "react-toastify";
import { getToken } from "../auth/auth";
const Product = () => {
  const { id } = useParams();
  const { data, addToCart, removeFromCart, cart, refreshData } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/product/${id}`,
          {
            headers: { "Authorization": `Bearer ${getToken()}` }
          }
        );
        setProduct(response.data);
        console.log(response.data);
        if (response.data.imageName) {
          fetchImage();
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchImage = async () => {
      const response = await axios.get(
        `${baseUrl}/api/product/${id}/image`,
        { responseType: "blob", headers: { "Authorization": `Bearer ${getToken()}` } }
      );
      setImageUrl(URL.createObjectURL(response.data));
    };
    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    try {
      await axios.delete(`${baseUrl}/api/product/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      removeFromCart(id);
      console.log("Product deleted successfully");
      toast.success("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handleAddToCart = () => {
    addToCart(product);
    toast.success("Product added to cart");
  };

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto mt-20 px-4">
        <div className="flex justify-center items-center h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (<>
  <div className="max-w-7xl mx-auto mt-24 px-4">
    <div className="grid md:grid-cols-2 gap-10 items-start">

      {/* Image Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 flex justify-center">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full max-h-[450px] object-contain transition hover:scale-105"
        />
      </div>

      {/* Details Section */}
      <div className="space-y-5">

        {/* Top Row */}
        <div className="flex justify-between items-center">
          <span className="bg-blue-100 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
            {product.category}
          </span>

          <span className="text-sm text-gray-400">
            {new Date(product.releaseDate).toLocaleDateString()}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800">
          {product.name}
        </h1>

        {/* Brand */}
        <p className="text-gray-500 text-sm">
          Brand: <span className="font-medium">{product.brand}</span>
        </p>

        {/* Price */}
        <div className="text-3xl font-bold text-blue-600">
          Rs. {Number(product.price).toLocaleString("en-LK")}
        </div>

        {/* Description */}
        <div>
          <h3 className="font-semibold mb-1 text-gray-700">
            Description
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Stock */}
        <div className="text-sm">
          Stock:
          <span
            className={`ml-2 font-semibold ${product.stockQuantity > 0
              ? "text-green-600"
              : "text-red-500"
              }`}
          >
            {product.stockQuantity > 0
              ? `${product.stockQuantity} available`
              : "Out of stock"}
          </span>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={!product.productAvailable || product.stockQuantity === 0}
          className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {product.stockQuantity !== 0 ? "Add to Cart" : "Out of Stock"}
        </button>

        {/* Actions */}
        <div className="flex gap-3">

          <button
            onClick={handleEditClick}
            className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition"
          >
            ✏️ Update
          </button>

          <button
            onClick={deleteProduct}
            className="flex-1 border border-red-600 text-red-600 py-2 rounded-xl hover:bg-red-600 hover:text-white transition"
          >
            🗑 Delete
          </button>

        </div>
      </div>
    </div>
  </div>
  </>)
};

export default Product;