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
        { responseType: "blob" , headers: { "Authorization": `Bearer ${getToken()}` } }
      );
      setImageUrl(URL.createObjectURL(response.data));
    };
    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    try {
      await axios.delete(`${baseUrl}/api/product/${id}`);
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

  const handlAddToCart = () => {
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
  
  return (
    <div className="max-w-7xl mx-auto mt-20 px-4">
      <div className="grid md:grid-cols-2 gap-8">
  
        {/* Product Image */}
        <div className="mb-4">
          <div className="bg-white rounded-lg shadow p-4">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full max-h-[500px] object-contain"
            />
          </div>
        </div>
  
        {/* Product Details */}
        <div>
  
          <div className="flex justify-between items-center mb-2">
            <span className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded">
              {product.category}
            </span>
  
            <span className="text-sm text-gray-500">
              Listed: {new Date(product.releaseDate).toLocaleDateString()}
            </span>
          </div>
  
          <h2 className="text-2xl font-semibold capitalize mb-1">
            {product.name}
          </h2>
  
          <p className="text-gray-500 italic mb-4">
            ~ {product.brand}
          </p>
  
          <div className="mb-4">
            <h5 className="font-semibold mb-2">
              Product Description:
            </h5>
            <p className="text-gray-700">
              {product.description}
            </p>
          </div>
  
          <h3 className="text-2xl font-bold mb-3">
            Rs. {Number(product.price).toLocaleString("en-LK")}/-
          </h3>
  
          <div className="grid gap-2 mb-3">
            <button
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              onClick={handlAddToCart}
              disabled={!product.productAvailable || product.stockQuantity == 0}
            >
              {product.stockQuantity !== 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
  
          <p className="mb-4">
            <span className="mr-2">Stock Available:</span>
            <span className="font-bold text-green-600">
              {product.stockQuantity}
            </span>
          </p>
  
          <div className="flex gap-3">
  
            <button
              className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition flex items-center gap-1"
              type="button"
              onClick={handleEditClick}
            >
              <i className="bi bi-pencil"></i>
              Update
            </button>
  
            <button
              className="border border-red-600 text-red-600 px-4 py-2 rounded hover:bg-red-600 hover:text-white transition flex items-center gap-1"
              type="button"
              onClick={deleteProduct}
            >
              <i className="bi bi-trash"></i>
              Delete
            </button>
  
          </div>
  
        </div>
      </div>
    </div>
  );
};

export default Product;