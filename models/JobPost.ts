import mongoose, { Schema, Document, Model } from 'mongoose';

interface IJobPost extends Document {
  jobTitle: string;
  jobDescription: string;
  experience: string;
  salaryFrom: string;
  salaryTo: string;
  jobType: string;
  location: string;
  genderPreference: string;
  openings: string;
  joiningTime: string;
  requirements: string;
  itSkills: string;
  role: string;
  industryType: string;
  education: string;
  workingDays: string;
  jobProfileUrl: string;
  employmentType:string;
  profileId: mongoose.Schema.Types.ObjectId; // Reference to ProfileUsers
  usersId: mongoose.Schema.Types.ObjectId[]; // Array of user IDs, referencing ProfileUsers
}

const JobPostSchema: Schema = new Schema({
  jobTitle: { type: String, required: true },
  jobDescription: { type: String},
  experience: { type: String, required: true },
  salaryFrom: { type: String, required: true },
  salaryTo: { type: String, required: true },
  jobType: { type: String, required: true },
  location: { type: String, required: true },
  genderPreference: { type: String },
  openings: { type: String, required: true },
  joiningTime: { type: String, required: true },
  requirements: { type: String },
  itSkills: { type: String },
  role: { type: String, required: true },
  industryType: { type: String, required: true },
  education: { type: String, required: true },
  workingDays: { type: String, required: true },
  employmentType: {type: String},
  jobProfileUrl: { type: String },
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProfileUsers',
    required: true,
  },
  usersId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProfileUsers',
    },
  ],
}, { timestamps: true });

const JobPost: Model<IJobPost> = mongoose.models.JobPost || mongoose.model<IJobPost>('JobPost', JobPostSchema);

export default JobPost;
