"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const getDbUrl = () => {
    let url;
    switch (process.env.NODE_ENV) {
        case "production":
            url = "mongodb+srv://zoltraafrika:lZTzOJRwLWX1ir7b@cluster0.glhhs74.mongodb.net/";
            break;
        case "development":
            url = "mongodb://localhost:27017/kiurate";
            break;
        default:
            url = "mongodb://localhost:27017/kiurate";
            break;
    }
    return url;
};
async function connectDB() {
    mongoose_1.default.Promise = global.Promise;
    const connectionString = getDbUrl();
    if (!connectionString) {
        throw new Error("MONGO URI not found");
    }
    try {
        await mongoose_1.default.connect(connectionString);
        console.log("\n[MONGO]: Successfully connected to the database");
        console.log(`[MONGO]: Database URL: ${connectionString}\n`);
    }
    catch (err) {
        console.log(`\n[MONGO]: Could not connect to the database\n${err}\nExiting now...`);
    }
}
//# sourceMappingURL=database.js.map