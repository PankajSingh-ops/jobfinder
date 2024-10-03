import { NextRequest, NextResponse } from 'next/server';
import Company from '@/models/Company'; // Importing the Company model
import { authenticate } from '@/lib/jwtverify'; // JWT authentication function
import dbConnect from '@/lib/mongo'; // MongoDB connection

export async function POST(req: NextRequest) {
  try {
    // Authenticate the user using JWT
    const authResult = await authenticate(req);
    if (authResult) return authResult;

    await dbConnect(); // Connect to MongoDB

    const body = await req.json();
    
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { user } = req as any;
    const userId = user.id;

    const {
      companyLogo,
      companyName,
      description,
      totalEmployees,
      totalDepartments,
      workingCulture,
      foundedDate,
      headquarters,
      industry,
      website,
      contactEmail,
      socialLinks,
      subCompanyName,
    } = body;

    // Check for required fields
    if (!companyName) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Create a new company record
    const newCompany = await Company.create({
      userId:userId,
      companyLogo,
      companyName,
      description,
      totalEmployees,
      totalDepartments,
      workingCulture,
      foundedDate,
      headquarters,
      industry,
      website,
      contactEmail,
      socialLinks,
      subCompanyName,
      isActive: true,
    });

    return NextResponse.json(newCompany, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json({ message: 'Error creating company' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authResult = await authenticate(req);
    if (authResult) return authResult;

    await dbConnect(); // Connect to MongoDB

    const body = await req.json();
    const { companyId, companyLogo, companyName, description, totalEmployees, totalDepartments, workingCulture, foundedDate, headquarters, industry, website, contactEmail, socialLinks } = body;

    // Update the company details based on companyId
    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      {
        companyLogo,
        companyName,
        description,
        totalEmployees,
        totalDepartments,
        workingCulture,
        foundedDate,
        headquarters,
        industry,
        website,
        contactEmail,
        socialLinks,
        isActive: true,
      },
      { new: true } // Return the updated document
    );

    if (!updatedCompany) {
      return NextResponse.json({ message: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json(updatedCompany, { status: 200 });
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json({ message: 'Error updating company' }, { status: 500 });
  }
}
