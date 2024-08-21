import mongoose, {Schema} from "mongoose";


export interface IUser{
  email: string,
  passwordHash?: string,
  profilePicture?: string,
  authMethod: string,
  googleId?: string,
  name?:string,
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  passwordHash: {
    type: String,
    trim: true,
  },
  googleId: {
    type: String,
  },
  authMethod: {
    type: String,
    required: true,
    enum: ['local', 'google']
  },
  profilePicture: {
    type: String,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
  }
})

const User = mongoose.model<IUser>("Users", userSchema);
export default User;