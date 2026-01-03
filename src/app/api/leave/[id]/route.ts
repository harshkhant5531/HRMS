import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { status, adminComment } = await req.json();

        if (!status) {
            return NextResponse.json({ message: "Status is required" }, { status: 400 });
        }

        const updatedLeave = await prisma.leaveRequest.update({
            where: { id },
            data: {
                status,
                adminComment,
            },
        });

        return NextResponse.json(updatedLeave);
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
