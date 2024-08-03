import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helpers/mailer";

connect()

// Finding user for reset password
export async function POST(request:NextRequest) {
    try {
        const reqBody = await request.json();
        const {email} = reqBody;

        //Check if User is exist or not
        const user = await User.findOne({email});

        if(!user) {
            return NextResponse.json(
                {error: "User with this email not found"},
                {status: 400}
            )
        }
        console.log(user);

        //Send verification email
        await sendEmail({
            email,
            emailType: "RESET",
            userId: user._id
        })

        return NextResponse.json({
            message: "Verification mail send to this email address.",
            success: true,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                message: "Error while finding email" + error.message,
                success: false,
            },
            {status: 500}
        )
    }
}