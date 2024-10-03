import mongoose, { Document, Model } from 'mongoose';

interface IEducation {
  degree?: string;
  institution?: string;
  year?: string;
}

interface ICertificate {
  cert: string; // Store file path or Base64 string
  name: string; // Store original file name
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
  gender?:string;
  bio?: string;
  resume?: string; // Handle as needed (Base64 or file path)
  certificates?: ICertificate[]; // Store file paths and names
  profilePic?: string; // Handle as needed (Base64 or file path)
  maritalStatus?: string; // New field
  category?: string; // New field
  differentlyAbled?: string; // New field
  careerBreak?: string; // New field
  permanentAddress?: string; // New field
  postalOffice?: string; // New field
  hometown?: string; // New field
  pincode?: string; // New field
  dob?: Date; // New field for date of birth
  lovesTravelling?: string; // New field for travelling interest
  lovesOfficeParties?: string; // New field for office party interest
  softSkills?: { [key: string]: number }; // Updated type
  ITSkills?: { skill: string; experienceMonths: number; experienceYears: number }[]; // Updated type
  likedJobs?: mongoose.Schema.Types.ObjectId[]; // Array of liked job IDs
  appliedJobs?: mongoose.Schema.Types.ObjectId[]; // Array of liked job IDs
  education?: {
    class10?: IEducation;
    class12?: IEducation;
    graduation?: IEducation;
    postGraduation?: IEducation;
    diploma?: IEducation;
  };
  interests?: string[]; // New field for interests
}

const ProfileUsersSchema = new mongoose.Schema<IProfileUsers>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  email: String,
  gender:String,
  fullname: String,
  country: String,
  experience: String,
  joinIn: String,
  linkedin: String,
  phone: String,
  bio: String,
  resume: String, // Store the file path as string or Base64
  certificates: [
    {
      cert: String, // Store the file path or Base64
      name: String, // Store the original file name
    },
  ],
  profilePic: String, // Store the file path as string or Base64
  maritalStatus: String, // New field
  category: String, // New field
  differentlyAbled: String, // New field
  careerBreak: String, // New field
  permanentAddress: String, // New field
  postalOffice: String, // New field
  hometown: String, // New field
  pincode: String, // New field
  dob: Date, // New field for date of birth
  lovesTravelling: String,
  lovesOfficeParties: String,
  likedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobPost',
    },
  ],
  appliedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobPost',
    },
  ],
  softSkills: {
    type: Map,
    of: Number,
  },
  ITSkills: [
    {
      skill: String,
      experienceMonths: Number,
      experienceYears: Number,
    },
  ],
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
  interests: [{ type: String }], // New field for interests
}, { timestamps: true });

const ProfileUsers: Model<IProfileUsers> = mongoose.models.ProfileUsers || mongoose.model<IProfileUsers>('ProfileUsers', ProfileUsersSchema);
export default ProfileUsers;
