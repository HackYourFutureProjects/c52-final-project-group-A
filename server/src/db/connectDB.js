import mongoose from "mongoose";
import config from "../config.js";

const connectDB = () => mongoose.connect(config.MONGODB_URL);

export default connectDB;
