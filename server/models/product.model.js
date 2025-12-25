import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    category: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
      },
    ],
    sub_category: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    images: {
      type: Array,
      default: [],
    },

    unit: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
      required: [true, "Price is required"],
    },
    stock_quantity: {
      type: Number,
      required: [true, "Stock quantity is required"],
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: "",
    },
    more_details: {
      type: Object,
      default: {},
    },
    publish: {
      type: Boolean,
      default: true,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          required: [true, "Rating is required"],
        },
        comment: {
          type: String,
          default: "",
        },
        created_at: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
