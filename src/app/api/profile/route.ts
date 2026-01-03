import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                employeeId: true,
                email: true,
                name: true,
                role: true,
                profilePic: true,
                jobTitle: true,
                department: true,
                joiningDate: true,
                phone: true,
                address: true,
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();

        // Only allow specific fields for employees
        const allowedFields = ["name", "phone", "address", "profilePic"];
        const updateData: any = {};

        Object.keys(data).forEach(key => {
            if (allowedFields.includes(key)) {
                updateData[key] = data[key];
            }
        });

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
