const express = require("express");
const Product = require("../models/product");

const router = express.Router();

// Create product
router.post("/", async (req, res) => {
    try {
        const { name, category, price, image, description } = req.body;

        if (!name || !category || price === undefined) {
            return res.status(400).json({
                message: "Name, category and price are required"
            });
        }

        const newProduct = await Product.create({
            name,
            category,
            price,
            image,
            description
        });

        res.status(201).json({
            message: "Product created successfully",
            data: newProduct
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
});

// Get all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find({});

        res.status(200).json({
            message: "Products found",
            data: products
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
});

// Get one product
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product found",
            data: product
        });

    } catch (error) {
        res.status(400).json({
            message: "Invalid product ID"
        });
    }
});

// Update product
router.put("/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            data: updatedProduct
        });

    } catch (error) {
        res.status(400).json({
            message: "Product update failed",
            error: error.message
        });
    }
});

// Delete product
router.delete("/:id", async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully",
            data: deletedProduct
        });

    } catch (error) {
        res.status(400).json({
            message: "Invalid product ID"
        });
    }
});

module.exports = router;