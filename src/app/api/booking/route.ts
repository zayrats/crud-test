import { NextResponse } from "next/server";
import prisma from "../../../../prisma";
import { getSession } from "@/app/lib/session";


// get all booking for admins
export async function GET(request: Request) {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                vehicle: true,
                approver: false,
                driver: false,
                user: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(
            {
                sucess: true,
                message: "Success get all booking",
                data: bookings,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("Get all booking error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to get all booking",
                error: error,
            }, {
            status: 500,
        })
    }
}

// add new booking by admin
export async function POST(request: Request) {
    const { bookingName, description, vehicleId, purpose, approverId, driverId, userId, startDate, endDate, } = await request.json();

    const formattedStartDate = new Date(startDate).toISOString();
    const formattedEndDate = new Date(endDate).toISOString();

    const session = await getSession();

    try {
        const newBooking = await prisma.booking.create({
            data: {
                bookingName: bookingName,
                description: description,
                vehicle: {
                    connect: {
                        id: parseInt(vehicleId)
                    }
                },
                purpose: purpose,
                approver: { // user dengan role supervisor
                    connect: {
                        id: parseInt(approverId)
                    }
                },
                driver: { // user dengan role employee sebagai pengemudi
                    connect: {
                        id: parseInt(driverId)
                    }
                },
                user: { // user dengan role employee sebagai pengaju
                    connect: {
                        id: parseInt(userId)
                    }
                },
                startDate: formattedStartDate,
                endDate: formattedEndDate,
            }
        })

        // audit actvity log
        await prisma.activityLog.create({
            data: {
                action: 'ADMIN CREATE',
                description: "CREATE NEW BOOKING ID : " + newBooking.id,
                user: {
                    connect: {
                        id: parseInt(session!.userId! as string),
                    }
                }
            },
        })

        // approval untuk level 1
        const newApproval = await prisma.approval.create({
            data: {
                bookingId: newBooking.id,
                approverId: approverId, // user dengan role supervisor
                level: 1,
            }
        })



        // audit actvity log
        await prisma.activityLog.create({
            data: {
                action: 'ADMIN CREATE',
                description: "CREATE NEW APPROVAL ID : " + newApproval.id,
                user: {
                    connect: {
                        id: parseInt(session!.userId! as string),
                    }
                }
            },
        })

        return NextResponse.json(
            {
                sucess: true,
                message: "Success add new booking",
                data: newBooking,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("Add new booking error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to add new booking",
                error: error,
            }, {
            status: 500, // Internal Server Error
        }
        )
    }
}
