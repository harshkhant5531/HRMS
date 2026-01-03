import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { email, password, employeeId, name, role, jobTitle, department } = await req.json();

        if (!email || !password || !employeeId || !name) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { employeeId }
                ]
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists with this email or Employee ID" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                employeeId,
                name,
                role: role || "EMPLOYEE",
                jobTitle,
                department,
            },
        });

        return NextResponse.json(
            { message: "User registered successfully", userId: user.id },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
