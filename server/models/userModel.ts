import mongoose, {Schema} from "mongoose";


interface IUser{
  email: string,
  passwordHash: string,
  profilePicture?: string,
}

const userSchema = new Schema<IUser>({
  email: {
    type: String, 
    unique: true,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    unique: true,
    trim: true,
  }
})

const User = mongoose.model<IUser>("Users", userSchema);
export default User;