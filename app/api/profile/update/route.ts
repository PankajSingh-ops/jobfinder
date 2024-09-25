import { NextRequest, NextResponse } from 'next/server';
import multer from 'multer';
import dbConnect from '@/lib/mongo';
import ProfileUsers from '@/models/ProfileUsers';

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Middleware to handle file uploads
const multerMiddleware = upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'certificates', maxCount: 10 },
  { name: 'profilePic', maxCount: 1 },
]);

export const POST = async (req: NextRequest) => {
  // Connect to the database
  await dbConnect();

  // Create a promise to handle multer middleware
  return new Promise((resolve, reject) => {
    multerMiddleware(req as any, {} as any, async (err: any) => {
      if (err) {
        console.error('Multer error:', err);
        return reject(NextResponse.json({ message: 'Multer error' }, { status: 500 }));
      }

      try {
        const userId = req.body.userId; // Assume userId is sent in the body

        const profile = await ProfileUsers.findOne({ userId });
        if (!profile) {
          return resolve(NextResponse.json({ message: 'Profile not found' }, { status: 404 }));
        }

        // Accessing other fields in the request body
        const { email, fullname, country, joinIn, linkedin, phone, bio, education } = req.body;

        // Ensure you're handling experience correctly
        // Check if experience is in req.body and it is correctly parsed
        const experience = req.body.experience ? req.body.experience : profile.experience;

        profile.email = email || profile.email;
        profile.fullname = fullname || profile.fullname;
        profile.country = country || profile.country;
        profile.experience = experience; // Assign the experience
        profile.joinIn = joinIn || profile.joinIn;
        profile.linkedin = linkedin || profile.linkedin;
        profile.phone = phone || profile.phone;
        profile.bio = bio || profile.bio;

        // Update education fields
        if (education) {
          profile.education = {
            class10: {
              degree: education.class10?.degree || profile?.education?.class10?.degree,
              institution: education.class10?.institution || profile?.education?.class10?.institution,
              year: education.class10?.year || profile?.education?.class10?.year,
            },
            class12: {
              degree: education.class12?.degree || profile?.education?.class12?.degree,
              institution: education.class12?.institution || profile?.education?.class12?.institution,
              year: education.class12?.year || profile?.education?.class12?.year,
            },
            graduation: {
              degree: education.graduation?.degree || profile?.education?.graduation?.degree,
              institution: education.graduation?.institution || profile?.education?.graduation?.institution,
              year: education.graduation?.year || profile?.education?.graduation?.year,
            },
            postGraduation: {
              degree: education.postGraduation?.degree || profile?.education?.postGraduation?.degree,
              institution: education.postGraduation?.institution || profile?.education?.postGraduation?.institution,
              year: education.postGraduation?.year || profile?.education?.postGraduation?.year,
            },
            diploma: {
              degree: education.diploma?.degree || profile?.education?.diploma?.degree,
              institution: education.diploma?.institution || profile?.education?.diploma?.institution,
              year: education.diploma?.year || profile?.education?.diploma?.year,
            },
          };
        }

        // Handle file uploads
        if (req.files) {
          if (req.files['resume']) {
            profile.resume = req.files['resume'][0].buffer; // Store the resume buffer
          }
          if (req.files['certificates']) {
            profile.certificates = req.files['certificates'].map(file => file.buffer); // Store certificates buffers
          }
          if (req.files['profilePic']) {
            profile.profilePic = req.files['profilePic'][0].buffer; // Store profile picture buffer
          }
        }

        // Save updated profile
        await profile.save();
        return resolve(NextResponse.json({ message: 'Profile updated successfully', profile }, { status: 200 }));
      } catch (error) {
        console.error('Error updating profile:', error);
        return resolve(NextResponse.json({ message: 'Error updating profile', error }, { status: 500 }));
      }
    });
  });
};

// Disable Next.js default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};
