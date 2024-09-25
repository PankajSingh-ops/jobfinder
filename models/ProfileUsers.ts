// models/ProfileUsers.ts
import mongoose, { Document, Model } from 'mongoose';

interface IEducation {
  degree?: string;
  institution?: string;
  year?: string;
}

interface IProfileUsers extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  email?: string;
  fullname?: string;
  country?: string;
  experience?: string;
  joinIn?: string;
  linkedin?: string;
  phone?: string;
  bio?: string;
  resume?: Buffer; // Handle as needed
  certificates?: Buffer[]; // Handle as needed
  profilePic?: Buffer; // Handle as needed
  education?: {
    class10?: IEducation;
    class12?: IEducation;
    graduation?: IEducation;
    postGraduation?: IEducation;
    diploma?: IEducation;
  };
}

const ProfileUsersSchema = new mongoose.Schema<IProfileUsers>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  email: String,
  fullname: String,
  country: String,
  experience: String,
  joinIn: String,
  linkedin: String,
  phone: String,
  bio: String,
  resume: Buffer,
  certificates: [Buffer],
  profilePic: Buffer,
  education: {
    class10: {
      degree: String,
      institution: String,
      year: String,
    },
    class12: {
      degree: String,
      institution: String,
      year: String,
    },
    graduation: {
      degree: String,
      institution: String,
      year: String,
    },
    postGraduation: {
      degree: String,
      institution: String,
      year: String,
    },
    diploma: {
      degree: String,
      institution: String,
      year: String,
    },
  },
}, { timestamps: true });

const ProfileUsers: Model<IProfileUsers> = mongoose.models.ProfileUsers || mongoose.model<IProfileUsers>('ProfileUsers', ProfileUsersSchema);
export default ProfileUsers;
