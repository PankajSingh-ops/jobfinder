import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/jwtverify'; // JWT authentication function
import dbConnect from '@/lib/mongo'; // MongoDB connection
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const authResult = await authenticate(req);
    if (authResult) return authResult;

    await dbConnect();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userType = (req as any).user.userType;
    

if(userType==="admin"){
    const { page = 1, limit = 10 } = await req.json();

    const currentPage = parseInt(page as string, 10) || 1;
    const itemsPerPage = parseInt(limit as string, 10) || 10;

    const skip = (currentPage - 1) * itemsPerPage;
    const users = await User.find()
      .skip(skip)
      .limit(itemsPerPage);

    // Get the total number of users to calculate total pages
    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / itemsPerPage);

    if (!users || users.length === 0) {
      return NextResponse.json({ message: 'Users not found' }, { status: 404 });
    }

    return NextResponse.json({ users, totalPages }, { status: 200 });
}else{
    return NextResponse.json({ message: 'You have no access' }, { status: 500 });
}
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest) {
    try {
      const authResult = await authenticate(req);
      if (authResult) return authResult;
  
      await dbConnect();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userType = (req as any).user.userType;
  
      if (userType === 'admin') {
        const { userId } = await req.json(); // Extract the userId from the request body
  
        const user = await User.findByIdAndDelete(userId);
  
        if (!user) {
          return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
  
        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
      } else {
        return NextResponse.json({ message: 'You have no access to delete users' }, { status: 403 });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      return NextResponse.json({ message: 'Error deleting user' }, { status: 500 });
    }
  }
