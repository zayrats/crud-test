import { NextResponse } from "next/server";
import prisma from "../../../../../prisma";


export async function POST(request: Request) {
    const { vehicleId, serviceDate, description, cost } = await request.json();

    const formattedDate = new Date(serviceDate).toISOString();
    try {
        const newServiceHistory: ServiceHistory = await prisma.serviceHistory.create({
            data: {
                vehicle: {
                    connect: {
                        id: parseInt(vehicleId)
                    }
                },
                serviceDate: formattedDate,
                description: description,
                cost: cost
            }
        })

        return NextResponse.json(
            {
                success: true,
                message: "Successfully added new service history",
                data: newServiceHistory,
            },
            {
                status: 201, // Created
            }
        );

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to add new service history",
                error: error
            }, {
            status: 500, // Internal Server Error
        });


    }

}

