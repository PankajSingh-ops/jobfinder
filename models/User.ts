// models/User.ts
import mongoose, { Document, Model } from 'mongoose';

// Define the User interface
interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  companyName?: string; // Optional for job seekers
  userType: 'employer' | 'jobseeker'; // Enforced user types
  agree: boolean;
  otp?:string;
  otpCreatedAt?:Date;

}

// Create the User schema
const UserSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    default: undefined,
  },
  userType: {
    type: String,
    enum: ['employer', 'jobseeker'],
    required: true,
  },
  agree: {
    type: Boolean,
    required: true,
  },
  otp: { // Store the OTP
    type: String,
    default: undefined,
  },
  otpCreatedAt: { // Store when the OTP was created
    type: Date,
    default: undefined,
  },
}, { timestamps: true }); // Optional: includes createdAt and updatedAt fields

// Create and export the User model
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
