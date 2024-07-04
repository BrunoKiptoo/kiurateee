import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const getDbUrl = () => {
  let url: string | undefined;

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

export async function connectDB() {
  mongoose.Promise = global.Promise;

  const connectionString = getDbUrl();

  if (!connectionString) {
    throw new Error("MONGO URI not found");
  }

  try {
    await mongoose.connect(connectionString);
    console.log("\n[MONGO]: Successfully connected to the database");
    console.log(`[MONGO]: Database URL: ${connectionString}\n`);
  } catch (err) {
    console.log(`\n[MONGO]: Could not connect to the database\n${err}\nExiting now...`);
  }
}
