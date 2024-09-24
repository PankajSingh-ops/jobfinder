import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import dbConnect from '@/lib/mongo';
import User from '@/models/User'; // Import your User model

// Handle POST request
export async function POST(req: NextRequest) {
  await dbConnect(); // Connect to the database

  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or your email service provider
      auth: {
        user: "9917pankaj.singh@gmail.com", // Type assertion
        pass: "whktrshjcvbltxmj", // Type assertion
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Your OTP for Password Reset',
      text: `Your OTP is ${otp}`,
    };

    // Send OTP via email
    await transporter.sendMail(mailOptions);

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Store the OTP and timestamp in the user document
    user.otp = otp;
    user.otpCreatedAt = new Date(); // Store current time
    await user.save(); // Save the updated user record

    // Respond with success message
    return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ message: 'Error sending OTP' }, { status: 500 });
  }
}


