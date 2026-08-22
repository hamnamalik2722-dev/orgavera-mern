const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
    {
        size: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        stock: { type: Number, default: 0, min: 0 },
    },
    { _id: false }
);

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },

        category: {
            type: String,
            required: true,
            enum: ["skin-care", "hair-care", "soaps", "ingredients", "classes"],
        },

        type: { type: String, default: "", trim: true },
        price: { type: Number, default: 0, min: 0 },
        oldPrice: { type: Number, default: 0, min: 0 },
        image: { type: String, default: "" },
        description: { type: String, default: "", trim: true },
        ingredients: { type: String, default: "", trim: true },

        benefits: { type: [String], default: [] },
        methodOfUse: { type: [String], default: [] },
        variants: { type: [variantSchema], default: [] },

        isBestSeller: { type: Boolean, default: false },
        bestSellerBadge: { type: String, default: "", trim: true },
        bestSellerOrder: { type: Number, default: 0 },

        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
