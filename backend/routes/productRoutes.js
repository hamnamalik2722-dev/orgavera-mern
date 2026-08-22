const express = require("express");
const Product = require("../models/product");

const router = express.Router();

/* ================= CLEAN VARIANTS ================= */

const cleanVariants = (variants = []) => {
    if (!Array.isArray(variants)) return [];

    return variants
        .filter((variant) =>
            String(variant.label || variant.size || "").trim()
        )
        .map((variant) => ({
            label: String(
                variant.label || variant.size || ""
            ).trim(),

            price:
                Number(
                    String(variant.price || 0)
                        .replace(/[^0-9.]/g, "")
                ) || 0,

            stock:
                Number(
                    String(variant.stock || 0)
                        .replace(/[^0-9]/g, "")
                ) || 0,
        }))
        .filter((variant) => variant.price > 0);
};

/* ================= CREATE PRODUCT ================= */

router.post("/", async (req, res) => {
    try {
        const {
            name,
            category,
            type,
            price,
            image,
            description,
            variants,
            isActive,
        } = req.body;

        if (!name || !category) {
            return res.status(400).json({
                message: "Name and category are required",
            });
        }

        const cleanedVariants = cleanVariants(variants);

        const finalPrice = cleanedVariants.length
            ? cleanedVariants[0].price
            : Number(
                String(price || 0).replace(/[^0-9.]/g, "")
            );

        if (!finalPrice || finalPrice <= 0) {
            return res.status(400).json({
                message:
                    "Enter a valid product price or variant price",
            });
        }

        const newProduct = await Product.create({
            name: String(name).trim(),
            category,
            type: String(type || "").trim(),
            price: finalPrice,
            image: image || "",
            description: String(description || "").trim(),
            variants: cleanedVariants,
            isActive:
                isActive !== undefined ? isActive : true,
        });

        return res.status(201).json({
            message: "Product created successfully",
            data: newProduct,
        });
    } catch (error) {
        return res.status(400).json({
            message: "Product creation failed",
            error: error.message,
        });
    }
});

/* ================= GET ALL PRODUCTS ================= */

router.get("/", async (req, res) => {
    try {
        const { category } = req.query;

        const filter = {};

        if (category) {
            filter.category = category;
        }

        const products = await Product.find(filter).sort({
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

/* ================= GET ONE PRODUCT ================= */

router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
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

/* ================= UPDATE PRODUCT ================= */

router.put("/:id", async (req, res) => {
    try {
        const {
            name,
            category,
            type,
            price,
            image,
            description,
            variants,
            isActive,
        } = req.body;

        const updateData = {};

        if (name !== undefined) {
            updateData.name = String(name).trim();
        }

        if (category !== undefined) {
            updateData.category = category;
        }

        if (type !== undefined) {
            updateData.type = String(type).trim();
        }

        if (image !== undefined) {
            updateData.image = image;
        }

        if (description !== undefined) {
            updateData.description =
                String(description).trim();
        }

        if (isActive !== undefined) {
            updateData.isActive = isActive;
        }

        if (Array.isArray(variants)) {
            const cleanedVariants =
                cleanVariants(variants);

            updateData.variants = cleanedVariants;

            if (cleanedVariants.length) {
                updateData.price =
                    cleanedVariants[0].price;
            } else if (price !== undefined) {
                updateData.price =
                    Number(
                        String(price).replace(
                            /[^0-9.]/g,
                            ""
                        )
                    ) || 0;
            }
        } else if (price !== undefined) {
            updateData.price =
                Number(
                    String(price).replace(
                        /[^0-9.]/g,
                        ""
                    )
                ) || 0;
        }

        const updatedProduct =
            await Product.findByIdAndUpdate(
                req.params.id,
                updateData,
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

        return res.status(200).json({
            message:
                "Product updated successfully",
            data: updatedProduct,
        });
    } catch (error) {
        return res.status(400).json({
            message: "Product update failed",
            error: error.message,
        });
    }
});

/* ================= UPDATE VARIANTS ================= */

router.patch("/:id/variants", async (req, res) => {
    try {
        const { variants } = req.body;

        if (!Array.isArray(variants)) {
            return res.status(400).json({
                message:
                    "Variants must be an array",
            });
        }

        const cleanedVariants =
            cleanVariants(variants);

        const updateData = {
            variants: cleanedVariants,
        };

        if (cleanedVariants.length) {
            updateData.price =
                cleanedVariants[0].price;
        }

        const updatedProduct =
            await Product.findByIdAndUpdate(
                req.params.id,
                updateData,
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

        return res.status(200).json({
            message:
                "Product variants updated successfully",
            data: updatedProduct,
        });
    } catch (error) {
        return res.status(400).json({
            message:
                "Variant update failed",
            error: error.message,
        });
    }
});

/* ================= DELETE PRODUCT ================= */

router.delete("/:id", async (req, res) => {
    try {
        const deletedProduct =
            await Product.findByIdAndDelete(
                req.params.id
            );

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        return res.status(200).json({
            message:
                "Product deleted successfully",
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