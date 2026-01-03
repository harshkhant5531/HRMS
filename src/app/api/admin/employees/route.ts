import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const employees = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                employeeId: true,
                email: true,
                name: true,
                role: true,
                jobTitle: true,
                department: true,
                joiningDate: true,
                phone: true,
            }
        });

        return NextResponse.json(employees);
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
