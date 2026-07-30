const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const express = require("express");
const mongoose = require("mongoose");
const dns = require("node:dns");
require("dotenv").config();

const app = express();

// Node.js ko public DNS servers use karwa rahe hain
dns.setServers(["8.8.8.8", "1.1.1.1"]);

app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.get("/", (req, res) => {
    res.send("Welcome to ORGAVERA Backend");
});

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Database Connected");

        app.listen(PORT, () => {
            console.log(`Server Started on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database Connection Error:", error.message);
    });