import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import AppliedJobsProfile from '@/models/AppliedJobs';
import ProfileUsers from '@/models/ProfileUsers';
import JobPost from '@/models/JobPost';


export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const { id } = params; // Job ID
    const body = await req.json();

    const {
      profileData: {
        fullname,
        email,
        phone,
        permanentAddress,
        profilePic,
        pincode,
        additionalInfo,
        resumeUrls,
        profileId // Reference to the user's profile
      }
    } = body;
    console.log(profileId, "bodyData");

    if (!profileId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create the new application
    const newApplication = new AppliedJobsProfile({
      fullname,
      email,
      phone,
      permanentAddress,
      profilePic,
      pincode,
      additionalInfo,
      resumeUrls,
      profileId,
      jobId: id
    });

    // Save the application
    await newApplication.save();
    const jobs = await JobPost.findById(id);
    if (!jobs) {
      return NextResponse.json({ error: 'Jobs not found' }, { status: 404 });
    }
    if (!jobs.usersId) {
      jobs.usersId = [];
    }
    
    jobs.usersId.push(newApplication._id); // Push the new job application ID
    await jobs.save();

    // Update the user's profile by adding the new job application to the appliedJobs array
    const profile = await ProfileUsers.findById(profileId);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    if (!profile.appliedJobs) {
      profile.appliedJobs = [];
    }
    
    profile.appliedJobs.push(newApplication.jobId); // Push the new job application ID
    await profile.save();


    return NextResponse.json({ message: 'Application submitted successfully', applicationId: newApplication._id }, { status: 201 });

  } catch (error) {
    console.error('Error submitting job application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
