import ProductModel from "../models/product.model.js";

export const createProductController = async (req, res) => {
  try {
    const {
      name,
      image,
      category,
      subCategory,
      unit,
      price,
      stock,
      discount,
      description,
      more_details,
    } = req.body;

    // Validate and clean arrays
    const imageArray = Array.isArray(image)
      ? image.filter(img => img && typeof img === 'string' && img.trim() !== '')
      : image ? [image] : [];

    const categoryArray = Array.isArray(category)
      ? category.filter(cat => cat && cat.toString().trim() !== '')
      : category ? [category] : [];

    const subCategoryArray = Array.isArray(subCategory)
      ? subCategory.filter(sub => sub && sub.toString().trim() !== '')
      : subCategory ? [subCategory] : [];

    // Validation with specific error messages
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
        error: true,
      });
    }
    if (!imageArray || imageArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
        error: true,
      });
    }
    if (!categoryArray || categoryArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one category is required",
        error: true,
      });
    }
    if (!subCategoryArray || subCategoryArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one subcategory is required",
        error: true,
      });
    }
    if (!unit || typeof unit !== "string" || unit.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Product unit is required",
        error: true,
      });
    }
    if (!price || isNaN(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid price (greater than 0) is required",
        error: true,
      });
    }
    if (!stock || isNaN(stock) || stock <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid stock quantity (greater than 0) is required",
        error: true,
      });
    }

    const newProduct = new ProductModel({
      name: name.trim(),
      images: imageArray, // Map 'image' from request to 'images' in model
      category: categoryArray,
      sub_category: subCategoryArray, // Map 'subCategory' from request to 'sub_category' in model
      unit: unit.trim(),
      price: parseFloat(price),
      stock_quantity: parseInt(stock, 10), // Map 'stock' from request to 'stock_quantity' in model
      discount: discount ? parseFloat(discount) : 0,
      description: description ? description.trim() : "",
      more_details: more_details || {},
    });
    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to create product",
      error: error.message,
    });
  }
};

export const getProductsController = async (req, res) => {
  try {
    const products = await ProductModel.find({ is_active: true })
      .populate("category", "name")
      .populate("sub_category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch products",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id).populate(
      "reviews.user",
      "name email",
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch product",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to update product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await ProductModel.findByIdAndUpdate(
      id,
      { is_active: false },
      { new: true },
    );

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to delete product",
      error: error.message,
    });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { id, subcategory } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
        error: true,
      });
    }

    const query = {
      is_active: true,
      category: { $in: [id] },
    };

    if (subcategory) {
      query.sub_category = { $in: [subcategory] };
    }

    const products = await ProductModel.find(query)
      .populate("category", "name")
      .populate("sub_category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch products by category",
      error: error.message,
    });
  }
};