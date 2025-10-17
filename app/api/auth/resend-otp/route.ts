import { otpEmail } from "@/email/otpEmail";
import { dbConnect } from "@/lib/dbConnection";
import { generateOtp } from "@/lib/helperFunctions";
import { sendMail } from "@/lib/sendMail";
import { zodSchema } from "@/lib/zodSchema";
import OtpModel from "@/models/otpModel";
import UserModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server" 

export async function POST(request: NextRequest){
    try {
        await dbConnect();

        const payload = await request.json();
        const validationSchema = zodSchema.pick({
            email: true,
        });

        const validatedSchema = validationSchema.safeParse(payload);

        if(!validatedSchema.success){
            return NextResponse.json({ message: 'Invalid request data', errors: validatedSchema.error }, { status: 400 });
        }
        const { email } = validatedSchema.data;

        const getUser = await UserModel.findOne({ deletedAt: null, email });

        if(!getUser){
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        await OtpModel.deleteMany({ email })
        const otp = generateOtp();

        const newOtpData = new OtpModel({
            email, otp
        })

        await newOtpData.save();

        const otpSendStatus = await sendMail("Your login verification code", email, otpEmail(otp));

        if(!otpSendStatus){
            return NextResponse.json({ message: 'Failed to send OTP email' }, { status: 500 });
        }

        return NextResponse.json({ message: 'OTP has been resent to your email' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
    }
}