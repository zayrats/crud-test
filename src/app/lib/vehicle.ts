import prisma from "../../../prisma";


export async function isVehicleInUse(vehicleId: number): Promise<boolean> {
    const now = new Date();

    const activeBookings = await prisma.booking.findFirst({
        where: {
            vehicleId: vehicleId,
            status: "APPROVED",
            startDate: {
                lte: now,
            },
            endDate: {
                gte: now,
            },
        },
    })


    return activeBookings !== null;
}
