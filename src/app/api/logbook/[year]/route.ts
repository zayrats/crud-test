import { NextResponse } from "next/server";
import prisma from "../../../../../prisma";


interface Params {
    year: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
    const year = parseInt(params.year);

    try {
        if (isNaN(year)) {
            return NextResponse.json({
                success: false,
                message: "Year cannot be empty or must be a valid number",
                data: null,
            })
        };

        const Bookings = await prisma.booking.findMany({
            where: {
                createdAt: {
                    gte: new Date(year, 0, 1),
                    lte: new Date(year, 11, 31),
                }
            },
            include: {
                vehicle: true,
                approver: false,
                driver: false,
                user: true,
            }
        });

        return NextResponse.json(
            {
                success: true,
                message: "Success get all booking",
                data: Bookings,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "Error Get Book By year",
            error: error,
        },
            {

                status: 500,
            });
    };

}