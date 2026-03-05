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
    const form = event.currentTarget;
    setValidated(true);
    if (!validateForm() || !form.checkValidity()) {
      event.stopPropagation();
      return;
    }

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

  return (
    <div className="max-w-6xl mx-auto mt-10 pt-6 px-4">
      <form noValidate onSubmit={submitHandler} className="grid grid-cols-12 gap-6">
  
        <div className="col-span-12 md:col-span-6">
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={product.name}
            onChange={handleInputChange}
          />
          {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
        </div>
  
        <div className="col-span-12 md:col-span-6">
          <label className="block mb-1 font-medium">Brand</label>
          <input
            type="text"
            name="brand"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={product.brand}
            onChange={handleInputChange}
          />
          {errors.brand && <div className="text-red-500 text-sm">{errors.brand}</div>}
        </div>
  
        <div className="col-span-12">
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={product.description}
            onChange={handleInputChange}
          />
          {errors.description && (
            <div className="text-red-500 text-sm">{errors.description}</div>
          )}
        </div>
  
        <div className="col-span-12 md:col-span-4">
          <label className="block mb-1 font-medium">Price</label>
          <input
            type="number"
            name="price"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={product.price}
            onChange={handleInputChange}
          />
          {errors.price && <div className="text-red-500 text-sm">{errors.price}</div>}
        </div>
  
        <div className="col-span-12 md:col-span-4">
          <label className="block mb-1 font-medium">Category</label>
          <select
            className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={product.category}
            onChange={handleInputChange}
            name="category"
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
            <div className="text-red-500 text-sm">{errors.category}</div>
          )}
        </div>
  
        <div className="col-span-12 md:col-span-4">
          <label className="block mb-1 font-medium">Stock Quantity</label>
          <input
            type="number"
            name="stockQuantity"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={product.stockQuantity}
            onChange={handleInputChange}
          />
          {errors.stockQuantity && (
            <div className="text-red-500 text-sm">{errors.stockQuantity}</div>
          )}
        </div>
  
        <div className="col-span-12 md:col-span-6">
          <label className="block mb-1 font-medium">Release Date</label>
          <input
            type="date"
            name="releaseDate"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={product.releaseDate}
            onChange={handleInputChange}
          />
          {errors.releaseDate && (
            <div className="text-red-500 text-sm">{errors.releaseDate}</div>
          )}
        </div>
  
        <div className="col-span-12 md:col-span-6 flex items-center">
          <input
            type="checkbox"
            name="productAvailable"
            className="mr-2 h-4 w-4"
            checked={product.productAvailable}
            onChange={handleInputChange}
          />
          <label className="font-medium">Product Available</label>
        </div>
  
        <div className="col-span-12">
          <label className="block mb-1 font-medium">Image</label>
          <input
            type="file"
            className="w-full border rounded-lg px-3 py-2"
            onChange={handleImageChange}
          />
          {errors.image && <div className="text-red-500 text-sm">{errors.image}</div>}
  
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-[150px] mt-3 rounded"
            />
          )}
        </div>
  
        <div className="col-span-12 text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
  
      </form>
    </div>
  );
};

export default AddProduct;
