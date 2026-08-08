const mongoose = require("mongoose");

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

        price: {
            type: Number,
            required: true,
        },

        image: {
            type: String,
            default: "",
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Product", productSchema);