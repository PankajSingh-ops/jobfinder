import { NextRequest, NextResponse } from 'next/server';
import JobPost from '@/models/JobPost';
import dbConnect from '@/lib/mongo';

export async function POST(req: NextRequest) {
    try {
      await dbConnect();
  
      const filters = await req.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query: any = {};
  
      if (filters.industry && filters.industry.trim() !== "") {
        query.industryType = filters.industry;
      }
      if (filters.location && filters.location.trim() !== "") {
        query.location = { $regex: filters.location, $options: 'i' };
      }
      if (filters.jobType && filters.jobType.trim() !== "") {
        query.jobType = filters.jobType;
      }
      if (filters.experience && filters.experience.trim() !== "") {
        query.experience = filters.experience;
      }
      if (filters.employmentType && filters.employmentType.trim() !== "") {
        query.employmentType = filters.employmentType;
      }
      if (filters.salaryFrom && !isNaN(Number(filters.salaryFrom))) {
        query.salaryFrom = { $gte: Number(filters.salaryFrom) };
      }
      if (filters.salaryTo && !isNaN(Number(filters.salaryTo))) {
        query.salaryTo = { $lte: Number(filters.salaryTo) };
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
  
  