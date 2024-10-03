import { Schema, model, Document, models } from 'mongoose';

// Define the TypeScript interface for your profile document
interface IAppliedJobProfile extends Document {
  fullname: string;
  email: string;
  phone: string;
  permanentAddress: string;
  profilePic?: string; // Optional
  pincode: string;
  additionalInfo?: string; // Optional
  resumeUrls?: string[]; // Optional
  profileId: Schema.Types.ObjectId; // Change to ObjectId
  jobId: Schema.Types.ObjectId; // Change to ObjectId
}

// Create the schema
const appliedJobProfileSchema = new Schema<IAppliedJobProfile>({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  permanentAddress: {
    type: String,
    required: false,
  },
  profilePic: {
    type: String,
    required: false,
  },
  pincode: {
    type: String,
    required: false,
  },
  additionalInfo: {
    type: String,
    required: false,
  },
  resumeUrls: {
    type: [String],
    required: false,
  },
  profileId: {
    type: Schema.Types.ObjectId, // Correctly defined as ObjectId
    ref: 'ProfileUsers', // Adjust reference to your actual User model name
    required: true,
  },
  jobId: {
    type: Schema.Types.ObjectId, // Correctly defined as ObjectId
    ref: 'JobPost', // Adjust reference to your actual AppliedJobs model name
    required: true,
  }
});

// Use models[modelName] to avoid the overwrite error
const AppliedJobsProfile = models.AppliedJobsProfile || model<IAppliedJobProfile>('AppliedJobsProfile', appliedJobProfileSchema);

export default AppliedJobsProfile;
