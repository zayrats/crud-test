import { NextResponse } from "next/server";
import prisma from "../../../../../prisma";
import { getSession } from "@/app/lib/session";
import { connect } from "http2";


interface Params {
    id: string;
}


// update approval status
export async function PATCH(request: Request, { params }: { params: Params }) {
    const approval_id = parseInt(params.id);
    const {
        approvalStatus, comments,
    } = await request.json();

    const session = await getSession();

    try {
        if (isNaN(approval_id)) {
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

        // cari approval yang akan diupdate
        const choosedApproval = await prisma.approval.findUnique({
            where: { id: approval_id },
            include: { booking: true },
        });

        if (!choosedApproval) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Approval not found",
                    data: null,
                },
                { status: 404 } // Not Found
            );
        }

        let updatedApproval, updatedBooking;

        // jika level 1 approved buat level 2
        if (approvalStatus === "APPROVED" && choosedApproval.level === 1) {
            const manager = await prisma.user.findFirst({
                where: {
                    department: session!.department!,
                    role: 'MANAGER',

                },
            });
            if (manager!.department !== session!.department!) {
                console.log("manager tidak sama dengan department user", session?.userId);
                return NextResponse.json(
                    {
                        success: false,
                        message: "Manager not found",
                        data: null,
                    },
                    { status: 404 } // Not Found
                );
            }

            if (!manager) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Manager not found",
                        data: null,
                    },
                    { status: 404 } // Not Found
                );
            }

            // audit actvity log
            await prisma.activityLog.create({
                data: {
                    action: 'UPDATE',
                    description: "APPROVED APPROVAL LEVEL 1 ID " + choosedApproval.id,
                    user: {
                        connect: {
                            id: parseInt(session!.userId! as string),
                        }
                    }
                },
            })

            const newApproval2 = await prisma.approval.create({
                data: {
                    bookingId: choosedApproval.bookingId,
                    level: 2,
                    status: "PENDING",
                    comments: '',
                    approverId: manager!.id!,
                },
            });

            // audit actvity log
            await prisma.activityLog.create({
                data: {
                    action: 'CREATE',
                    description: "CREATE NEW APPROVAL ID : " + newApproval2.id,
                    user: {
                        connect: {
                            id: parseInt(session!.userId! as string),
                        }
                    }
                },
            })
        }

        // update approval jika rejected / approved
        updatedApproval = await prisma.approval.update({
            where: { id: approval_id },
            data: { status: approvalStatus, comments: comments },
        });

        //audit actvity log
        await prisma.activityLog.create({
            data: {
                action: 'UPDATE',
                description: `${approvalStatus} APPROVAL ID: ` + updatedApproval.id,
                user: {
                    connect: {
                        id: parseInt(session!.userId! as string),
                    }
                }
            },
        })


        // untuk update (approve/reject) approval level 2 dan ketika reject approval level 1
        if (approvalStatus === "REJECTED" || choosedApproval.level === 2) {
            updatedBooking = await prisma.booking.update({
                where: { id: choosedApproval.bookingId },
                data: { status: approvalStatus },
            });

            await prisma.activityLog.create({
                data: {
                    action: 'UPDATE',
                    description: `${approvalStatus} BOOKING ID: ` + updatedBooking.id,
                    user: {
                        connect: {
                            id: parseInt(session!.userId! as string),
                        }
                    }
                },
            })
        }

        return NextResponse.json(
            {
                success: true,
                message: "Successfully updated approval status",
                data: { updatedApproval, updatedBooking },
            },
            { status: 200 } // OK
        );


    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "Cannot update Approval",
            error: error,
        },
            {
                status: 404, // OK
            })
    }

}
