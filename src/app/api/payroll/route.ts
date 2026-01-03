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

        const payrolls = await prisma.payroll.findMany({
            where: session.user.role === "ADMIN" ? {} : { userId: session.user.id },
            orderBy: [{ year: "desc" }, { month: "desc" }],
            include: {
                user: {
                    select: {
                        name: true,
                        employeeId: true,
                        jobTitle: true,
                    }
                }
            }
        });

        return NextResponse.json(payrolls);
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { userId, month, year, baseSalary, deductions } = await req.json();

        const netSalary = parseFloat(baseSalary) - parseFloat(deductions || 0);

        const payroll = await prisma.payroll.upsert({
            where: {
                userId_month_year: {
                    userId,
                    month: parseInt(month),
                    year: parseInt(year),
                },
            },
            update: {
                baseSalary: parseFloat(baseSalary),
                deductions: parseFloat(deductions || 0),
                netSalary,
                status: "PAID",
            },
            create: {
                userId,
                month: parseInt(month),
                year: parseInt(year),
                baseSalary: parseFloat(baseSalary),
                deductions: parseFloat(deductions || 0),
                netSalary,
                status: "PAID",
            },
        });

        return NextResponse.json(payroll);
    } catch (error) {
        console.error("Payroll error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
