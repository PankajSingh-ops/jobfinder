import { NextRequest, NextResponse } from 'next/server';
import JobPost from '@/models/JobPost';
import { authenticate } from '@/lib/jwtverify';
import dbConnect from '@/lib/mongo';

export async function POST(req: NextRequest) {
  try {
    const authResult = await authenticate(req);
    if (authResult) return authResult;

    await dbConnect();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { user } = req as any;
    const userId = user.id;

    // Extract limit and page from the request body
    const { limit, page } = await req.json();

    const jobPosts = await JobPost.find({ profileId: userId })
      .skip((page - 1) * limit) // Skip documents for pagination
      .limit(limit);

    const totalJobs = await JobPost.countDocuments({ profileId: userId });

    if (!jobPosts || jobPosts.length === 0) {
      return NextResponse.json({ message: 'No job posts found for this user' }, { status: 404 });
    }

    return NextResponse.json({ jobs: jobPosts, total: totalJobs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching job posts:', error);
    return NextResponse.json({ message: 'Error fetching job posts' }, { status: 500 });
  }
}
