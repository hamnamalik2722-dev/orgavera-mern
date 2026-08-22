const express = require("express");
const Product = require("../models/product");

const router = express.Router();

/* =====================================================
   HELPERS
===================================================== */

const normalizeVariants = (variants) => {
    if (!Array.isArray(variants)) return [];

    return variants
        .map((variant) => ({
            // Admin panel label bheje ya size — dono support honge
            size: String(variant.size || variant.label || "").trim(),
            price: Number(variant.price) || 0,
            stock: Number(variant.stock) || 0,
        }))
        .filter((variant) => variant.size);
};

const normalizeCategory = (category) => {
    const value = String(category || "").trim().toLowerCase();

    const aliases = {
        "best sellers": "best-sellers",
        "bestsellers": "best-sellers",
        "best-seller": "best-sellers",
        "best seller": "best-sellers",

        "skin care": "skin-care",
        "skincare": "skin-care",

        "hair care": "hair-care",
        "haircare": "hair-care",

        "soap": "soaps",
        "artisan soaps": "soaps",

        "cosmetic ingredients": "ingredients",

        "class": "classes",
        "book class": "classes",
    };

    return aliases[value] || value;
};


/* =====================================================
   CREATE PRODUCT
===================================================== */

router.post("/", async (req, res) => {
    try {
        const {
            name,
            category,
            type,
            price,
            oldPrice,
            image,
            description,
            ingredients,
            benefits,
            methodOfUse,
            variants,
            isBestSeller,
            bestSellerBadge,
            bestSellerOrder,
            isActive,
        } = req.body;

        if (!name || !category) {
            return res.status(400).json({
                message: "Name and category are required",
            });
        }

        const normalizedCategory = normalizeCategory(category);
        const normalizedVariants = normalizeVariants(variants);

        const newProduct = await Product.create({
            name: String(name).trim(),

            category: normalizedCategory,

            type: type || "",

            price: Number(price) || 0,

            oldPrice: Number(oldPrice) || 0,

            image: image || "",

            description: description || "",

            ingredients: ingredients || "",

            benefits: Array.isArray(benefits)
                ? benefits.filter(Boolean)
                : [],

            methodOfUse: Array.isArray(methodOfUse)
                ? methodOfUse.filter(Boolean)
                : [],

            variants: normalizedVariants,

            // Product category best-sellers ho to automatic
            // best seller bhi mark ho jayega
            isBestSeller:
                normalizedCategory === "best-sellers"
                    ? true
                    : Boolean(isBestSeller),

            bestSellerBadge: bestSellerBadge || "",

            bestSellerOrder:
                Number(bestSellerOrder) || 0,

            isActive:
                isActive !== undefined
                    ? Boolean(isActive)
                    : true,
        });

        return res.status(201).json({
            message: "Product created successfully",
            data: newProduct,
        });

    } catch (error) {
        console.error("CREATE PRODUCT ERROR:", error);

        return res.status(500).json({
            message: "Product creation failed",
            error: error.message,
        });
    }
});


/* =====================================================
   GET ALL PRODUCTS
===================================================== */

router.get("/", async (req, res) => {
    try {
        const { category, bestSeller } = req.query;

        const filter = {};

        if (category) {
            filter.category = normalizeCategory(category);
        }

        if (
            String(bestSeller).toLowerCase() === "true"
        ) {
            filter.isBestSeller = true;
        }

        const products = await Product.find(filter).sort({
            bestSellerOrder: 1,
            createdAt: -1,
        });

        return res.status(200).json({
            message: "Products found",
            data: products,
        });

    } catch (error) {
        console.error("GET PRODUCTS ERROR:", error);

        return res.status(500).json({
            message: "Unable to fetch products",
            error: error.message,
        });
    }
});


/* =====================================================
   GET BEST SELLER DEALS
===================================================== */

