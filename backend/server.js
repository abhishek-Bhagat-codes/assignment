const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Allow frontend requests during development
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

//Health check route
app.get("/api/health",(req,res)=>{
    res.json({
        status:"Ok",
        message:"Server is running fine"
    })
});

// API documentation
const swaggerUi = require("swagger-ui-express");
const apiDocs = require("./docs/apiDocs");

app.get("/api/docs.json", (req, res) => {
    res.json(apiDocs);
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(apiDocs, {
    customSiteTitle: "Task Management API Docs",
}));

// Import API routes
const authRouter = require("./routes/authRouter");
const main = require("./routes/main");

// importing middelware
const authenticate = require("./middleware/authenticate");

app.use("/api/v1/auth",authRouter);

// protacted endpointes 
app.use("/api/v1/protacted",authenticate,main);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});