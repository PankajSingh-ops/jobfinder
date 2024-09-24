import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import User from '@/models/User';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { email, otp } = await req.json();

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user || !user.otp) {
      return NextResponse.json({ message: 'User or OTP not found' }, { status: 404 });
    }

    if (user.otpCreatedAt) {
        const otpAge = Date.now() - user.otpCreatedAt.getTime();
        const otpExpirationTime = 10 * 60 * 1000; // 10 minutes in milliseconds
      
        // Check if the OTP is older than the expiration time
        if (otpAge > otpExpirationTime) {
          return NextResponse.json({ message: 'OTP has expired' }, { status: 400 });
        }
      } else {
        // Handle case where OTP was never set
        return NextResponse.json({ message: 'No OTP was generated' }, { status: 400 });
      }

    // Compare the OTP
    if (otp === user.otp) {
      // Clear the OTP and timestamp after successful verification
      user.otp = undefined;
      user.otpCreatedAt = undefined;
      await user.save();

      return NextResponse.json({ message: 'OTP verified successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
