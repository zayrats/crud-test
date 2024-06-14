import { NextResponse } from "next/server";
import prisma from "../../../../prisma";
import bcrypt from "bcrypt";



// Insert new User
export async function POST(request: Request) {
    const { name, email, password, role, department } = await request.json();


    try {

        // Periksa apakah email sudah digunakan
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        // Jika email sudah digunakan
        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email is already in use",
                },
                {
                    status: 400, // Bad Request
                }
            );
        }

        // Hash password sebelum menyimpannya di database
        const hashedPassword = await bcrypt.hash(password, 10);
        // console.log("ini adalah ",Position.EMPLOYEE,)


        // Buat user baru dalam database
        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
                role: role,
                department: department,
            },
        });

        // Jika registrasi berhasil, kirim respons berhasil
        return NextResponse.json(
            {
                success: true,
                message: "Registration successful",
                user: {
                    user_id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                },
            },
            {
                status: 201, // Created
            }
        );


    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to register",
                error: error,
            },
            {
                status: 500, // Internal Server Error
            }
        );
    }
}

// get all users
export async function GET(request: Request) {
    try {
        const users = await prisma.user.findMany();
        return NextResponse.json(
            {
                success: true,
                users: users,
            },
            {
                status: 200, // OK
            }
        );


    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "Error Get Book By year",
            error: error,
        },
            {
                status: 500,
            })
    }
}