router.get("/best-sellers/deals", async (req, res) => {
    try {
        const products = await Product.find({
            $or: [
                { category: "best-sellers" },
                { isBestSeller: true },
            ],
            isActive: { $ne: false },
        }).sort({
            bestSellerOrder: 1,
            createdAt: -1,
        });

        return res.status(200).json({
            message: "Best seller deals found",
            data: products,
        });

    } catch (error) {
        console.error("BEST SELLERS ERROR:", error);

        return res.status(500).json({
            message: "Unable to fetch best seller deals",
            error: error.message,
        });
    }
});


/* =====================================================
   GET SINGLE PRODUCT
===================================================== */

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


/* =====================================================
   UPDATE PRODUCT
===================================================== */

router.put("/:id", async (req, res) => {
    try {
        const allowedFields = [
            "name",
            "category",
            "type",
            "price",
            "oldPrice",
            "image",
            "description",
            "ingredients",
            "benefits",
            "methodOfUse",
            "variants",
            "isBestSeller",
            "bestSellerBadge",
            "bestSellerOrder",
            "isActive",
        ];

        const updateData = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateData[field] =
                    req.body[field];
            }
        });


        /* CATEGORY */

        if (updateData.category !== undefined) {

            updateData.category =
                normalizeCategory(
                    updateData.category
                );

            if (
                updateData.category ===
                "best-sellers"
            ) {
                updateData.isBestSeller = true;
            }
        }


        /* PRICES */

        if (updateData.price !== undefined) {
            updateData.price =
                Number(updateData.price) || 0;
        }

        if (updateData.oldPrice !== undefined) {
            updateData.oldPrice =
                Number(updateData.oldPrice) || 0;
        }


        /* BEST SELLER ORDER */

        if (
            updateData.bestSellerOrder !== undefined
        ) {
            updateData.bestSellerOrder =
                Number(
                    updateData.bestSellerOrder
                ) || 0;
        }


        /* BEST SELLER BOOLEAN */

        if (
            updateData.isBestSeller !== undefined
        ) {
            updateData.isBestSeller =
                Boolean(
                    updateData.isBestSeller
                );
        }


        /* VARIANTS */

        if (updateData.variants !== undefined) {
            updateData.variants =
                normalizeVariants(
                    updateData.variants
                );
        }


        /* BENEFITS */

        if (
            updateData.benefits !== undefined &&
            !Array.isArray(
                updateData.benefits
            )
        ) {
            updateData.benefits = [];
        }


        /* METHOD OF USE */

        if (
            updateData.methodOfUse !== undefined &&
            !Array.isArray(
                updateData.methodOfUse
            )
        ) {
            updateData.methodOfUse = [];
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
        console.error(
            "UPDATE PRODUCT ERROR:",
            error
        );

        return res.status(400).json({
            message: "Product update failed",
            error: error.message,
        });
    }
});


/* =====================================================
   UPDATE VARIANTS
===================================================== */

router.patch(
    "/:id/variants",
    async (req, res) => {
        try {
            const { variants } = req.body;

            if (!Array.isArray(variants)) {
                return res
                    .status(400)
                    .json({
                        message:
                            "Variants must be an array",
                    });
            }


            const normalizedVariants =
                normalizeVariants(variants);


            const updatedProduct =
                await Product.findByIdAndUpdate(
                    req.params.id,
                    {
                        variants:
                            normalizedVariants,
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                );


            if (!updatedProduct) {
                return res
                    .status(404)
                    .json({
                        message:
                            "Product not found",
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
    }
);


/* =====================================================
   DELETE PRODUCT
===================================================== */

router.delete("/:id", async (req, res) => {
    try {
        const deletedProduct =
            await Product.findByIdAndDelete(
                req.params.id
            );


        if (!deletedProduct) {
            return res.status(404).json({
                message:
                    "Product not found",
            });
        }


        return res.status(200).json({
            message:
                "Product deleted successfully",
            data: deletedProduct,
        });

    } catch (error) {
        return res.status(400).json({
            message:
                "Invalid product ID",
            error: error.message,
        });
    }
});


module.exports = router;