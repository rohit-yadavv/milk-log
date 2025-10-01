"use client";

import { useState, useEffect } from "react";
import { BarChart3, Calendar, ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { format } from "date-fns";

interface Customer {
  _id: string;
  name: string;
  customerType: "milkman" | "regular";
  dailyAmount: number;
  isActive: boolean;
}

interface MilkRecord {
  _id: string;
  customerId:
    | string
    | {
        _id: string;
        name: string;
        customerType: "milkman" | "regular";
        dailyAmount: number;
      };
  date: string;
  morningAmount?: number;
  eveningAmount?: number;
}

export default function ReportsPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [records, setRecords] = useState<MilkRecord[]>([]);
  const [startDate, setStartDate] = useState(
    format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
  );
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [selectedCustomer, setSelectedCustomer] = useState<string>("all");
  const [rate, setRate] = useState<number>(0);

  // Load data from database
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load customers
        const customersResponse = await fetch("/api/customers/all");
        if (customersResponse.ok) {
          const customersData = await customersResponse.json();
          setCustomers(customersData);
        }

        // Load all records
        const recordsResponse = await fetch("/api/records");
        if (recordsResponse.ok) {
          const recordsData = await recordsResponse.json();
          setRecords(recordsData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  // Filter records based on date range and selected customer
  const filteredRecords = records.filter((record) => {
    const recordDate = new Date(record.date);
    const start = new Date(startDate);
    const end = new Date(endDate);

    const isInDateRange = recordDate >= start && recordDate <= end;

    if (selectedCustomer === "all") {
      return isInDateRange;
    }

    const customerId =
      typeof record.customerId === "string"
        ? record.customerId
        : record.customerId._id;
    return isInDateRange && customerId === selectedCustomer;
  });

  // Calculate total quantity
  const totalQuantity = filteredRecords.reduce((sum, record) => {
    const customer =
      typeof record.customerId === "string"
        ? customers.find((c) => c._id === record.customerId)
        : record.customerId;

    const morningAmount = record.morningAmount || 0;
    const eveningAmount = record.eveningAmount || 0;

    if (customer?.customerType === "milkman") {
      return sum + morningAmount + eveningAmount;
    } else {
      return sum + (morningAmount || customer?.dailyAmount || 0);
    }
  }, 0);

  // Calculate total amount
  const totalAmount = totalQuantity * rate;

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
            <BarChart3 className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Reports
            </h1>
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-gray-800 dark:text-white">
              Date Range
            </h3>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Customer Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <Users className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-gray-800 dark:text-white">
              Customer
            </h3>
          </div>
          <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select customer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customers</SelectItem>
              {customers
                .filter((customer) => customer.isActive)
                .map((customer) => (
                  <SelectItem key={customer._id} value={customer._id}>
                    {customer.name} ({customer.customerType})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Records Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-white">
              Delivery Records
            </h3>
          </div>

          {filteredRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Quantity (L)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredRecords
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime(),
                    )
                    .map((record) => {
                      const customer =
                        typeof record.customerId === "string"
                          ? customers.find((c) => c._id === record.customerId)
                          : record.customerId;

                      const morningAmount = record.morningAmount || 0;
                      const eveningAmount = record.eveningAmount || 0;

                      let quantity = 0;
                      if (customer?.customerType === "milkman") {
                        quantity = morningAmount + eveningAmount;
                      } else {
                        quantity = morningAmount || customer?.dailyAmount || 0;
                      }

                      return (
                        <tr
                          key={record._id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            {format(new Date(record.date), "dd/MM")}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            {customer?.name || "Unknown Customer"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right">
                            {quantity.toFixed(1)}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
                <tfoot className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <td
                      className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white"
                      colSpan={2}
                    >
                      Total
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white text-right">
                      {totalQuantity.toFixed(1)}L
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                No records found for the selected criteria
              </p>
            </div>
          )}
        </div>

        {/* Rate and Total Amount */}
        {filteredRecords.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mt-4">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="rate"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Rate per Liter (₹)
                </label>
                <input
                  id="rate"
                  type="number"
                  step="0.01"
                  value={rate || ""}
                  onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                  placeholder="Enter rate per liter"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              {rate > 0 && (
                <div className="bg-purple-100 dark:bg-purple-900/20 rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">
                      Total Amount
                    </p>
                    <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                      ₹{totalAmount.toFixed(2)}
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                      {totalQuantity.toFixed(1)}L × ₹{rate.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
