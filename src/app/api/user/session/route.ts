import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma";
import { getSession } from "@/app/lib/session";
import { NextApiRequest, NextApiResponse } from 'next'
import { redirect } from "next/navigation";


// get user session
export async function GET(request: NextRequest, response: NextResponse) {
    const session = await getSession();




    if (!session) {
        return NextResponse.json({
            success: false,
            message: "You haven't logged in",
            data: null
        }, { status: 400 },)
    } else if (session.role == 'admin') {
        const user = await prisma.admin.findUnique({
            where: {
                id: parseInt(session?.userId as string)
            },
        })

        return NextResponse.json({
            success: true,
            message: "You are logged in",
            is_admin: true,
            user: user,
        }, { status: 200 },)
    } else {
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(session?.userId as string)
            },
        })

        return NextResponse.json({
            success: true,
            message: "You are logged in",
            is_admin: false,
            user: user,
        }, { status: 200 },)
    }
}