import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    const url = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB}`;
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("CONNECT_WITH_MONGO_DB");
  } catch (error) {
    console.error("CONNECT_WITH_MONGO_DB_ERROR: ", error);
  }
};

connectMongoDB();
