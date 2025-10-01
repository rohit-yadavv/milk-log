import { NextRequest, NextResponse } from "next/server";
import { startOfDay, endOfDay } from "date-fns";
import connectDB from "@/lib/db";
import { MilkRecord } from "@/lib/models";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    let query = {};
    if (date) {
      const dateObj = new Date(date);
      const start = startOfDay(dateObj);
      const end = endOfDay(dateObj);

      query = {
        date: {
          $gte: start,
          $lte: end,
        },
      };
    }

    const records = await MilkRecord.find(query)
      .populate({
        path: "customerId",
        select: "name customerType dailyAmount isActive",
        match: { isActive: { $ne: false } }, // Only populate if customer is active
      })
      .sort({ date: -1 });

    // Filter out records where customer was not found (deleted/inactive)
    const validRecords = records.filter((record) => record.customerId !== null);

    return NextResponse.json(validRecords);
  } catch (error) {
    console.error("Error fetching records:", error);
    return NextResponse.json(
      { error: "Failed to fetch records" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const record = new MilkRecord({
      customerId: body.customerId,
      date: new Date(body.date),
      morningAmount: body.morningAmount || undefined,
      eveningAmount: body.eveningAmount || undefined,
    });

    await record.save();

    // Populate customer data
    await record.populate({
      path: "customerId",
      select: "name customerType dailyAmount isActive",
      match: { isActive: { $ne: false } },
    });

    // If customer is not found (deleted/inactive), return error
    if (!record.customerId) {
      return NextResponse.json(
        { error: "Customer not found or inactive" },
        { status: 400 },
      );
    }

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("Error creating record:", error);
    return NextResponse.json(
      { error: "Failed to create record" },
      { status: 500 },
    );
  }
}
