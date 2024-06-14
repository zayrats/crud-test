import { NextResponse } from "next/server";
import prisma from "../../../../prisma";
import { getSession } from "@/app/lib/session";

// get all approval for logged user (supervisor / manager)
export async function GET(request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: "Anda Belum logged in",
      },
      { status: 400 }
    );
  } else {
    try {
      const approvals = await prisma.approval.findMany({
        where: {
          approverId: parseInt(session?.userId),
        },
      });

      if (!approvals.length) {
        return NextResponse.json(
          {
            success: false,
            message: "No approval found",
            data: null,
          },
          { status: 404 }
        );
      } else {
        return NextResponse.json(
          {
            success: true,
            message: "Success",
            data: approvals,
          },
          { status: 200 }
        );
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        {
          success: false,
          message: "Something went wrong",
          error: error,
        },
        { status: 500 }
      );
    }
  }
}
