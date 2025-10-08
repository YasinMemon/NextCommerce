import { dbConnect } from "@/lib/dbConnection";
import { zodSchema } from "@/lib/zodSchema";
import UserModel from "@/models/userModel";
import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { emailVerificationLink } from "../../../../email/emailVarificationLink";
import { sendMail } from "@/lib/sendMail";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const validateSchema = zodSchema.pick({
            fullName: true,
            email: true,
            password: true
        });

        const payload = await request.json()
        const { fullName, email, password } = payload
        const validateData = validateSchema.safeParse(payload);
        
        if (!validateData.success){
            return NextResponse.json({
                success: false,
                status: 401,
                message: "Invalid or missing input field",
                error: validateData.error
            });
        }

        // Registration logic here (e.g., save user to database)
        const existingUser = await UserModel.exists({email})
        if (existingUser) {
            return NextResponse.json({
                success: true,
                status: 409,
                message: "User already exist",
            })
        }

        const newUser = new UserModel({
            fullName,
            email,
            password
        });

        await newUser.save();

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new SignJWT({userId: newUser._id.toString()})
            .setIssuedAt()
            .setExpirationTime("1h")
            .setProtectedHeader({ alg: 'HS256' })
            .sign(secret)

        sendMail("Verify Your Email", email, emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`))  
        
        return NextResponse.json({
            success: true,
            status: 201,
            message: "User registered successfully. Please verify your email.",
        });
    } catch (err) {
        return NextResponse.json({
            success: false,
            status: 500,
            message: "Internal server error",
            error: err
        });
    }
}