import { NextRequest, NextResponse } from 'next/server';
import Company from '@/models/Company'; // Import the Company model
import dbConnect from '@/lib/mongo'; // MongoDB connection

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Parse the request body to get the page number
    const body = await req.json();
    const id=body.id;
    console.log(id,"id");
    

  

    const companies = await Company.findById(id)

    if (!companies) {
      return NextResponse.json({ message: 'No companies details found for this page' }, { status: 404 });
    }

    return NextResponse.json({
      companies
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ message: 'Error fetching companies' }, { status: 500 });
  }
}