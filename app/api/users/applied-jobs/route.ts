import { NextRequest, NextResponse } from 'next/server';
import ProfileUsers from '@/models/ProfileUsers';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongo';
import { authenticate } from '@/lib/jwtverify';
import JobPost from '@/models/JobPost';

export async function POST(req: NextRequest) {
  const authResult = await authenticate(req);
  if (authResult) return authResult;

  try {
    await dbConnect();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).user.id;
    console.log(JobPost);
    

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    const profile = await ProfileUsers.findOne({ userId })?.populate("appliedJobs").populate("likedJobs");
    

    if (!profile) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Applied Jobs successfully', profile }, { status: 200 });
  } catch (error) {
    console.error('Error finding applied jobs:', error);
    return NextResponse.json({ message: 'Error finding applied jobs' }, { status: 500 });
  }
}
