import { NextRequest, NextResponse } from 'next/server';
import JobPost from '@/models/JobPost';
import { authenticate } from '@/lib/jwtverify';
import dbConnect from '@/lib/mongo';

interface Params {
  id: string; // Adjust type based on your use case
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    const authResult = await authenticate(req);
    if (authResult) return authResult;

    await dbConnect();
    const jobId = params.id;

    if (!jobId) {
      return NextResponse.json({ message: 'Job post ID is required' }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { user } = req as any;
    const userId = user.id;

    const jobPost = await JobPost.findOne({ _id: jobId, profileId: userId });

    if (!jobPost) {
      return NextResponse.json({ message: 'Job post not found or does not belong to the user' }, { status: 404 });
    }

    // Delete the job post
    await JobPost.deleteOne({ _id: jobId });

    return NextResponse.json({ message: 'Job post deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting job post:', error);
    return NextResponse.json({ message: 'Error deleting job post' }, { status: 500 });
  }
}
