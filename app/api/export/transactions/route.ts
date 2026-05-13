import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma-fresh";
export async function GET() { 
  const rows = await prisma.transaction.findMany({ include: { customer: true }, orderBy: { deliveryDate: "desc" } }); 
  const csv = ["Date,Customer,Area,Filled,Empty,Total Amount,Paid Amount,Status,Notes", ...rows.map((r) => [
    r.deliveryDate.toISOString(), 
    r.customer.fullName, 
    r.customer.area, 
    r.filledCylindersDelivered, 
    r.emptyCylindersReceived, 
    r.paymentAmount, 
    r.paidAmount,
    r.paymentStatus, 
    r.notes ?? ""
  ].map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","))].join("\n"); 
  return new NextResponse(csv, { headers: { "content-type": "text/csv", "content-disposition": "attachment; filename=transactions.csv" } }); 
}
