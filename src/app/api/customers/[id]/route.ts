import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Customer } from '@/lib/models';
import mongoose from 'mongoose';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid customer ID' }, { status: 400 });
    }
    
    // Check if customer exists
    const existingCustomer = await Customer.findById(id);
    if (!existingCustomer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    
    // If updating name, check for duplicates
    if (body.name && body.name !== existingCustomer.name) {
      const duplicateCustomer = await Customer.findOne({ 
        name: { $regex: new RegExp(`^${body.name}$`, 'i') },
        _id: { $ne: id }
      });
      
      if (duplicateCustomer) {
        return NextResponse.json({ error: 'Customer with this name already exists' }, { status: 400 });
      }
    }
    
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      {
        ...body, 
        dailyAmount: body.customerType === 'milkman' ? 0 : body.dailyAmount
      },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error('Error updating customer:', error);
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json({ error: 'Customer with this name already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid customer ID' }, { status: 400 });
    }
    
    // Check if customer exists
    const existingCustomer = await Customer.findById(id);
    if (!existingCustomer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    
    // Delete the customer
    await Customer.findByIdAndDelete(id);
    
    return NextResponse.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
  }
}
