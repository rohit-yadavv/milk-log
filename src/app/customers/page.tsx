'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, ArrowLeft, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from '@/components/ui/drawer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

interface Customer {
  _id: string;
  name: string;
  customerType: 'milkman' | 'regular';
  dailyAmount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [isUpdatingCustomer, setIsUpdatingCustomer] = useState<string | null>(null);
  const [newCustomer, setNewCustomer] = useState({ 
    name: '', 
    customerType: 'regular' as 'milkman' | 'regular',
    dailyAmount: 1 
  });
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Load customers from database
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const response = await fetch('/api/customers/all');
        if (response.ok) {
          const customersData = await response.json();
          setCustomers(customersData);
        }
      } catch (error) {
        console.error('Error loading customers:', error);
      }
    };

    loadCustomers();
  }, []);

  const handleAddCustomer = async () => {
    if (newCustomer.name.trim()) {
      // Check if customer name already exists
      const existingCustomer = customers.find(c => 
        c.name.toLowerCase() === newCustomer.name.toLowerCase()
      );
      if (existingCustomer) {
        alert('Customer with this name already exists');
        return;
      }

      // For regular customers, dailyAmount is required
      if (newCustomer.customerType === 'regular' && newCustomer.dailyAmount <= 0) {
        alert('Daily amount is required for regular customers');
        return;
      }
      
      setIsCreatingCustomer(true);
      try {
        const response = await fetch('/api/customers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newCustomer.name,
            customerType: newCustomer.customerType,
            dailyAmount: newCustomer.dailyAmount
          }),
        });

        if (response.ok) {
          const newCustomerData = await response.json();
          setCustomers([...customers, newCustomerData]);
          setNewCustomer({ name: '', customerType: 'regular', dailyAmount: 1 });
          setShowAddCustomer(false);
        } else {
          const errorData = await response.json();
          alert(errorData.error || 'Failed to add customer');
        }
      } catch (error) {
        console.error('Error adding customer:', error);
        alert('Failed to add customer');
      } finally {
        setIsCreatingCustomer(false);
      }
    }
  };

  const handleUpdateCustomer = async (customerId: string, updates: Partial<Customer>) => {
    setIsUpdatingCustomer(customerId);
    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedCustomer = await response.json();
        setCustomers(customers.map(c => c._id === customerId ? updatedCustomer : c));
        setEditingCustomer(null);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update customer');
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Failed to update customer');
    } finally {
      setIsUpdatingCustomer(null);
    }
  };

  const handleToggleActive = async (customerId: string, isActive: boolean) => {
    await handleUpdateCustomer(customerId, { isActive });
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/customers/${customerId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setCustomers(customers.filter(c => c._id !== customerId));
        } else {
          const errorData = await response.json();
          alert(errorData.error || 'Failed to delete customer');
        }
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Failed to delete customer');
      }
    }
  };

  const activeCustomers = customers.filter(c => c.isActive);
  const inactiveCustomers = customers.filter(c => !c.isActive);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Customer Management
            </h1>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-lg font-bold text-gray-800 dark:text-white">{customers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-lg font-bold text-gray-800 dark:text-white">{activeCustomers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <div className="flex items-center gap-2">
              <UserX className="h-6 w-6 text-red-600" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Inactive</p>
                <p className="text-lg font-bold text-gray-800 dark:text-white">{inactiveCustomers.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Customer Button */}
        <div className="mb-6">
          <Drawer open={showAddCustomer} onOpenChange={setShowAddCustomer}>
            <DrawerTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4" />
                <span className="ml-2">Add New Customer</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Customer
                </DrawerTitle>
                <DrawerDescription>
                  Add a new customer to your list
                </DrawerDescription>
              </DrawerHeader>
              <div className="px-4 space-y-4">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <Select
                  value={newCustomer.customerType}
                  onValueChange={(value: 'milkman' | 'regular') => setNewCustomer({...newCustomer, customerType: value})}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select customer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular Customer</SelectItem>
                    <SelectItem value="milkman">Milkman</SelectItem>
                  </SelectContent>
                </Select>
                {newCustomer.customerType === 'regular' && (
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Daily Amount (Liters)"
                    value={newCustomer.dailyAmount}
                    onChange={(e) => setNewCustomer({...newCustomer, dailyAmount: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                )}
                {newCustomer.customerType === 'milkman' && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Milkmen have variable quantities - amounts will be entered for each delivery
                  </p>
                )}
              </div>
              <DrawerFooter>
                <Button 
                  onClick={handleAddCustomer} 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isCreatingCustomer}
                >
                  {isCreatingCustomer ? 'Adding...' : 'Add Customer'}
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline" disabled={isCreatingCustomer}>Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>

        {/* Active Customers */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-600" />
              Active Customers ({activeCustomers.length})
            </h2>
          </div>
          
          {activeCustomers.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No active customers</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {activeCustomers.map((customer) => (
                <div key={customer._id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {customer.name}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          customer.customerType === 'milkman' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        }`}>
                          {customer.customerType}
                        </span>
                        {customer.customerType === 'regular' && (
                          <span>{customer.dailyAmount}L daily</span>
                        )}
                        <span>Added: {new Date(customer.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleActive(customer._id, false)}
                        disabled={isUpdatingCustomer === customer._id}
                      >
                        <UserX className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingCustomer(customer)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteCustomer(customer._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inactive Customers */}
        {inactiveCustomers.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <UserX className="h-5 w-5 text-red-600" />
                Inactive Customers ({inactiveCustomers.length})
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {inactiveCustomers.map((customer) => (
                <div key={customer._id} className="p-4 opacity-60">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {customer.name}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          customer.customerType === 'milkman' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        }`}>
                          {customer.customerType}
                        </span>
                        {customer.customerType === 'regular' && (
                          <span>{customer.dailyAmount}L daily</span>
                        )}
                        <span>Added: {new Date(customer.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleActive(customer._id, true)}
                        disabled={isUpdatingCustomer === customer._id}
                      >
                        <UserCheck className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingCustomer(customer)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteCustomer(customer._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
