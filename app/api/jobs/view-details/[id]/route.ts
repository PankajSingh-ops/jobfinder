import { NextRequest, NextResponse } from 'next/server';
import JobPost from '@/models/JobPost';
import Company from '@/models/Company'; // Ensure you are importing the Company model
import dbConnect from '@/lib/mongo';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect(); // Connect to the database
    console.log(Company);
    

    const id = params.id;

    if (!id) {
      return NextResponse.json({ message: 'Job ID is required' }, { status: 400 });
    }

    // Find the job post and populate the companyId
    const jobPost = await JobPost.findById(id).populate('companyId').populate('usersId');;

    if (!jobPost) {
      return NextResponse.json({ message: 'Job post not found' }, { status: 404 });
    }

    return NextResponse.json({ job: jobPost }, { status: 200 });
  } catch (error) {
    console.error('Error fetching job post:', error);
    return NextResponse.json({ message: 'Error fetching job post' }, { status: 500 });
  }
}
