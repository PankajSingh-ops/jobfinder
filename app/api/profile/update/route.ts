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
  const formFields: { [key: string]: any } = {};

  formData.forEach((value, key) => {
    const match = key.match(/interests\[(\d+)\]/);
    if (match) {
      const index = match[1];
      formFields.interests = formFields.interests || [];
      formFields.interests[parseInt(index)] = value;
    } else {
      formFields[key] = value;
    }
  });

  return formFields;
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await parseFormData(req);
    
    // Use optional chaining to avoid destructuring errors
    const {
      userId,
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
      class10_degree,
      class10_institution,
      class10_year,
      class12_degree,
      class12_institution,
      class12_year,
      graduation_degree,
      graduation_institution,
      graduation_year,
      postGraduation_degree,
      postGraduation_institution,
      postGraduation_year,
      diploma_degree,
      diploma_institution,
      diploma_year,
      dob,
      lovesTravelling,
      lovesOfficeParties,
      softSkills = {}, // Provide a default empty object
      ITSkills = [],    // Provide a default empty array
      interests = [],   // Provide a default empty array
    } = body;

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const profile = await ProfileUsers.findOne({ userId });
    if (!profile) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }

    // Update profile fields
    profile.email = email || profile.email;
    profile.fullname = fullname || profile.fullname;
    profile.country = country || profile.country;
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
    profile.dob = dob || profile.dob;
    profile.lovesTravelling = lovesTravelling || profile.lovesTravelling;
    profile.lovesOfficeParties = lovesOfficeParties || profile.lovesOfficeParties;

    // Handle education
    profile.education = {
      class10: {
        degree: class10_degree || "",
        institution: class10_institution || "",
        year: class10_year || "",
      },
      class12: {
        degree: class12_degree || "",
        institution: class12_institution || "",
        year: class12_year || "",
      },
      graduation: {
        degree: graduation_degree || "",
        institution: graduation_institution || "",
        year: graduation_year || "",
      },
      postGraduation: {
        degree: postGraduation_degree || "",
        institution: postGraduation_institution || "",
        year: postGraduation_year || "",
      },
      diploma: {
        degree: diploma_degree || "",
        institution: diploma_institution || "",
        year: diploma_year || "",
      }
    };

    // Handle files
    if (body.resume) {
      profile.resume = body.resume; // Store Base64 string
    }

    if (body.certificates) {
      const certificates = Array.isArray(body.certificates) ? body.certificates : [body.certificates];
      profile.certificates = certificates.map((cert, index) => ({
        cert, // Store Base64 string
        name: `certificate-${index + 1}.pdf`, // Naming convention
      }));
    }

    if (body.profilePic) {
      profile.profilePic = body.profilePic; // Store Base64 string
    }

    // Handle IT skills
    if (ITSkills && Array.isArray(ITSkills)) {
      const itSkillsArray: ITSkill[] = ITSkills.map((itSkill) => ({
        skill: itSkill.skill || "",
        experienceMonths: parseInt(itSkill.experienceMonths?.toString() || "0") || 0,
        experienceYears: parseInt(itSkill.experienceYears?.toString() || "0") || 0,
      }));

      profile.ITSkills = itSkillsArray;
    }

    // Update Soft Skills
    if (softSkills && typeof softSkills === 'object') {
      const softSkillsObject: { [key: string]: number } = {};
      
      Object.entries(softSkills).forEach(([skill, value]) => {
        softSkillsObject[skill] = parseInt(value as string) || 0; // Ensure value is a number
      });

      profile.softSkills = softSkillsObject;
    }

    profile.interests = interests;


    // Save updated profile
    await profile.save();

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to update profile'}, { status: 500 });
  }
}
