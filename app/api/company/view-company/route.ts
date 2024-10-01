import { NextRequest, NextResponse } from 'next/server';
import Company from '@/models/Company'; // Import the Company model
import { authenticate } from '@/lib/jwtverify'; // JWT authentication function
import dbConnect from '@/lib/mongo'; // MongoDB connection

export async function POST(req: NextRequest) {
  try {
    const authResult = await authenticate(req);
    if (authResult) return authResult;

    await dbConnect();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { user } = req as any;
    const userId = user.id;

    const company = await Company.find({ userId });

    if (!company) {
      return NextResponse.json({ message: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json({ message: 'Error fetching company' }, { status: 500 });
  }
}
