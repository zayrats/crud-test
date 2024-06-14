import { NextResponse } from "next/server";
import prisma from "../../../../../prisma";

export async function POST(request: Request) {
    const { vehicleId, date, cost, amount, kilometers, distanceTravelled } = await request.json();


    const formattedDate = new Date(date).toISOString();

    try {
        const fuelConsumption: FuelConsumption = await prisma.fuelConsumption.create({
            data: {
                vehicle: {
                    connect: {
                        id: parseInt(vehicleId)
                    }
                },
                date: formattedDate,
                cost: cost,
                amount: amount,
                kilometers: kilometers,
                distanceTravelled: distanceTravelled
            }
        });

        // update vehicle fuel consumption
        // ambil data fuel consumption sebelumnya
        const previousFuelConsumption = await prisma.fuelConsumption.findFirst({
            where: {
                vehicleId: parseInt(vehicleId),
                NOT: {
                    id: fuelConsumption.id,
                }
            },
            orderBy: {
                date: 'desc'
            }
        });

        // hitung berdasarkan kilometer sekarang dan sebelumnya
        let newFuelConsumptionValue: number | null = null;
        if (previousFuelConsumption) {
            const distanceTravelled = kilometers - previousFuelConsumption.kilometers;
            newFuelConsumptionValue = distanceTravelled / amount;
        }

        const vehicle = await prisma.vehicle.update({
            where: {
                id: parseInt(vehicleId)
            },
            data: {
                fuelConsumption: newFuelConsumptionValue,
                fuelConsumptions: {
                    connect: {
                        id: fuelConsumption.id
                    }
                }
            }
        });


        return NextResponse.json(
            {
                success: true,
                message: "Successfully added new service history",
                data: fuelConsumption,
            },
            {
                status: 201, // Created
            }
        );
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {
                success: false,
                message: "Failed to add new service fuel consumption",
                error: error
            }, {
            status: 500,
        })
    }
}