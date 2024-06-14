import { NextResponse } from "next/server";
import prisma from "../../../../prisma";
import bcrypt from "bcrypt";
import type { NextRequest } from 'next/server'
import { createSession } from "@/app/lib/session";

// login
export async function POST(request: NextRequest) {
    const { email, password } = await request.json();

    try {
        // Cari pengguna berdasarkan alamat email
        const admin = await prisma.admin.findUnique({
            where: {
                email: email,
            },
        });

        // Jika pengguna tidak ditemukan
        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email not found",
                },
                {
                    status: 404, // Not Found
                }
            );
        }

        // Bandingkan password yang diberikan dengan password yang tersimpan dalam database
        const passwordMatch = await bcrypt.compare(password, admin.password);


        // Jika password tidak cocok
        if (!passwordMatch) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Incorrect password",
                },
                {
                    status: 401, // Unauthorized
                }
            );
        }

        // buat sesssi
        await createSession(admin.id.toString(), 'admin', '');

        // Jika email dan password cocok, kirim respons berhasil
        return NextResponse.json(
            {
                success: true,
                message: "Login successful",
                user: {
                    id: admin.id,
                    email: admin.email,
                },
            },
            {
                status: 200, // OK
            }
        );
    } catch (error) {
        console.error("Login error:", error);
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
