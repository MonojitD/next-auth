import mongoose from "mongoose";

export function connect() {
    try {
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log("MongoDB Connected !!")
        });

        connection.on('error', (error) => {
            console.log("MongoDB connection error. "+ error);
            process.exit();
        })
    } catch (error) {
        console.log("Failed to connect MongoDB !!", error)
    }
}