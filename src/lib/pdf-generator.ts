import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PayrollData {
    user: {
        name: string;
        employeeId: string;
        jobTitle: string;
    };
    month: number;
    year: number;
    baseSalary: number;
    deductions: number;
    netSalary: number;
}

export const generatePayrollPDF = (data: PayrollData) => {
    const doc = new jsPDF();
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Header
    doc.setFillColor(10, 12, 16);
    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("DAYFLOW", 20, 25);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("PAYROLL SLIP", 160, 25);
    doc.text(`${months[data.month - 1]} ${data.year}`, 160, 32);

    // Employee Details
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("EMPLOYEE INFORMATION", 20, 60);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const details = [
        ["Name", data.user.name],
        ["Employee ID", data.user.employeeId],
        ["Position", data.user.jobTitle || "N/A"],
        ["Period", `${months[data.month - 1]} ${data.year}`]
    ];

    autoTable(doc, {
        startY: 65,
        margin: { left: 20 },
        tableWidth: 100,
        body: details,
        theme: "plain",
        styles: { fontSize: 10, cellPadding: 2 },
        columnStyles: { 0: { fontStyle: "bold", textColor: [100, 100, 100] } }
    });

    // Financial Table
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("COMPENSATION DETAILS", 20, 115);

    autoTable(doc, {
        startY: 120,
        margin: { left: 20, right: 20 },
        head: [["Description", "Amount"]],
        body: [
            ["Base Salary", `$ ${data.baseSalary.toLocaleString()}`],
            ["Deductions", `- $ ${data.deductions.toLocaleString()}`],
        ],
        foot: [["NET SALARY", `$ ${data.netSalary.toLocaleString()}`]],
        theme: "striped",
        headStyles: { fillColor: [99, 102, 241], textColor: [255, 255, 255] },
        footStyles: { fillColor: [10, 12, 16], textColor: [255, 255, 255], fontStyle: "bold" },
        styles: { fontSize: 10, cellPadding: 5 }
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
            "This is a system generated document and does not require a signature.",
            105, 285, { align: "center" }
        );
        doc.text(
            `Generated on ${new Date().toLocaleDateString()} | Dayflow HRMS`,
            105, 290, { align: "center" }
        );
    }

    doc.save(`Payroll_Slip_${data.user.name.replace(/\s+/g, "_")}_${months[data.month - 1]}_${data.year}.pdf`);
};
