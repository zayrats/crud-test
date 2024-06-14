import { NextResponse } from "next/server";
import prisma from "../../../../prisma";

// get all log activity
export async function GET(request: Request) {
    try {
        const logActivities = await prisma.activityLog.findMany({
            orderBy: {
                timestamp: 'desc',
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Successfully get log activity",
                data: logActivities,
            },
            { status: 200 } // OK
        );
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Cannot get log activity",
            error: error,
        },
            {
                status: 404, // OK
            })
    }

}