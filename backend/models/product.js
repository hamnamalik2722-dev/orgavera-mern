const mongoose = require("mongoose");

/* ================= PRODUCT VARIANT ================= */

const variantSchema = new mongoose.Schema(
    {
        // Example: 100 ml, 150 ml, 200 ml, 1 kg
        label: {
            type: String,
            required: true,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        stock: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        _id: false,
    }
);

/* ================= PRODUCT ================= */

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            enum: [
                "best-sellers",
                "skin-care",
                "hair-care",
                "soaps",
                "ingredients",
                "classes",
            ],
        },

        type: {
            type: String,
            default: "",
            trim: true,
        },

        // Starting/default price.
        // When variants exist, Admin.jsx sends first variant price here.
        price: {
            type: Number,
            default: 0,
            min: 0,
        },

        image: {
            type: String,
            default: "",
            trim: true,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        // Different size / quantity + price options
        variants: {
            type: [variantSchema],
            default: [],
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Product", productSchema);