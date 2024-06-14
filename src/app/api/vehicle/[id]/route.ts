import { NextResponse } from "next/server";
import prisma from "../../../../../prisma";

interface Params {
    id: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
    const vehicle_id = parseInt(params.id);

    try {
        if (isNaN(vehicle_id)) {
            return NextResponse.json({
                status: 400,
                message: "Invalid vehicle id"
            },
                {
                    status: 400, // Bad Request
                })
        }

        const vehicle = await prisma.vehicle.findUnique({
            where: {
                id: vehicle_id
            }, include: {
                bookings: true,
                fuelConsumptions: true,
                serviceHistories: true
            }
        });

        return NextResponse.json(
            {
                success: true,
                message: "Success get booking data",
                data: vehicle,
            },
            {
                status: 200, // OK
            }
        );
    } catch (error) {
        console.error("Get booking error:", error);
        return NextResponse.json({
            success: false,
            message: "Failed get vehicle data",
            data: null,
        }
            , {
                status: 500,
            });
    }
}