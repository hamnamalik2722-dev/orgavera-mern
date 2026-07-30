const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    productName: {
        type: String,
        required: true
    },

    quantity: {
        type: Number,
        default: 1
    },

    totalPrice: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Order", orderSchema);