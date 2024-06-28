import mongoose, {Schema} from "mongoose";

const user = new Schema({
  email: {
    type: String, 
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
})

const User = mongoose.model("Users", user);
export default User;