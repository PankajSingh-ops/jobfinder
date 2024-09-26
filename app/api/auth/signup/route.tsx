// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import dbConnect from '@/lib/mongo';
import ProfileUsers from '@/models/ProfileUsers'; // Import ProfileUsers model


export async function POST(req: Request) {
    await dbConnect();
  
    const body = await req.json();
    console.log('Received body:', body); // Log the incoming request body
  
    const { email, password, rePassword, firstName, lastName, gender, companyName, agree, userType } = body;
  
    // Basic server-side validation
    if (!email || !password || !firstName || !lastName || !gender || !agree) {
      console.error('Validation failed: All fields are required');
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }
    if (password !== rePassword) {
      console.error('Validation failed: Passwords do not match');
      return NextResponse.json({ message: 'Passwords do not match' }, { status: 400 });
    }
  
    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.error('User already exists:', email);
        return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        gender,
        companyName: userType === 'employer' ? companyName : undefined,
        userType,
        agree,
      });
  
      // Save the user to the database
      await newUser.save();
      console.log('User created successfully:', newUser);
      const newProfile = new ProfileUsers({
        userId: newUser._id,
        email: newUser.email,
        fullname: `${newUser.firstName} ${newUser.lastName}`,
        country: '',
        experience: '',
        joinIn: '',
        linkedin: '',
        phone: '',
        bio: '',
        education: {
          class10: { degree: '', institution: '', year: '' },
          class12: { degree: '', institution: '', year: '' },
          graduation: { degree: '', institution: '', year: '' },
          postGraduation: { degree: '', institution: '', year: '' },
          diploma: { degree: '', institution: '', year: '' },
        },
      });

      // Save the profile to the database
      await newProfile.save();
      console.log('Profile created successfully:', newProfile);
  
      return NextResponse.json({ message: 'User and profile created successfully' }, { status: 201 });
  
    } catch (error) {
      console.error('Error during signup process:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }
  
