import { NextResponse } from 'next/server';
import ProfileUsers from '@/models/ProfileUsers'; // Adjust the path according to your folder structure
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongo';

// Route handler for GET /api/profile/:userId
export async function GET(req: Request, { params }: { params: { userData: string } }) {
  try {
    await dbConnect();

    const { userData } = params;
    console.log(userData);
    const userId=userData;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    const profile = await ProfileUsers.findOne({ userId });

    if (!profile) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ message: 'Error fetching profile' }, { status: 500 });
  }
}
