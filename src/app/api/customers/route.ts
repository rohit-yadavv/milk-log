import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Customer } from "@/lib/models";

export async function GET() {
  try {
    await connectDB();
    const customers = await Customer.find({ isActive: true }).sort({ name: 1 });
    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({
      name: { $regex: new RegExp(`^${body.name}$`, "i") },
    });

    if (existingCustomer) {
      return NextResponse.json(
        { error: "Customer with this name already exists" },
        { status: 400 },
      );
    }

    const customer = new Customer({
      name: body.name,
      customerType: body.customerType,
      dailyAmount: body.customerType === "milkman" ? 0 : body.dailyAmount,
      isActive: true,
    });

    await customer.save();
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error("Error creating customer:", error);
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json(
        { error: "Customer with this name already exists" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 },
    );
  }
}
