const express = require("express");
const Product = require("../models/product");

const router = express.Router();

/* ================= CREATE PRODUCT ================= */

router.post("/", async (req, res) => {
    try {
        const {
            name,
            category,
            type,
            price,
            image,
            description
        } = req.body;

        if (!name || !category || price === undefined) {
            return res.status(400).json({
                message: "Name, category and price are required",
            });
        }

        const newProduct = await Product.create({
            name,
            category,
            type: type || "",
            price,
            image: image || "",
            description: description || "",
        });

        res.status(201).json({
            message: "Product created successfully",
            data: newProduct,
        });

    } catch (error) {
        res.status(500).json({
            message: "Product creation failed",
            error: error.message,
        });
    }
});


/* ================= GET ALL PRODUCTS ================= */

router.get("/", async (req, res) => {
    try {
        const { category } = req.query;

        const filter = category ? { category } : {};

        const products = await Product.find(filter).sort({
            createdAt: -1,
        });

        res.status(200).json({
            message: "Products found",
            data: products,
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch products",
            error: error.message,
        });
    }
});


/* ================= GET ONE PRODUCT ================= */

router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.status(200).json({
            message: "Product found",
            data: product,
        });

    } catch (error) {
        res.status(400).json({
            message: "Invalid product ID",
            error: error.message,
        });
    }
});


/* ================= UPDATE PRODUCT ================= */

router.put("/:id", async (req, res) => {
    try {
        const {
            name,
            category,
            type,
            price,
            image,
            description
        } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name,
                category,
                type,
                price,
                image,
                description,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            data: updatedProduct,
        });

    } catch (error) {
        res.status(400).json({
            message: "Product update failed",
            error: error.message,
        });
    }
});


/* ================= DELETE PRODUCT ================= */

router.delete("/:id", async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(
            req.params.id
        );

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.status(200).json({
            message: "Product deleted successfully",
            data: deletedProduct,
        });

    } catch (error) {
        res.status(400).json({
            message: "Invalid product ID",
            error: error.message,
        });
    }
});

module.exports = router;