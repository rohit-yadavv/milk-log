import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { MilkRecord } from '@/lib/models';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    await MilkRecord.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Record deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    
    const record = await MilkRecord.findByIdAndUpdate(
      params.id,
      {
        morningAmount: body.morningAmount || undefined,
        eveningAmount: body.eveningAmount || undefined,
      },
      { new: true }
    ).populate('customerId', 'name customerType dailyAmount');
    
    if (!record) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }
    
    return NextResponse.json(record);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
  }
}
