import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getToken } from "../auth/auth";
const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    productAvailable: false,
  });

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setProduct({ ...product, [name]: fieldValue });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setErrors({
          ...errors,
          image: "Please select a valid image file (JPEG or PNG)",
        });
      } else if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image size should be less than 5MB" });
      } else {
        setErrors({ ...errors, image: null });
      }
    } else {
      setImagePreview(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!product.name.trim()) newErrors.name = "Product name is required";
    if (!product.brand.trim()) newErrors.brand = "Brand is required";
    if (!product.description.trim())
      newErrors.description = "Description is required";
    if (!product.price || parseFloat(product.price) <= 0)
      newErrors.price = "Price must be greater than zero";
    if (!product.category) newErrors.category = "Please select a category";
    if (!product.stockQuantity || parseInt(product.stockQuantity) < 0)
      newErrors.stockQuantity = "Stock quantity cannot be negative";
    if (!product.releaseDate)
      newErrors.releaseDate = "Release date is required";
    if (!image) newErrors.image = "Product image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    axios
      .post(`${baseUrl}/api/product`, formData, {
        headers: { "Content-Type": "multipart/form-data", "Authorization": `Bearer ${getToken()}` },
      })
      .then((response) => {
        toast.success("Product added successfully");
        setProduct({
          name: "",
          brand: "",
          description: "",
          price: "",
          category: "",
          stockQuantity: "",
          releaseDate: "",
          productAvailable: false,
        });
        setImage(null);
        setImagePreview(null);
        setValidated(false);
        setErrors({});
        navigate("/");
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setErrors(error.response.data);
        } else {
          toast.error("Error adding product");
        }
        setLoading(false);
      });
  };

  return (<div className="max-w-5xl mx-auto mt-24 px-4">
    <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl border border-gray-100 p-8">
  
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Add New Product
      </h2>
  
      <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-2 gap-6">
  
        {/* Name */}
        <div>
          <label className="text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            className="w-full mt-2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
            value={product.name}
            onChange={handleInputChange}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
  
        {/* Brand */}
        <div>
          <label className="text-sm font-medium text-gray-700">Brand</label>
          <input
            type="text"
            name="brand"
            className="w-full mt-2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
            value={product.brand}
            onChange={handleInputChange}
          />
          {errors.brand && <p className="text-red-500 text-sm">{errors.brand}</p>}
        </div>
  
        {/* Description */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            rows="3"
            name="description"
            className="w-full mt-2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
            value={product.description}
            onChange={handleInputChange}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>
  
        {/* Price */}
        <div>
          <label className="text-sm font-medium text-gray-700">Price</label>
          <div className="flex mt-2">
            <span className="px-4 py-3 bg-gray-100 border rounded-l-xl text-gray-600">
              Rs
            </span>
            <input
              type="number"
              name="price"
              className="w-full px-4 py-3 border rounded-r-xl focus:ring-2 focus:ring-blue-400 outline-none"
              value={product.price}
              onChange={handleInputChange}
            />
          </div>
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>
  
        {/* Category */}
        <div>
          <label className="text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            className="w-full mt-2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
            value={product.category}
            onChange={handleInputChange}
          >
            <option value="">Select category</option>
            <option value="Laptop">Laptop</option>
            <option value="Headphone">Headphone</option>
            <option value="Mobile">Mobile</option>
            <option value="Electronics">Electronics</option>
            <option value="Toys">Toys</option>
            <option value="Fashion">Fashion</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category}</p>
          )}
        </div>
  
        {/* Stock */}
        <div>
          <label className="text-sm font-medium text-gray-700">Stock Quantity</label>
          <input
            type="number"
            name="stockQuantity"
            className="w-full mt-2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
            value={product.stockQuantity}
            onChange={handleInputChange}
          />
          {errors.stockQuantity && (
            <p className="text-red-500 text-sm">{errors.stockQuantity}</p>
          )}
        </div>
  
        {/* Release Date */}
        <div>
          <label className="text-sm font-medium text-gray-700">Release Date</label>
          <input
            type="date"
            name="releaseDate"
            className="w-full mt-2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
            value={product.releaseDate}
            onChange={handleInputChange}
          />
          {errors.releaseDate && (
            <p className="text-red-500 text-sm">{errors.releaseDate}</p>
          )}
        </div>
  
        {/* Image Upload */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Product Image</label>
  
          <div className="mt-3 flex flex-col sm:flex-row gap-4 items-center">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-xl border"
              />
            )}
  
            <input
              type="file"
              className="border rounded-xl px-4 py-2 w-full"
              onChange={handleImageChange}
            />
          </div>
  
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
          )}
        </div>
  
        {/* Availability */}
        <div className="md:col-span-2 flex items-center gap-3">
          <input
            type="checkbox"
            name="productAvailable"
            checked={product.productAvailable}
            onChange={handleInputChange}
            className="w-5 h-5 accent-blue-600"
          />
          <label className="text-gray-700">Product Available</label>
        </div>
  
        {/* Submit */}
        <div className="md:col-span-2 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Adding...
              </>
            ) : (
              "Add Product"
            )}
          </button>
        </div>
  
      </form>
    </div>
  </div>)
};

export default AddProduct;
