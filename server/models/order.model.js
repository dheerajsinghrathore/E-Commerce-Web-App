import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    orderId: {
      type: String,
      required: [true, "Order ID is required"],
      unique: true,
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Product ID is required"],
      ref: "Product",
    },
    product_details: {
      name: String,
      image: Array,
    },
    paymentId: {
      type: String,
      required: [true, "Payment ID is required"],
    },
    payment_status: {
      type: String,
      required: [true, "Payment status is required"],
    },
    delivery_address: {
      type: mongoose.Schema.ObjectId,
      ref: "Address",
    },
    sub_total_amount: {
      type: Number,
      required: [true, "Sub total amount is required"],
      default: 0,
    },
    total_amount: {
      type: Number,
      required: [true, "Total amount is required"],
      default: 0,
    },
    invoice_number: {
      type: String,
      required: [true, "Invoice number is required"],
      unique: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
