import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    unique: true,
  },
  password: String,
  googleId: String,
});

const User = mongoose.model("User", usersSchema);
export { User };
