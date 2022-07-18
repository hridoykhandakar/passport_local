import mongoose from "mongoose";

const connectMongoose = () => {
  mongoose
    .connect("mongodb://localhost:27017/google")
    .then((e) => {
      console.log(`connected to mongodb: ${e.connection.host}`);
    })
    .catch((e) => {
      console.log(e);
    });
};

export { connectMongoose };
