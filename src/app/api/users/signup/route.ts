import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connect()

// Creating new user
export async function POST(request:NextRequest) {
    try {
        const reqBody = await request.json();
        const {username, email, password} = reqBody;
        
        console.log(reqBody);

        //Check if User is already exist
        const user = await User.findOne({email});
        if(user) {
            return NextResponse.json(
                {error: "User with this email already exists"},
                {status: 400}
            )
        }

        //Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();
        console.log(savedUser);

        //Send verification email
        await sendEmail({
            email,
            emailType: "VERIFY",
            userId: savedUser._id
        })

        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser
        });

    } catch (error: any) {
        return NextResponse.json(
            {
                message: "Error while signup" + error.message,
                success: false,
            },
            {status: 500}
        )
    }
}