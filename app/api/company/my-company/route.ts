import { NextRequest, NextResponse } from 'next/server';
import Company from '@/models/Company'; // Import the Company model
import dbConnect from '@/lib/mongo'; // MongoDB connection
import { authenticate } from '@/lib/jwtverify';

export async function POST(req: NextRequest) {
  try {
    const authResult = await authenticate(req);
    if (authResult) return authResult;

    await dbConnect();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { user } = req as any;
    const userId = user.id;

    // Parse the request body to get the page number
    const body = await req.json();
    const page = body.page || 1;
    const limit = 12; // Number of companies per page
    const skip = (page - 1) * limit;

    // Get total count of companies
    const totalCompanies = await Company.countDocuments();
    const totalPages = Math.ceil(totalCompanies / limit);

    // Fetch companies for the requested page
    const companies = await Company.find({ userId }).skip(skip).limit(limit).lean();


    if (!companies || companies.length === 0) {
      return NextResponse.json({ message: 'No companies found for this page' }, { status: 404 });
    }

    return NextResponse.json({
      companies,
      totalPages,
      currentPage: page
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ message: 'Error fetching companies' }, { status: 500 });
  }
}