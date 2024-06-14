import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma";

// get all vehicle 
export async function GET(request: Request) {
    try {
        const vehicles = await prisma.vehicle.findMany({
            include: {
                bookings: false,
                fuelConsumptions: false,
                serviceHistories: false
            }
        });


        return NextResponse.json(
            {
                sucess: true,
                message: "Success get all booking",
                data: vehicles,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.log("Get all vehicle error:", error);
        return NextResponse.json(
            {
                sucess: false,
                message: "Error get all vehicle",
                data: error,
            },

            {
                status: 500,
            });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const newVehicle = await prisma.vehicle.create({
            data: {
                type: body.type,
                model: body.model,
                licensePlate: body.licensePlate,
                ownedBy: body.ownedBy,
                fuelConsumption: body.fuelConsumption,
                lastServiceDate: body.lastServiceDate,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Vehicle successfully added",
                data: newVehicle,
            },
            {
                status: 201, // Created
            }
        );
    } catch (error) {
        console.error("Error inserting new vehicle:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to add vehicle",
                error: error
            },
            {
                status: 500, // Internal Server Error
            }
        );
    }
}