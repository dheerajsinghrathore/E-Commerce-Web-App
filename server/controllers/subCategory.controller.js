import SubCategoryModel from "../models/subcategory.model.js";

export const createSubCategoryController = async (req, res) => {
  try {
    const { name, category, image } = req.body;

    if (
      !name ||
      (Array.isArray(category) ? category.length === 0 : !category) ||
      !image
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, Category, and Image are required",
        error: "Invalid input",
      });
    }

    const newSubCategory = new SubCategoryModel({
      name,
      category,
      image,
    });
    const save = await newSubCategory.save();

    return res.status(201).json({
      success: true,
      data: save,
      message: "Sub-category created successfully",
    });
  } catch (error) {
    console.error("Error creating sub-category:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while creating sub-category",
      error: error,
    });
  }
};

export const getSubCategoriesByCategoryIdController = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subCategories = await SubCategoryModel.find({ category: categoryId })
      .populate("category")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: subCategories,
      message: "Sub-categories fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching sub-categories:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching sub-categories",
    });
  }
};

export const getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategoryModel.find()
      .populate("category")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: subCategories,
      message: "Sub-categories fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching sub-categories:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching sub-categories",
    });
  }
};

export const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, image } = req.body;

    if (
      !name ||
      (Array.isArray(category) ? category.length === 0 : !category) ||
      !image
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, Category, and Image are required",
        error: "Invalid input",
      });
    }

    const updatedSubCategory = await SubCategoryModel.findByIdAndUpdate(
      id,
      { name, category, image },
      { new: true },
    );

    if (!updatedSubCategory) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Sub-category not found",
          error: true,
        });
    }

    return res.status(200).json({
      success: true,
      data: updatedSubCategory,
      error: false,
      message: "Sub-category updated successfully",
    });
  } catch (error) {
    console.error("Error updating sub-category:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating sub-category",
    });
  }
};

export const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSubCategory = await SubCategoryModel.findByIdAndDelete(id);

    if (!deletedSubCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Sub-category not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Sub-category deleted successfully" });
  } catch (error) {
    console.error("Error deleting sub-category:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting sub-category",
    });
  }
};
