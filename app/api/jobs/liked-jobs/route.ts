import { NextRequest, NextResponse } from 'next/server'; // Use NextRequest and NextResponse
import ProfileUsers from '@/models/ProfileUsers';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongo';
import { authenticate } from '@/lib/jwtverify';

export async function POST(req: NextRequest) {
  // Authenticate the request
  const authResult = await authenticate(req);
  if (authResult) return authResult; // If authentication fails, return the error response

  try {
    await dbConnect();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).user.id;

    // Validate the userId from the token
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    // Extract jobId from the request body
    const { jobId } = await req.json();

    // Validate jobId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return NextResponse.json({ message: 'Invalid job ID' }, { status: 400 });
    }

    // Find the user's profile
    const profile = await ProfileUsers.findOne({ userId });

    if (!profile) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }

    // Use an empty array if likedJobs is undefined
    const likedJobs = profile.likedJobs || []; 

    // Check if the job is already liked
    const jobIndex = likedJobs.findIndex((id) => id.toString() === jobId);

    if (jobIndex === -1) {
      // Job is not liked, add it to the likedJobs array
      likedJobs.push(jobId); // Use Types.ObjectId correctly
    } else {
      // Job is already liked, remove it from the likedJobs array (unlike)
      likedJobs.splice(jobIndex, 1);
    }

    // Update the likedJobs field in the profile
    profile.likedJobs = likedJobs;

    // Save the updated profile
    await profile.save();

    return NextResponse.json({ message: 'Job like status updated successfully', likedJobs }, { status: 200 });
  } catch (error) {
    console.error('Error updating like status:', error);
    return NextResponse.json({ message: 'Error updating like status' }, { status: 500 });
  }
}
