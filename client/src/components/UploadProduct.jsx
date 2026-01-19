import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import uploadImage from "../utils/UploadImage";
import toast from "react-hot-toast";
import CustomAxios from "../utils/CustomAxios";
import AxiosApi from "../common/AxiosApi";
import AxiosToastError from "../utils/AxiosToastError";
import { setAllCategory as setAllCategoryAction } from "../store/productSlice";

function UploadProduct() {
  const dispatch = useDispatch();
  const reduxCategories = useSelector(
    (state) => state.product.allCategory || [],
  );
  const [allCategory, setAllCategory] = useState([]);
  const [allSubCategory, setAllSubCategory] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);

  const [data, setData] = useState({
    name: "",
    category: [],
    sub_category: [],
    images: [],
    unit: "",
    price: 0,
    stock_quantity: 0,
    discount: 0,
    description: "",
    more_details: {},
    publish: true,
  });
  const [uploadingImages, setUploadingImages] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch categories on component mount (same as UploadSubcategory)
  const fetchAllCategory = async () => {
    try {
      setLoadingCategories(true);
      const response = await CustomAxios({
        ...AxiosApi.get_categories,
      });
      if (response.data.success) {
        const categories = response.data.categories || [];
        setAllCategory(categories);
        // Also update Redux
        dispatch(setAllCategoryAction(categories));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch subcategories on component mount
  const fetchAllSubCategory = async () => {
    try {
      setLoadingSubCategories(true);
      const response = await CustomAxios({
        ...AxiosApi.get_subcategory,
      });
      if (response.data.success) {
        const subCategories = response.data.data || [];
        setAllSubCategory(subCategories);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoadingSubCategories(false);
    }
  };

  useEffect(() => {
    // Use Redux categories if available, otherwise fetch
    if (reduxCategories.length > 0) {
      setAllCategory(reduxCategories);
    } else {
      fetchAllCategory();
    }
    // Fetch subcategories
    fetchAllSubCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    
    // For integer fields (stock_quantity), use parseInt
    // For decimal fields (price, discount), use parseFloat
    if (name === "stock_quantity") {
      // Allow empty string or valid integers
      if (value === "") {
        setData((prev) => ({ ...prev, [name]: "" }));
      } else {
        const intValue = parseInt(value, 10);
        if (!isNaN(intValue) && intValue >= 0) {
          setData((prev) => ({ ...prev, [name]: intValue }));
        }
      }
    } else {
      // For price and discount, allow decimals
      if (value === "") {
        setData((prev) => ({ ...prev, [name]: "" }));
      } else {
        const floatValue = parseFloat(value);
        if (!isNaN(floatValue) && floatValue >= 0) {
          setData((prev) => ({ ...prev, [name]: floatValue }));
        }
      }
    }
  };

  const handleUploadImages = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);
    try {
      const uploadPromises = files.map((file) => uploadImage(file));
      const uploadedImages = await Promise.all(uploadPromises);
      const successfulUploads = uploadedImages.filter((img) => img !== null);

      if (successfulUploads.length > 0) {
        setData((prev) => ({
          ...prev,
          images: [...prev.images, ...successfulUploads],
        }));
        toast.success(
          `${successfulUploads.length} image(s) uploaded successfully`,
        );
      } else {
        toast.error("Failed to upload images");
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setUploadingImages(false);
      // Reset input to allow uploading same files again
      e.target.value = "";
    }
  };

  const handleDeleteImage = (index) => {
    setData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    toast.success("Image removed");
  };

  const handleAddCategory = (categoryId) => {
    if (categoryId && !data.category.includes(categoryId)) {
      setData((prev) => ({
        ...prev,
        category: [...prev.category, categoryId],
      }));
    }
  };

  const handleRemoveCategory = (categoryId) => {
    setData((prev) => ({
      ...prev,
      category: prev.category.filter((id) => id !== categoryId),
      // Remove subcategories that belong to this category only
      sub_category: prev.sub_category.filter((subId) => {
        const sub = allSubCategory.find((s) => s._id === subId);
        if (!sub) return false;
        // Keep subcategory if it belongs to other selected categories
        const remainingCategories = prev.category.filter(
          (id) => id !== categoryId,
        );
        return sub.category?.some((cat) =>
          remainingCategories.includes(cat._id || cat),
        );
      }),
    }));
  };

  const handleAddSubCategory = (subCategoryId) => {
    if (subCategoryId && !data.sub_category.includes(subCategoryId)) {
      setData((prev) => ({
        ...prev,
        sub_category: [...prev.sub_category, subCategoryId],
      }));
    }
  };

  const handleRemoveSubCategory = (subCategoryId) => {
    setData((prev) => ({
      ...prev,
      sub_category: prev.sub_category.filter((id) => id !== subCategoryId),
    }));
  };

  // Filter subcategories based on selected categories
  const getAvailableSubCategories = () => {
    if (data.category.length === 0) return [];

    return allSubCategory.filter((sub) => {
      // Check if subcategory belongs to any of the selected categories
      return sub.category?.some((cat) =>
        data.category.includes(cat._id || cat),
      );
    });
  };

  // Validate form data
  const validateForm = () => {
    if (!data.name || !data.name.trim()) {
      toast.error("Please enter product name");
      return false;
    }
    if (!data.description || !data.description.trim()) {
      toast.error("Please enter product description");
      return false;
    }
    if (!data.images || !Array.isArray(data.images) || data.images.length === 0) {
      toast.error("Please upload at least one product image");
      return false;
    }
    // Validate each image URL
    const validImages = data.images.filter(img => img && typeof img === 'string' && img.trim() !== '');
    if (validImages.length === 0) {
      toast.error("Please upload at least one valid product image");
      return false;
    }
    if (!data.category || !Array.isArray(data.category) || data.category.length === 0) {
      toast.error("Please select at least one category");
      return false;
    }
    // Validate category IDs
    const validCategories = data.category.filter(cat => cat && cat.toString().trim() !== '');
    if (validCategories.length === 0) {
      toast.error("Please select at least one valid category");
      return false;
    }
    if (!data.sub_category || !Array.isArray(data.sub_category) || data.sub_category.length === 0) {
      toast.error("Please select at least one subcategory");
      return false;
    }
    // Validate subcategory IDs
    const validSubCategories = data.sub_category.filter(sub => sub && sub.toString().trim() !== '');
    if (validSubCategories.length === 0) {
      toast.error("Please select at least one valid subcategory");
      return false;
    }
    if (!data.unit || !data.unit.trim()) {
      toast.error("Please enter product unit");
      return false;
    }
    
    // Validate numeric fields
    const price = data.price === "" || data.price === null || data.price === undefined
      ? 0
      : parseFloat(data.price);
    const stockQuantity = data.stock_quantity === "" || data.stock_quantity === null || data.stock_quantity === undefined
      ? 0
      : parseInt(data.stock_quantity, 10);
    const discount = data.discount === "" || data.discount === null || data.discount === undefined
      ? 0
      : parseFloat(data.discount);

    if (!price || isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price (greater than 0)");
      return false;
    }
    if (!stockQuantity || isNaN(stockQuantity) || stockQuantity <= 0) {
      toast.error("Please enter a valid stock quantity (greater than 0)");
      return false;
    }
    if (isNaN(discount) || discount < 0 || discount > 100) {
      toast.error("Discount must be between 0 and 100");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      // Ensure stock_quantity is properly converted to integer
      const stockValue = data.stock_quantity === "" || data.stock_quantity === null || data.stock_quantity === undefined
        ? 0
        : parseInt(String(data.stock_quantity), 10);

      // Ensure price is properly converted
      const priceValue = data.price === "" || data.price === null || data.price === undefined
        ? 0
        : parseFloat(String(data.price));

      // Ensure discount is properly converted
      const discountValue = data.discount === "" || data.discount === null || data.discount === undefined
        ? 0
        : parseFloat(String(data.discount));

      // Ensure images array is properly formatted and filtered
      let imagesArray = [];
      if (Array.isArray(data.images)) {
        imagesArray = data.images.filter(img => img && typeof img === 'string' && img.trim() !== '');
      } else if (data.images && typeof data.images === 'string' && data.images.trim() !== '') {
        imagesArray = [data.images];
      }

      // Ensure category array is properly formatted and filtered
      let categoryArray = [];
      if (Array.isArray(data.category)) {
        categoryArray = data.category.filter(cat => cat && cat.toString().trim() !== '');
      } else if (data.category) {
        categoryArray = [data.category];
      }

      // Ensure sub_category array is properly formatted and filtered
      let subCategoryArray = [];
      if (Array.isArray(data.sub_category)) {
        subCategoryArray = data.sub_category.filter(sub => sub && sub.toString().trim() !== '');
      } else if (data.sub_category) {
        subCategoryArray = [data.sub_category];
      }

      // Map data to match server API expectations
      const productData = {
        name: data.name.trim(),
        description: data.description.trim(),
        image: imagesArray, // Server expects "image" (array) not "images"
        category: categoryArray,
        subCategory: subCategoryArray, // Server expects "subCategory" not "sub_category"
        unit: data.unit.trim(),
        price: priceValue,
        stock: stockValue, // Server expects "stock" not "stock_quantity"
        discount: discountValue,
        more_details: data.more_details || {},
        publish: data.publish,
      };

      // Debug log (can be removed later)
      console.log("Submitting product data:", productData);

      const response = await CustomAxios({
        ...AxiosApi.create_product,
        data: productData,
      });

      if (response.data.success) {
        toast.success(response.data.message || "Product created successfully!");
        // Reset form
        setData({
          name: "",
          category: [],
          sub_category: [],
          images: [],
          unit: "",
          price: 0,
          stock_quantity: 0,
          discount: 0,
          description: "",
          more_details: {},
          publish: true,
        });
        // Reset file input
        const fileInput = document.getElementById("productImages");
        if (fileInput) fileInput.value = "";
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="h-full bg-neutral-50/50">
      <div className="p-4 bg-white shadow-sm border-b flex items-center justify-between sticky top-0 z-10">
        <h2 className="font-bold text-xl text-neutral-800">Upload Product</h2>
      </div>

      <div className="p-6">
        <form className="max-w-4xl mx-auto space-y-6" onSubmit={handleSubmit}>
          {/* Product Name */}
          <div className="grid gap-2">
            <label
              htmlFor="name"
              className="text-sm font-bold text-neutral-700"
            >
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter product name"
              value={data.name}
              onChange={handleOnChange}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-all font-medium placeholder:text-neutral-400"
            />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <label
              htmlFor="description"
              className="text-sm font-bold text-neutral-700"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter product description"
              value={data.description}
              onChange={handleOnChange}
              rows={6}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-all font-medium placeholder:text-neutral-400 resize-none"
            />
          </div>

          {/* Multiple Images Upload */}
          <div className="grid gap-2">
            <label className="text-sm font-bold text-neutral-700">
              Product Images <span className="text-red-500">*</span>
            </label>

            {/* Upload Button */}
            <label
              htmlFor="productImages"
              className={`w-full h-32 bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-xl flex flex-col items-center justify-center text-neutral-400 cursor-pointer hover:border-primary-400 hover:bg-primary-50/20 transition-all relative overflow-hidden group ${
                uploadingImages ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {uploadingImages ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
                  <span className="font-bold text-sm">Uploading...</span>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-primary-100 text-primary-500 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <span className="font-bold">Click to upload images</span>
                  <span className="text-xs">
                    Supports: JPG, PNG, WEBP (Multiple files allowed)
                  </span>
                </>
              )}
            </label>
            <input
              type="file"
              id="productImages"
              className="hidden"
              onChange={handleUploadImages}
              accept="image/*"
              multiple
              disabled={uploadingImages}
            />

            {/* Image Preview Grid */}
            {data.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {data.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative group bg-neutral-50 rounded-xl overflow-hidden border border-neutral-200 aspect-square"
                  >
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover p-2"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg active:scale-90"
                      aria-label="Delete image"
                    >
                      <IoClose size={18} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1 text-center font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      Image {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {data.images.length > 0 && (
              <p className="text-xs text-neutral-500 mt-2">
                {data.images.length} image(s) uploaded
              </p>
            )}
          </div>

          {/* Category Selection */}
          <div className="grid gap-2">
            <label className="text-sm font-bold text-neutral-700">
              Select Category <span className="text-red-500">*</span>
            </label>
            {loadingCategories ? (
              <div className="flex items-center justify-center py-3">
                <div className="w-5 h-5 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
                <span className="ml-2 text-sm text-neutral-500">
                  Loading categories...
                </span>
              </div>
            ) : (
              <>
                <select
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-all font-medium appearance-none cursor-pointer"
                  onChange={(e) => {
                    if (
                      e.target.value &&
                      !data.category.includes(e.target.value)
                    ) {
                      handleAddCategory(e.target.value);
                      e.target.value = ""; // Reset select after adding
                    }
                  }}
                  value=""
                >
                  <option value="">Choose a category</option>
                  {allCategory
                    .filter((cat) => !data.category.includes(cat._id))
                    .map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                </select>

                {/* Selected Categories Display */}
                {data.category.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {data.category.map((catId) => {
                      const cat = allCategory.find((c) => c._id === catId);
                      return (
                        <div
                          key={catId}
                          className="flex items-center gap-2 bg-primary-50 text-primary-600 px-3 py-1.5 rounded-lg border border-primary-100 font-bold text-sm group"
                        >
                          <span>{cat?.name || "Unknown"}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCategory(catId)}
                            className="hover:text-red-500 transition-colors active:scale-90"
                            aria-label="Remove category"
                          >
                            <IoClose size={18} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {data.category.length === 0 && allCategory.length > 0 && (
                  <p className="text-xs text-neutral-500 mt-1">
                    No categories selected. Select at least one category.
                  </p>
                )}

                {allCategory.length === 0 && !loadingCategories && (
                  <p className="text-xs text-amber-600 mt-1">
                    No categories available. Please add categories first.
                  </p>
                )}
              </>
            )}
          </div>

          {/* Subcategory Selection */}
          <div className="grid gap-2">
            <label className="text-sm font-bold text-neutral-700">
              Select Subcategory
            </label>
            {loadingSubCategories ? (
              <div className="flex items-center justify-center py-3">
                <div className="w-5 h-5 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
                <span className="ml-2 text-sm text-neutral-500">
                  Loading subcategories...
                </span>
              </div>
            ) : data.category.length === 0 ? (
              <p className="text-xs text-amber-600 py-3">
                Please select categories first to view subcategories.
              </p>
            ) : (
              <>
                <select
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-all font-medium appearance-none cursor-pointer"
                  onChange={(e) => {
                    if (
                      e.target.value &&
                      !data.sub_category.includes(e.target.value)
                    ) {
                      handleAddSubCategory(e.target.value);
                      e.target.value = ""; // Reset select after adding
                    }
                  }}
                  value=""
                >
                  <option value="">Choose a subcategory</option>
                  {getAvailableSubCategories()
                    .filter((sub) => !data.sub_category.includes(sub._id))
                    .map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name}
                      </option>
                    ))}
                </select>

                {/* Selected Subcategories Display */}
                {data.sub_category.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {data.sub_category.map((subId) => {
                      const sub = allSubCategory.find((s) => s._id === subId);
                      return (
                        <div
                          key={subId}
                          className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg border border-blue-100 font-bold text-sm group"
                        >
                          <span>{sub?.name || "Unknown"}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubCategory(subId)}
                            className="hover:text-red-500 transition-colors active:scale-90"
                            aria-label="Remove subcategory"
                          >
                            <IoClose size={18} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {data.sub_category.length === 0 &&
                  getAvailableSubCategories().length > 0 && (
                    <p className="text-xs text-neutral-500 mt-1">
                      No subcategories selected. You can select subcategories
                      from the selected categories.
                    </p>
                  )}

                {getAvailableSubCategories().length === 0 &&
                  data.category.length > 0 &&
                  !loadingSubCategories && (
                    <p className="text-xs text-amber-600 mt-1">
                      No subcategories available for the selected categories.
                    </p>
                  )}
              </>
            )}
          </div>

          {/* Product Details - Unit, Price, Stock, Discount */}
          <div className="grid gap-6">
            <label className="text-sm font-bold text-neutral-700">
              Product Details
            </label>

            {/* Row 1: Unit and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Unit */}
              <div className="grid gap-2">
                <label
                  htmlFor="unit"
                  className="text-sm font-bold text-neutral-700"
                >
                  Unit <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="unit"
                  name="unit"
                  placeholder="e.g., kg, piece, liter"
                  value={data.unit || ""}
                  onChange={handleOnChange}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-all font-medium placeholder:text-neutral-400"
                />
              </div>

              {/* Price */}
              <div className="grid gap-2">
                <label
                  htmlFor="price"
                  className="text-sm font-bold text-neutral-700"
                >
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="0.00"
                  value={data.price === 0 ? "" : data.price}
                  onChange={handleNumberChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-all font-medium placeholder:text-neutral-400"
                />
              </div>
            </div>

            {/* Row 2: Stock Quantity and Discount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Stock Quantity */}
              <div className="grid gap-2">
                <label
                  htmlFor="stock_quantity"
                  className="text-sm font-bold text-neutral-700"
                >
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="stock_quantity"
                  name="stock_quantity"
                  placeholder="0"
                  value={data.stock_quantity === 0 || data.stock_quantity === "" ? "" : data.stock_quantity}
                  onChange={handleNumberChange}
                  onBlur={(e) => {
                    // Ensure valid number on blur
                    const value = e.target.value;
                    if (value === "" || isNaN(parseInt(value))) {
                      setData((prev) => ({ ...prev, stock_quantity: "" }));
                    } else {
                      const numValue = parseInt(value, 10);
                      if (numValue > 0) {
                        setData((prev) => ({ ...prev, stock_quantity: numValue }));
                      }
                    }
                  }}
                  min="0"
                  step="1"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-all font-medium placeholder:text-neutral-400"
                />
                <div className="min-h-[20px]"></div>
              </div>

              {/* Discount */}
              <div className="grid gap-2">
                <label
                  htmlFor="discount"
                  className="text-sm font-bold text-neutral-700"
                >
                  Discount (%)
                </label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  placeholder="0"
                  value={data.discount === 0 ? "" : data.discount}
                  onChange={handleNumberChange}
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-all font-medium placeholder:text-neutral-400"
                />
                <div className="min-h-[20px]">
                  {(() => {
                    const discount = parseFloat(data.discount) || 0;
                    const price = parseFloat(data.price) || 0;
                    if (discount > 0 && price > 0) {
                      const discountedPrice = price - (price * discount) / 100;
                      if (!isNaN(discountedPrice) && discountedPrice > 0) {
                        return (
                          <p className="text-xs text-green-600 mt-1 font-semibold">
                            Discounted Price: ₹{discountedPrice.toFixed(2)}
                          </p>
                        );
                      }
                    }
                    return null;
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t border-neutral-200">
            <button
              type="submit"
              disabled={submitting}
              className={`px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all active:scale-95 flex items-center gap-2 ${
                submitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading Product...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span>Upload Product</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default UploadProduct;
