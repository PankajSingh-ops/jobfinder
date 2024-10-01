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

    const body = await req.json();
    const {
      jobTitle,
      jobDescription,
      experience,
      salaryFrom,
      salaryTo,
      jobType,
      location,
      genderPreference,
      openings,
      joiningTime,
      requirements,
      itSkills,
      role,
      industryType,
      education,
      workingDays,
      employmentType,
      jobProfileUrl,
      companyId
    } = body;
    if (!jobTitle || !experience || !salaryFrom || !salaryTo || !jobType || !location || !openings || !joiningTime ||!itSkills || !role || !industryType || !education || !workingDays) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    const newJobPost = await JobPost.create({
      jobTitle,
      jobDescription,
      experience,
      salaryFrom,
      salaryTo,
      jobType,
      location,
      genderPreference,
      openings,
      joiningTime,
      requirements,
      itSkills,
      role,
      industryType,
      education,
      workingDays,
      jobProfileUrl,
      employmentType,
      profileId: userId,
      companyId,
      usersId: [],
    });
    return NextResponse.json(newJobPost, { status: 201 });
  } catch (error) {
    console.error('Error creating job post:', error);
    return NextResponse.json({ message: 'Error creating job post' }, { status: 500 });
  }
}
