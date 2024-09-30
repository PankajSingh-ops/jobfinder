import { NextRequest, NextResponse } from 'next/server';
import JobPost from '@/models/JobPost';
import { authenticate } from '@/lib/jwtverify';
import dbConnect from '@/lib/mongo';

export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticate(req);
    if (authResult) return authResult;

    await dbConnect();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { user } = req as any;
    const userId = user.id;

    const jobPosts = await JobPost.find({ profileId: userId });

    if (!jobPosts || jobPosts.length === 0) {
      return NextResponse.json({ message: 'No job posts found for this user' }, { status: 404 });
    }

    return NextResponse.json(jobPosts, { status: 200 });
  } catch (error) {
    console.error('Error fetching job posts:', error);
    return NextResponse.json({ message: 'Error fetching job posts' }, { status: 500 });
  }
}
