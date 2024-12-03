const express = require("express");
const Order = require("../models/Order.model");
// const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Place an order (User only)
router.post("/", async (req, res) => {
  const { name, contact, address, productId, quantity } = req.body;

  try {
    if (!name || !contact || !address || !productId || !quantity) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    const newOrder = new Order({ name, contact, address, productId, quantity });
    await newOrder.save();

    return res.status(201).json({ msg: "Order placed successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Failed to place order." });
  }
});

// Get all orders (Admin only)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("productId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status (Admin only)
router.put("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
