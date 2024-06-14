import { NextResponse } from "next/server";
import { deleteSession } from "../../lib/session";

// logout
export async function POST(request: Request) {
    try {
        // Hapus sesi
        deleteSession();

        // Jika logout berhasil, kirim respons berhasil
        return NextResponse.json(
            {
                success: true,
                message: "Logout successful",
            },
            {
                status: 200, // OK
            }
        );
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            {
                status: 500, // Internal Server Error
            }
        );
    }
}
