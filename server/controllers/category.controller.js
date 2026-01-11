import CategoryModel from "../models/category.model.js";

// Create a new category
export const CreateCategoryController = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name || !image) {
      return res.status(400).json({ message: "Name and image are required" });
    }

    const newCategory = new CategoryModel({ name, image });

    res.status(201).json({
      message: "Category created successfully",
      data: await newCategory.save(),
      success: true,
      error: false,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: error.message, success: false });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find().sort({ createdAt: -1 });
    res.status(200).json({ categories, success: true, error: false });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message, success: false });
  }
};

// Get a single category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryModel.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a category by ID
export const updateCategoryController = async (req, res) => {
  try {
    const { _id, name, image } = req.body;

    const updateCategory = await CategoryModel.findByIdAndUpdate(
      _id,
      {
        name,
        image,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Category updated successfully",
      success: true,
      error: false,
      data: updateCategory,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: error.message, success: false });
  }
};

// Delete a category by ID
export const deleteCategoryController = async (req, res) => {
  try {
    const { _id } = req.body;

    const deleteCategory = await CategoryModel.findByIdAndDelete(_id);

    res.status(200).json({
      message: "Category deleted successfully",
      success: true,
      error: false,
      data: deleteCategory,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: error.message, success: false });
  }
};
