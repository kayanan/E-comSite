import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { getToken } from "../auth/auth";
const UpdateProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [image, setImage] = useState();
  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "",
  });

  const [imageChanged, setImageChanged] = useState(false);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
  

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

        console.log(response.data,'update product response')
      
        const responseImage = await axios.get(
          `${baseUrl}/api/product/${id}/image`,
          { responseType: "blob" }
        );
       const imageFile = await converUrlToFile(responseImage.data,response.data.imageName)
        setImage(imageFile);     
        setUpdateProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    console.log("image Updated", image);
  }, [image]);


  const navigate = useNavigate();

  const converUrlToFile = async(blobData, fileName) => {
    const file = new File([blobData], fileName, { type: blobData.type });
    return file;
  }
 
  const handleSubmit = async(e) => {
    setLoading(true);
    e.preventDefault();
    console.log("images", image)
    console.log("productsdfsfsf", updateProduct)
    const updatedProduct = new FormData();
    if (imageChanged && image) {
      updatedProduct.append("imageFile", image);
    }
    
    updatedProduct.append(
      "product",
      new Blob([JSON.stringify(updateProduct)], { type: "application/json" })
    );
  

  console.log("formData : ", updatedProduct)
    axios
      .put(`${baseUrl}/api/product/${id}`, updatedProduct, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Product updated successfully:", updatedProduct);
        toast.success("product updated successfully")
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        console.log("product unsuccessfull update",updateProduct)
        toast.error("Failed to update product. Please try again.");
      }).finally(()=>{
        setLoading(false)
        navigate('/')
      }
      );
  };
 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct({
      ...updateProduct,
      [name]: value,
    });
  };


  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImageChanged(true); // Mark that user has selected a new image
    }
  };
  

  if (!product.id) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="h-[300px] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  // return (
  //   <div className="max-w-5xl mx-auto px-4 mt-20">
  //     <div className="flex justify-center">
  //       <div className="w-full">
  //         <div className="bg-white shadow-lg rounded-lg">
  //           <div className="p-6">
  
  //             <h2 className="text-2xl font-bold text-center mb-6">
  //               Update Product
  //             </h2>
  
  //             <form
  //               className="grid grid-cols-1 md:grid-cols-2 gap-4"
  //               noValidate
  //               validated={validated.toString()}
  //               onSubmit={handleSubmit}
  //             >
  
  //               {/* Name */}
  //               <div>
  //                 <label className="font-semibold">Name</label>
  //                 <input
  //                   type="text"
  //                   className="w-full border rounded-md px-3 py-2 mt-1"
  //                   placeholder={product.name}
  //                   value={updateProduct.name}
  //                   onChange={handleChange}
  //                   name="name"
  //                 />
  //                 {errors.name && (
  //                   <p className="text-red-500 text-sm">{errors.name}</p>
  //                 )}
  //               </div>
  
  //               {/* Brand */}
  //               <div>
  //                 <label className="font-semibold">Brand</label>
  //                 <input
  //                   type="text"
  //                   className="w-full border rounded-md px-3 py-2 mt-1"
  //                   placeholder={product.brand}
  //                   value={updateProduct.brand}
  //                   onChange={handleChange}
  //                   name="brand"
  //                 />
  //                 {errors.brand && (
  //                   <p className="text-red-500 text-sm">{errors.brand}</p>
  //                 )}
  //               </div>
  
  //               {/* Description */}
  //               <div className="col-span-2">
  //                 <label className="font-semibold">Description</label>
  //                 <textarea
  //                   className="w-full border rounded-md px-3 py-2 mt-1"
  //                   rows="3"
  //                   placeholder={product.description}
  //                   value={updateProduct.description}
  //                   name="description"
  //                   onChange={handleChange}
  //                 />
  //               </div>
  
  //               {/* Price */}
  //               <div>
  //                 <label className="font-semibold">Price</label>
  //                 <div className="flex">
  //                   <span className="px-3 py-2 bg-gray-200 border rounded-l-md">
  //                     Rs
  //                   </span>
  //                   <input
  //                     type="number"
  //                     className="w-full border rounded-r-md px-3 py-2"
  //                     value={updateProduct.price}
  //                     onChange={handleChange}
  //                     name="price"
  //                   />
  //                 </div>
  //               </div>
  
  //               {/* Category */}
  //               <div>
  //                 <label className="font-semibold">Category</label>
  //                 <select
  //                   className="w-full border rounded-md px-3 py-2 mt-1"
  //                   value={updateProduct.category}
  //                   onChange={handleChange}
  //                   name="category"
  //                 >
  //                   <option value="">Select category</option>
  //                   <option value="Laptop">Laptop</option>
  //                   <option value="Headphone">Headphone</option>
  //                   <option value="Mobile">Mobile</option>
  //                   <option value="Electronics">Electronics</option>
  //                   <option value="Toys">Toys</option>
  //                   <option value="Fashion">Fashion</option>
  //                 </select>
  //               </div>
  
  //               {/* Stock */}
  //               <div>
  //                 <label className="font-semibold">Stock Quantity</label>
  //                 <input
  //                   type="number"
  //                   className="w-full border rounded-md px-3 py-2 mt-1"
  //                   value={updateProduct.stockQuantity}
  //                   onChange={handleChange}
  //                   name="stockQuantity"
  //                 />
  //               </div>
  
  //               {/* Release Date */}
  //               <div>
  //                 <label className="font-semibold">Release Date</label>
  //                 <input
  //                   type="date"
  //                   className="w-full border rounded-md px-3 py-2 mt-1"
  //                   value={
  //                     updateProduct.releaseDate
  //                       ? updateProduct.releaseDate.slice(0, 10)
  //                       : ""
  //                   }
  //                   onChange={handleChange}
  //                   name="releaseDate"
  //                 />
  //               </div>
  
  //               {/* Image */}
  //               <div>
  //                 <label className="font-semibold">Image</label>
  
  //                 {image && (
  //                   <img
  //                     src={URL.createObjectURL(image)}
  //                     alt={product.name}
  //                     className="h-[150px] object-contain rounded mb-2"
  //                   />
  //                 )}
  
  //                 <input
  //                   type="file"
  //                   className="w-full border rounded-md px-3 py-2"
  //                   onChange={handleImageChange}
  //                 />
  
  //                 <p className="text-sm text-gray-500">
  //                   Leave empty to keep current image
  //                 </p>
  //               </div>
  
  //               {/* Checkbox */}
  //               <div className="col-span-2 flex items-center space-x-2">
  //                 <input
  //                   type="checkbox"
  //                   checked={updateProduct.productAvailable}
  //                   onChange={(e) =>
  //                     setUpdateProduct({
  //                       ...updateProduct,
  //                       productAvailable: e.target.checked,
  //                     })
  //                   }
  //                 />
  //                 <label>Product Available</label>
  //               </div>
  
  //               {/* Buttons */}
  //               <div className="col-span-2 mt-4 flex gap-3">
  //                 {loading ? (
  //                   <button
  //                     className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
  //                     disabled
  //                   >
  //                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
  //                     Updating...
  //                   </button>
  //                 ) : (
  //                   <button
  //                     type="submit"
  //                     className="bg-blue-600 text-white px-4 py-2 rounded"
  //                   >
  //                     Update Product
  //                   </button>
  //                 )}
  
  //                 <button
  //                   type="button"
  //                   className="border border-gray-400 px-4 py-2 rounded"
  //                   onClick={() => navigate("/")}
  //                 >
  //                   Cancel
  //                 </button>
  //               </div>
  
  //             </form>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
  return (<div className="max-w-5xl mx-auto px-4 mt-24">
  <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl border border-gray-100 p-8">

    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
      Update Product
    </h2>

    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      onSubmit={handleSubmit}
    >

      {/* Name */}
      <div>
        <label className="text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          className="w-full mt-2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
          value={updateProduct.name}
          onChange={handleChange}
          name="name"
        />
      </div>

      {/* Brand */}
      <div>
        <label className="text-sm font-medium text-gray-700">Brand</label>
        <input
          type="text"
          className="w-full mt-2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
          value={updateProduct.brand}
          onChange={handleChange}
          name="brand"
        />
      </div>

      {/* Description */}
      <div className="md:col-span-2">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          rows="3"
          className="w-full mt-2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
          value={updateProduct.description}
          name="description"
          onChange={handleChange}
        />
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
            className="w-full px-4 py-3 border rounded-r-xl focus:ring-2 focus:ring-blue-400 outline-none"
            value={updateProduct.price}
            onChange={handleChange}
            name="price"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="text-sm font-medium text-gray-700">Category</label>
        <select
          className="w-full mt-2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
          value={updateProduct.category}
          onChange={handleChange}
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
      </div>

      {/* Stock */}
      <div>
        <label className="text-sm font-medium text-gray-700">Stock Quantity</label>
        <input
          type="number"
          className="w-full mt-2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
          value={updateProduct.stockQuantity}
          onChange={handleChange}
          name="stockQuantity"
        />
      </div>

      {/* Release Date */}
      <div>
        <label className="text-sm font-medium text-gray-700">Release Date</label>
        <input
          type="date"
          className="w-full mt-2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
          value={
            updateProduct.releaseDate
              ? updateProduct.releaseDate.slice(0, 10)
              : ""
          }
          onChange={handleChange}
          name="releaseDate"
        />
      </div>

      {/* Image Upload */}
      <div className="md:col-span-2">
        <label className="text-sm font-medium text-gray-700">Product Image</label>

        <div className="mt-3 flex flex-col sm:flex-row gap-4 items-center">
          {image && (
            <img
              src={URL.createObjectURL(image)}
              className="h-32 w-32 object-cover rounded-xl border"
            />
          )}

          <input
            type="file"
            className="border rounded-xl px-4 py-2 w-full"
            onChange={handleImageChange}
          />
        </div>

        <p className="text-sm text-gray-500 mt-1">
          Leave empty to keep current image
        </p>
      </div>

      {/* Availability */}
      <div className="md:col-span-2 flex items-center gap-3">
        <input
          type="checkbox"
          checked={updateProduct.productAvailable}
          onChange={(e) =>
            setUpdateProduct({
              ...updateProduct,
              productAvailable: e.target.checked,
            })
          }
          className="w-5 h-5 accent-blue-600"
        />
        <label className="text-gray-700">Product Available</label>
      </div>

      {/* Buttons */}
      <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 mt-6">

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Updating...
            </>
          ) : (
            "Update Product"
          )}
        </button>

        {/* Cancel */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex-1 border border-gray-300 py-3 rounded-xl hover:bg-gray-100 transition"
        >
          Cancel
        </button>

      </div>

    </form>
  </div>
</div>)
};

export default UpdateProduct;