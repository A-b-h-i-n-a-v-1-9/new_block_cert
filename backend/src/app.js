import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import eventRoutes from "./routes/events.js";
import registrationRoutes from "./routes/registrations.js";
import attendanceRoutes from "./routes/attendance.js";
import certificateRoutes from "./routes/certificates.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();

// CORS configuration
app.use(cors());

app.use(express.json());

// routes
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/certificates", certificateRoutes);

// Add a health check route
app.get("/api/health", (req, res) => {
    res.json({ 
        status: "OK", 
        message: "Backend is running",
        timestamp: new Date().toISOString()
    });
});

// Root route
app.get("/", (req, res) => {
    res.json({ 
        message: "Blockcerts Backend API",
        version: "1.0.0"
    });
});

// global error handler
app.use(errorHandler);

export default app;