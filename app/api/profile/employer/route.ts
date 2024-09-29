import { NextRequest, NextResponse } from 'next/server'; // Use NextRequest and NextResponse
import ProfileUsers from '@/models/ProfileUsers';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongo';
import { authenticate } from '@/lib/jwtverify';

export async function GET(req: NextRequest) { // Use NextRequest instead of Request
  // Authenticate the request
  const authResult = await authenticate(req);
  if (authResult) return authResult; // If auth failed, return the error response

  try {
    await dbConnect();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).user.id;

    // Validate the userId from the token
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    // Fetch the user's profile
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
