import { NextRequest, NextResponse } from 'next/server';
import JobPost from '@/models/JobPost';
import dbConnect from '@/lib/mongo';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Extract filters from the request body
    const filters = await req.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    
    if (filters.industry) {
      query.industryType = filters.industry;
    }
    if (filters.location) {
      query.location = { $regex: filters.location, $options: 'i' }; // Case-insensitive search
    }
    if (filters.employmentType) {
      query.employmentType = filters.employmentType;
    }
    if (filters.salaryFrom) {
      query.salaryFrom = { $gte: Number(filters.salaryFrom) }; // Greater than or equal to
    }
    if (filters.salaryTo) {
      query.salaryTo = { $lte: Number(filters.salaryTo) }; // Less than or equal to
    }
    if (filters.jobType) {
      query.jobType = filters.jobType;
    }
    if (filters.experience) {
      query.experience = filters.experience;
    }

    // Fetch the filtered job posts
    const jobPosts = await JobPost.find(query);
    
    if (!jobPosts || jobPosts.length === 0) {
      return NextResponse.json({ message: 'No job posts found' }, { status: 404 });
    }

    return NextResponse.json({ jobs: jobPosts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching job posts:', error);
    return NextResponse.json({ message: 'Error fetching job posts' }, { status: 500 });
  }
}
