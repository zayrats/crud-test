import { NextResponse } from "next/server";
import prisma from "../../../../../prisma";

interface Params {
    id: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
    const booking_id = parseInt(params.id);

    try {
        if (isNaN(booking_id)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "ID cannot be empty or must be a valid number",
                    data: null,
                },
                {
                    status: 400, // Bad Request
                }
            );
        }


        const booking = await prisma.booking.findUnique({
            where: {
                id: booking_id,
            }, include: {
                user: true,
                vehicle: true,
                driver: true,
                approver: true,

            }
        });

        return NextResponse.json(
            {
                success: true,
                message: "Success get booking data",
                data: booking,
            },
            {
                status: 200, // OK
            }
        );
    } catch (error) {
        console.error("Get booking error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed get booking data",
                data: null,
            }
            , {
                status: 500,
            })
    }
}