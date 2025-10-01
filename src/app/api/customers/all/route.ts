import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Customer } from "@/lib/models";

export async function GET() {
  try {
    await connectDB();

    const customers = await Customer.find({}).sort({ name: 1 }).lean();

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error fetching all customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
