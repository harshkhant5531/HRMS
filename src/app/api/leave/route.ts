import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { type, startDate, endDate, remarks } = await req.json();

        if (!type || !startDate || !endDate) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const leaveRequest = await prisma.leaveRequest.create({
            data: {
                userId: session.user.id,
                type,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                remarks,
                status: "PENDING",
            },
        });

        return NextResponse.json(leaveRequest, { status: 201 });
    } catch (error) {
        console.error("Leave application error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const leaves = await prisma.leaveRequest.findMany({
            where: session.user.role === "ADMIN" ? {} : { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        name: true,
                        employeeId: true,
                    }
                }
            }
        });

        return NextResponse.json(leaves);
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
