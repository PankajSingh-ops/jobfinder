import { NextResponse } from 'next/server';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import dbConnect from '@/lib/mongo';

export async function POST(req: Request) {
    await dbConnect();

    const body = await req.json();
    console.log('Received body:', body); // Log the incoming request body
  
    const { email, password } = body;

    // Basic validation
    if (!email || !password) {
        console.error('Validation failed: Email and password are required');
        return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            console.error('User not found:', email);
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
        }

        // Compare the password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.error('Invalid password for email:', email);
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
        }

        const userData = {
            id: user._id,
            email: user.email,
            firstname: user.firstName,
            lastname: user.lastName,
            userType: user.userType,
            gender:user.gender,
            companyname: user.companyName,
        };

        console.log('Login successful for user:', email);
        return NextResponse.json({ message: 'Login successful', user: userData }, { status: 200 });

    } catch (error) {
        console.error('Error during login process:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
