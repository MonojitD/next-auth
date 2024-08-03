import { NextRequest, NextMiddleware, NextResponse } from "next/server";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        console.log(userId)
        const user = await User.findOne({_id: userId}).select("-password");

        return NextResponse.json({
            message: "User found",
            data: user,
        })
    } catch (error: any) {
        return NextResponse.json(
            {message: error.message},
            {status: 400}
        )
    }
}