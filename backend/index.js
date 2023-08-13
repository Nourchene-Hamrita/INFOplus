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
import assignmentRoutes from './routes/assignments.js';

import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();


dotenv.config();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:8081",
    },
});
// Set up the io instance to be accessible throughout the application
app.set('io', io);


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

let onlineUsers = [];

const addNewUser = (username, socketId) => {
    !onlineUsers.some((user) => user.username === username) &&
        onlineUsers.push({ username, socketId });
};

const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

 export const getUser = (username) => {
    return onlineUsers.find((user) => user.username === username);
};

io.on("connection", (socket) => {
    socket.on("newUser", (username) => {
        addNewUser(username, socket.id);
    });

    // socket.on("sendNotification", async ({ senderName, receiverName, type }) => {
    //     const receiver = getUser(receiverName);
    //     if (receiver) {
    //         // Save the notification to the database (if needed)
    //         // This is where you can add your database integration logic

    //         io.to(receiver.socketId).emit("getNotification", {
    //             senderName,
    //             type,
    //         });
    //     }
    // });

    socket.on("disconnect", () => {
        removeUser(socket.id);
    });
});



//middlewares

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/interns", internsRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/timetables", timetableRoutes);
app.use("/api/formations", formationRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/reclamations", reclamationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/assignments", assignmentRoutes);

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


// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    connect();
    console.log(`Server is running on port ${PORT}`);
});
//icxgJydQ2dEKmaha