import UserModel from "@/models/userModel";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json({ message: 'Token is required' }, { status: 400 });
        }

        // Here you would typically verify the token with your database

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const decoded = await jwtVerify(token, secret);
        const userId = decoded.payload.userId;

        const user = await UserModel.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        user.isVerified = true;
        await user.save();

        return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });  
    } 
}