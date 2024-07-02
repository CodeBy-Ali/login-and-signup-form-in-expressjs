import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
  email: {
    type: String, 
    unique: true,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  }
})

const User = mongoose.model("Users", userSchema);
export default User;