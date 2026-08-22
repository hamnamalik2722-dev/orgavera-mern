const express = require("express");
const Product = require("../models/product");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const {
            name, category, type, price, oldPrice, image, description,
            ingredients, benefits, methodOfUse, variants,
            isBestSeller, bestSellerBadge, bestSellerOrder, isActive,
        } = req.body;

        if (!name || !category) {
            return res.status(400).json({ message: "Name and category are required" });
        }

        const newProduct = await Product.create({
            name,
            category,
            type: type || "",
            price: Number(price) || 0,
            oldPrice: Number(oldPrice) || 0,
            image: image || "",
            description: description || "",
            ingredients: ingredients || "",
            benefits: Array.isArray(benefits) ? benefits : [],
            methodOfUse: Array.isArray(methodOfUse) ? methodOfUse : [],
            variants: Array.isArray(variants) ? variants : [],
            isBestSeller: Boolean(isBestSeller),
            bestSellerBadge: bestSellerBadge || "",
            bestSellerOrder: Number(bestSellerOrder) || 0,
            isActive: isActive !== undefined ? isActive : true,
        });

        return res.status(201).json({
            message: "Product created successfully",
            data: newProduct,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Product creation failed",
            error: error.message,
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};

        const products = await Product.find(filter).sort({
            bestSellerOrder: 1,
            createdAt: -1,
        });

        return res.status(200).json({
            message: "Products found",
            data: products,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to fetch products",
            error: error.message,
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({
            message: "Product found",
            data: product,
        });
    } catch (error) {
        return res.status(400).json({
            message: "Invalid product ID",
            error: error.message,
        });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const allowedFields = [
            "name", "category", "type", "price", "oldPrice", "image",
            "description", "ingredients", "benefits", "methodOfUse",
            "variants", "isBestSeller", "bestSellerBadge",
            "bestSellerOrder", "isActive",
        ];

        const updateData = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        if (updateData.price !== undefined) updateData.price = Number(updateData.price) || 0;
        if (updateData.oldPrice !== undefined) updateData.oldPrice = Number(updateData.oldPrice) || 0;
        if (updateData.bestSellerOrder !== undefined) updateData.bestSellerOrder = Number(updateData.bestSellerOrder) || 0;
        if (updateData.isBestSeller !== undefined) updateData.isBestSeller = Boolean(updateData.isBestSeller);

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({
            message: "Product updated successfully",
            data: updatedProduct,
        });
    } catch (error) {
        return res.status(400).json({
            message: "Product update failed",
            error: error.message,
        });
    }
});

router.patch("/:id/variants", async (req, res) => {
    try {
        const { variants } = req.body;

        if (!Array.isArray(variants)) {
            return res.status(400).json({ message: "Variants must be an array" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { variants },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({
            message: "Product variants updated successfully",
            data: updatedProduct,
        });
    } catch (error) {
        return res.status(400).json({
            message: "Variant update failed",
            error: error.message,
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({
            message: "Product deleted successfully",
            data: deletedProduct,
        });
    } catch (error) {
        return res.status(400).json({
            message: "Invalid product ID",
            error: error.message,
        });
    }
});

module.exports = router;
