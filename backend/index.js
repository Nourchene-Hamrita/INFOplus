import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import internsRoutes from "./routes/interns.js";
import eventsRoutes from "./routes/events.js";
import timetableRoutes from "./routes/timetables.js";
import formationRoutes from './routes/formations.js';
import emailRoutes from './routes/emailRoutes.js';
import reclamationRoutes from './routes/reclamation.js';
import paymentRoutes from './routes/paiement.js';
import resultRoutes from './routes/result.js';

import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();


dotenv.config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to mongoDB.");
    } catch (error) {
        throw error;
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!");
});


//middlewares

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/interns",internsRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/timetables",timetableRoutes);
app.use("/api/formations",formationRoutes);
app.use("/api/email",emailRoutes);
app.use("/api/reclamations",reclamationRoutes);
app.use("/api/payments",paymentRoutes);
app.use("/api/results",resultRoutes);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});


app.listen(8800, () => {
    connect();
    console.log("Backend server is running...");

});
//icxgJydQ2dEKmaha