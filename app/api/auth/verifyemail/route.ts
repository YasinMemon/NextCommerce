import UserModel from "@/models/userModel";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ message: 'Token is required' }, { status: 400 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const decoded = await jwtVerify(token, secret);
    const userId = decoded.payload.userId;

    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    user.isEmailVerified = true;
    await user.save();

    return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
  }
}
