import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const CartProductModel = mongoose.model("CartProduct", cartProductSchema);

export default CartProductModel;