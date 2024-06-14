import prisma from '../../../../../prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'


export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const bookingsCount = await prisma.vehicle.findMany({
            select: {
                id: true,
                model: true,
                bookings: {
                    select: {
                        _count: true,
                    }
                }
            }
        })

        const result = bookingsCount.map(vehicle => ({
            vehicleId: vehicle.id,
            model: vehicle.model,
            bookingCount: vehicle.bookings.length,
        }));

        return NextResponse.json(
            {
                success: true,
                message: 'Success get all booking by month',
                data: result,
            },
            { status: 200 }
        )

    } catch (error) {
        console.log('Get all booking error:', error)
        return NextResponse.json(
            {
                sucess: false,
                message: 'Failed get all booking by month',
                data: null,
            },
            {
                status: 500,
            }
        )
    }
}