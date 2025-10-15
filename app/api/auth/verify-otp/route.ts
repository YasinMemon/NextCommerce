import { dbConnect } from "@/lib/dbConnection";
import { zodSchema } from "@/lib/zodSchema";
import OtpModel from "@/models/otpModel";
import UserModel from "@/models/userModel";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const payload = await request.json();
    const validationSchema = zodSchema.pick({
        otp: true,
        email: true,
    })

    const validatedData = validationSchema.safeParse(payload);
    if (!validatedData.success) {
        return NextResponse.json({ message: 'Invalid input', errors: validatedData.error }, { status: 400 });
    }

    const { otp, email } = validatedData.data;

    // otp verification logic here
    const getOtpData = await OtpModel.findOne({ email, otp });
    if (!getOtpData) {
        return NextResponse.json({ message: 'Invalid OTP or email' }, { status: 400 });
    }

    const getUser = await UserModel.findOne({ deletedAt: null, email });
    if (!getUser) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const loggedInUserData = {
        _id: getUser._id,
        role: getUser.role,
        name: getUser.name,
        avatar: getUser.avatar,
        email: getUser.email,
   }

   const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
   const token = await new SignJWT(loggedInUserData)
   .setProtectedHeader({ alg: 'HS256' })
   .setIssuedAt()
   .setExpirationTime('7d')
   .sign(secret);

   const cookieStore = await cookies();

   cookieStore.set({
    name: 'access_token',
    value: token,
    httpOnly: process.env.NODE_ENV === 'production',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
   })

   await getOtpData.deleteOne();
//    getUser.isEmailVerified = true;
//    await getUser.save();

    return NextResponse.json({ message: 'OTP verified successfully', user: loggedInUserData  }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
  }
}
