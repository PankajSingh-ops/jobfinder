import { NextResponse } from 'next/server';
import ProfileUsers from '@/models/ProfileUsers';
import dbConnect from '@/lib/mongo';
import { NextRequest } from 'next/server';

interface ITSkill {
  skill: string;
  experienceMonths: number;
  experienceYears: number;
}


async function parseFormData(req: NextRequest) {
  const formData = await req.formData();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formFields: { [key: string]:any } = {};

  formData.forEach((value, key) => {
    formFields[key] = value;
  });

  return formFields;
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await parseFormData(req);

    const userId = body.userId;
    console.log(body, "body");
    

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const profile = await ProfileUsers.findOne({ userId });
    if (!profile) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }

    const {
      email,
      fullname,
      country,
      joinIn,
      linkedin,
      phone,
      bio,
      maritalStatus,
      category,
      differentlyAbled,
      careerBreak,
      permanentAddress,
      postalOffice,
      hometown,
      pincode,
      education,
      softSkills: {}, // Initialize softSkills
  ITSkills: [], // Initialize ITSkills
    } = body;    const experience = body.experience ? body.experience : profile.experience;

    profile.email = email || profile.email;
    profile.fullname = fullname || profile.fullname;
    profile.country = country || profile.country;
    profile.experience = experience;
    profile.joinIn = joinIn || profile.joinIn;
    profile.linkedin = linkedin || profile.linkedin;
    profile.phone = phone || profile.phone;
    profile.bio = bio || profile.bio;
    profile.maritalStatus = maritalStatus || profile.maritalStatus;
    profile.category = category || profile.category;
    profile.differentlyAbled = differentlyAbled !== undefined ? differentlyAbled : profile.differentlyAbled;
    profile.careerBreak = careerBreak !== undefined ? careerBreak : profile.careerBreak;
    profile.permanentAddress = permanentAddress || profile.permanentAddress;
    profile.postalOffice = postalOffice || profile.postalOffice;
    profile.hometown = hometown || profile.hometown;
    profile.pincode = pincode || profile.pincode;

    if (education) {
      profile.education = {
        class10: {
          degree: education.class10_degree || profile?.education?.class10?.degree,
          institution: education.class10_institution || profile?.education?.class10?.institution,
          year: education.class10_year || profile?.education?.class10?.year,
        },
        class12: {
          degree: education.class12_degree || profile?.education?.class12?.degree,
          institution: education.class12_institution || profile?.education?.class12?.institution,
          year: education.class12_year || profile?.education?.class12?.year,
        },
        graduation: {
          degree: education.graduation_degree || profile?.education?.graduation?.degree,
          institution: education.graduation_institution || profile?.education?.graduation?.institution,
          year: education.graduation_year || profile?.education?.graduation?.year,
        },
        postGraduation: {
          degree: education.postGraduation_degree || profile?.education?.postGraduation?.degree,
          institution: education.postGraduation_institution || profile?.education?.postGraduation?.institution,
          year: education.postGraduation_year || profile?.education?.postGraduation?.year,
        },
        diploma: {
          degree: education.diploma_degree || profile?.education?.diploma?.degree,
          institution: education.diploma_institution || profile?.education?.diploma?.institution,
          year: education.diploma_year || profile?.education?.diploma?.year,
        },
      };
    }

    // Handle Base64 files instead of using multer
    if (body.resume) {
      profile.resume = body.resume; // Store Base64 string
    }

    if (body.certificates) {
      const certificates = Array.isArray(body.certificates) ? body.certificates : [body.certificates];
    
      profile.certificates = certificates.map((cert, index) => ({
        cert: cert, // Store Base64 string
        name: `certificate-${index + 1}.pdf`, // Or any naming convention
      }));
    }

    if (body.profilePic) {
      profile.profilePic = body.profilePic; // Store Base64 string
    }
   // Update IT Skills
// Update IT Skills
// Process IT Skills
if (body.ITSkills && Array.isArray(body.ITSkills)) {
  console.log(body.ITSkills, "itskills");
  
  const itSkillsArray: ITSkill[] = body.ITSkills.map((itSkill) => ({
    skill: itSkill.skill || "",  // Default to an empty string if skill is not provided
    experienceMonths: parseInt(itSkill.experienceMonths?.toString() || "0") || 0, // Ensure it's a number
    experienceYears: parseInt(itSkill.experienceYears?.toString() || "0") || 0,   // Ensure it's a number
  }));
  
  profile.ITSkills = itSkillsArray;
} else {
  console.log("No IT skills found");
}

// Update Soft Skills
if (body.softSkills && typeof body.softSkills === 'object') {
  console.log(body.softSkills, "softskills");
  
  const softSkillsObject: { [key: string]: number } = {};
  
  Object.entries(body.softSkills).forEach(([skill, value]) => {
    softSkillsObject[skill] = parseInt(value as string) || 0; // Ensure value is a number
  });
  
  profile.softSkills = softSkillsObject; // Assign the object to profile.softSkills
} else {
  console.log("No soft skills found");
}

    await profile.save();
    return NextResponse.json({ message: 'Profile updated successfully', profile }, { status: 200 });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ message: 'Error updating profile', error }, { status: 500 });
  }
}
