import mongoose, { Document, Schema } from "mongoose";

interface ICompanyRating {
  profileId: mongoose.Types.ObjectId;
  rating: number;
}

interface ICompany extends Document {
  userId: mongoose.Types.ObjectId;
  companyLogo: string;
  companyName: string;
  subCompanyName: string;
  description?: string;
  totalEmployees: number;
  totalDepartments: number;
  workingCulture: string[];
  ratings: ICompanyRating[];
  ratingCount: number; // Count of unique ratings
  foundedDate?: Date;
  headquarters: {
    city?: string;
    state?: string;
    country?: string;
  };
  industry?: string;
  website?: string;
  contactEmail?: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  isActive: boolean;
}

const companySchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    subCompanyName: {
      type: String,
      trim: true,
    },
    companyLogo: {
      type: String,
    },
    description: {
      type: String,
      trim: true,
    },
    totalEmployees: {
      type: Number,
      default: 0,
    },
    totalDepartments: {
      type: Number,
      default: 0,
    },
    workingCulture: {
      type: [String],
      default: [],
    },
    ratings: [
      {
        profileId: {
          type: mongoose.Types.ObjectId,
          ref: "ProfileUsers",
        },
        rating: {
          type: Number,
          min: 0,
          max: 5,
        },
      },
    ],
    ratingCount: {
      type: Number,
      default: 0,
    },
    foundedDate: {
      type: Date,
    },
    headquarters: {
      city: { type: String },
      state: { type: String },
      country: { type: String },
    },
    industry: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
    },
    socialLinks: {
      linkedin: { type: String },
      twitter: { type: String },
      facebook: { type: String },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite issue in development mode
const Company = mongoose.models.Company || mongoose.model<ICompany>('Company', companySchema);

export default Company;

