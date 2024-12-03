const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  buyerDetails: {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
  },
  status: { type: String, default: "Pending" },
});

module.exports = mongoose.model("Order", OrderSchema);
