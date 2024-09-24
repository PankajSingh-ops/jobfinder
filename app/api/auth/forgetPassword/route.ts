import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import User from '@/models/User';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { email, newPassword } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword,10) ;

    // Update the user's password and clear the OTP from the database
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpCreatedAt = undefined;
    await user.save();

    return NextResponse.json({ message: 'Password reset successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
