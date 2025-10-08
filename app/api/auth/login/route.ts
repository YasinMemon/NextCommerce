import { emailVerificationLink } from "@/email/emailVarificationLink";
import { dbConnect } from "@/lib/dbConnection";
import { generateOtp } from "@/lib/helperFunctions";
import { sendMail } from "@/lib/sendMail";
import { zodSchema } from "@/lib/zodSchema";
import OtpModel from "@/models/otpModel";
import UserModel from "@/models/userModel";
import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server"
import z from "zod";
import { otpEmail } from "@/email/otpEmail.js";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const payload = await request.json();

        const validationSchema = zodSchema.pick({
            email: true,
        }).extend({
            password: z.string()
        });

        const validateSchema = validationSchema.safeParse(payload);

        if (!validateSchema.success) {
            return NextResponse.json({ message: 'Invalid request data', errors: validateSchema.error }, { status: 400 });
        }

        const { email, password } = validateSchema.data;

        const user = await UserModel.findOne({ deletedAt: null, email }).select('+password');

        if (!user) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
        }
        
        if (!user.isEmailVerified) {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new SignJWT({ userId: user._id.toString() })
                    .setIssuedAt()
                    .setExpirationTime("1h")
                    .setProtectedHeader({ alg: 'HS256' })
                    .sign(secret)
        
                sendMail("Verify Your Email", email, emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`))  
            return NextResponse.json({ message: 'Email not verified. A new verification email has been sent.' }, { status: 403 });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
        }

        await OtpModel.deleteMany({ email })

        const otp = generateOtp();

        const otpEntry = new OtpModel({ email, otp });

        await otpEntry.save();

        const otpEmailStatus = await sendMail("Your Login OTP", email, otpEmail(otp));

        if (!otpEmailStatus.success) {
            return NextResponse.json({ message: 'Failed to send OTP email' }, { status: 500 });
        }

        return NextResponse.json({ message: 'OTP sent to email', email }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}