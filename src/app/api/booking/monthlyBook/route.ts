import prisma from '../../../../../prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const bookings = await prisma.booking.groupBy({
            by: ['startDate'],
            _count: {
                id: true,
            },

        });

        // satukan jika bulan sama
        const result = bookings.reduce(
            (acc, booking) => {
                const month = booking.startDate.getMonth() + 1
                const year = booking.startDate.getFullYear()
                const key = `${year}-${month.toString().padStart(2, '0')}`
                acc[key] = (acc[key] || 0) + booking._count.id
                return acc
            },
            {} as Record<string, number>
        )

        const data = Object.keys(result).map((date) => ({
            date: date,
            count: result[date],
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return NextResponse.json(
            {
                success: true,
                message: 'Success get all booking by month',
                data: data,
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
