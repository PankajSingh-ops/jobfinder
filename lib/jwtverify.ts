import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export const authenticate = async (req: NextRequest) => {
  const authorization = req.headers.get('authorization');
  if (!authorization) {
    return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
  }
  const token = authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any).user = decoded;
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }
};
