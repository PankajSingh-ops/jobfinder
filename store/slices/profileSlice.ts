import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

interface SoftSkills {
  communication: number;
  leadership: number;
  problemSolving: number;
  workEthic: number;
  timeManagement: number;
  teamwork: number;
}

interface Education {
  class10: { degree: string; institution: string; year: number | null };
  class12: { degree: string; institution: string; year: number | null };
  graduation: { degree: string; institution: string; year: number | null };
  postGraduation: { degree: string; institution: string; year: number | null };
  diploma: { degree: string; institution: string; year: number | null };
}

interface ProfileState {
  _id:string;
  fullname: string;
  email: string;
  userId: string;
  gender: string;
  country: string;
  experience: string;
  joinIn: string;
  linkedin: string;
  lookingFor: string;
  phone: string;
  bio: string;
  dob: Date | null;
  maritalStatus: string;
  category: string;
  differentlyAbled: string;
  careerBreak: string;
  permanentAddress: string;
  postalOffice: string;
  hometown: string;
  pincode: string;
  lovesTravelling: string;
  lovesOfficeParties: string;
  interests: string[];
  softSkills: SoftSkills;
  ITSkills: Array<{ skill: string; experienceMonths: number; experienceYears: number }>;
  education: Education;
  likedJobs: string[];
  profilePic: string;
}

const initialState: ProfileState = {
  _id:'',
  fullname: '',
  email: '',
  userId: '',
  gender: '',
  country: '',
  experience: '',
  joinIn: '',
  linkedin: '',
  lookingFor: '',
  phone: '',
  bio: '',
  dob: null,
  maritalStatus: '',
  category: '',
  differentlyAbled: '',
  careerBreak: '',
  permanentAddress: '',
  postalOffice: '',
  hometown: '',
  pincode: '',
  lovesTravelling: '',
  lovesOfficeParties: '',
  interests: [],
  likedJobs: [],
  profilePic:'',
  softSkills: {
    communication: 0,
    leadership: 0,
    problemSolving: 0,
    workEthic: 0,
    timeManagement: 0,
    teamwork: 0,
  },
  ITSkills: [{ skill: '', experienceMonths: 0, experienceYears: 0 }],
  education: {
    class10: { degree: '', institution: '', year: null },
    class12: { degree: '', institution: '', year: null },
    graduation: { degree: '', institution: '', year: null },
    postGraduation: { degree: '', institution: '', year: null },
    diploma: { degree: '', institution: '', year: null },
  },
};

export const fetchProfileData = createAsyncThunk<ProfileState>(
  'profile/fetchProfileData',
  async () => {
    const token = Cookies.get('token');
    if (!token) {
      throw new Error('No token found');
    }
    const response = await axios.get('/api/profile/job-seeker', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });    
    return response.data;
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<ProfileState>) => {
      return { ...state, ...action.payload };
    },
    clearProfile: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileData.fulfilled, (state, action: PayloadAction<ProfileState>) => {
        return { ...state, ...action.payload };
      })
      .addCase(fetchProfileData.rejected, (state, action) => {
        console.error('Failed to fetch profile:', action.error.message);
      });
  },
});

export const { updateProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
