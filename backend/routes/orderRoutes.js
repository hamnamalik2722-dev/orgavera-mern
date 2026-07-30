const express = require("express");
const Order = require("../models/order");

const router = express.Router();

// Create order
router.post("/", async (req, res) => {
    try {
        const {
            customerName,
            phone,
            address,
            productName,
            quantity,
            totalPrice
        } = req.body;

        if (
            !customerName ||
            !phone ||
            !address ||
            !productName ||
            totalPrice === undefined
        ) {
            return res.status(400).json({
                message: "Please provide complete order details"
            });
        }

        const newOrder = await Order.create({
            customerName,
            phone,
            address,
            productName,
            quantity,
            totalPrice
        });

        res.status(201).json({
            message: "Order created successfully",
            data: newOrder
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
});

// Get all orders
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find({});

        res.status(200).json({
            message: "Orders found",
            data: orders
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
});

// Delete order
router.delete("/:id", async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);

        if (!deletedOrder) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json({
            message: "Order deleted successfully",
            data: deletedOrder
        });

    } catch (error) {
        res.status(400).json({
            message: "Invalid order ID"
        });
    }
});

module.exports = router;