import mongoose from "mongoose";
const mongodb_url = process.env.MONGODB_URL || "";

let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = {
        conn: null,
        promise: null
    }
}

export const dbConnect = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(mongodb_url, {
            dbName: "swiftMart",    
            bufferCommands: false
        }) 
    }

    cached.conn = await cached.promise;
    return cached.conn;
}