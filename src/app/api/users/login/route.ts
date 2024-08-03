import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const {email, password} = reqBody;

        // Check if user is there
        const user = await User.findOne({email});

        if(!user) {
            return NextResponse.json({
                message: "User not found !",
                success: false,
            }, {status: 400})
        }

        // Check the password
        const validPassword = await bcryptjs.compare(password, user.password);
        if(!validPassword) {
            return NextResponse.json({
                message: "Invalid password !",
                success: false,
            }, {status: 400})
        }

        //Create token data
        const tokenData = {
            id: user._id,
            email: user.email,
            username: user.username
        }

        //Create the TOKEN
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1m"});

        const response =  NextResponse.json({
            message: "Login Successful !",
            success: true,
        })

        response.cookies.set(
            "token", 
            token, 
            {
                httpOnly: true
            }
        )

        return response;

        
    } catch (error: any) {
        return NextResponse.json({
            message: "Error while login" + error.message,
            status: 500,
            success: false,
        })
    }
}