"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Users, Milk, FileText, BarChart3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import Link from "next/link";
import HomeLoading from "@/components/home-loading";

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
        isActive: boolean;
      };
  date: string;
  morningAmount?: number;
  eveningAmount?: number;
}

export default function Home() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [records, setRecords] = useState<MilkRecord[]>([]);
  const [isCreatingRecord, setIsCreatingRecord] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState<MilkRecord | null>(null);
  const [newRecord, setNewRecord] = useState({
    customer: null as Customer | null,
    morningAmount: 0,
    eveningAmount: 0,
  });

  // Load data from database
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Load customers
        const customersResponse = await fetch("/api/customers");
        if (customersResponse.ok) {
          const customersData = await customersResponse.json();
          setCustomers(customersData);
        }

        // Load today's records
        const today = format(new Date(), "yyyy-MM-dd");
        const recordsResponse = await fetch(`/api/records?date=${today}`);
        if (recordsResponse.ok) {
          const recordsData = await recordsResponse.json();
          setRecords(recordsData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const todayRecords = records;
  const todayQuantity = todayRecords.reduce((sum, record) => {
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
  const todayDeliveredCount = todayRecords.length;

  const handleAddRecord = async () => {
    if (newRecord.customer) {
      const today = format(new Date(), "yyyy-MM-dd");
      const customer = newRecord.customer;

      // For milkmen, at least one amount (morning or evening) is required
      if (
        customer?.customerType === "milkman" &&
        newRecord.morningAmount <= 0 &&
        newRecord.eveningAmount <= 0
      ) {
        alert(
          "At least one amount (morning or evening) is required for milkman deliveries",
        );
        return;
      }

      setIsCreatingRecord(true);
      try {
        if (editingRecord) {
          const response = await fetch(`/api/records/${editingRecord._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customerId: customer._id,
              date: editingRecord.date,
              morningAmount:
                newRecord.morningAmount > 0
                  ? newRecord.morningAmount
                  : customer?.customerType === "regular"
                    ? customer.dailyAmount
                    : undefined,
              eveningAmount:
                newRecord.eveningAmount > 0
                  ? newRecord.eveningAmount
                  : undefined,
            }),
          });

          if (response.ok) {
            const updatedRecord = await response.json();
            setRecords(
              records.map((r) =>
                r._id === editingRecord._id ? updatedRecord : r,
              ),
            );
          } else {
            const errorData = await response.json();
            alert(errorData.error || "Failed to update record");
            return;
          }
        } else {
          // Create new record
          const response = await fetch("/api/records", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customerId: customer._id,
              date: today,
              morningAmount:
                newRecord.morningAmount > 0
                  ? newRecord.morningAmount
                  : customer?.customerType === "regular"
                    ? customer.dailyAmount
                    : undefined,
              eveningAmount:
                newRecord.eveningAmount > 0
                  ? newRecord.eveningAmount
                  : undefined,
            }),
          });

          if (response.ok) {
            const newRecordData = await response.json();
            setRecords([...records, newRecordData]);
          } else {
            const errorData = await response.json();
            alert(errorData.error || "Failed to add record");
            return;
          }
        }

        setNewRecord({
          customer: null,
          morningAmount: 0,
          eveningAmount: 0,
        });
        setEditingRecord(null);

        const refreshResponse = await fetch(`/api/records?date=${today}`);
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          setRecords(refreshData);
        }
      } catch (error) {
        alert("Failed to save record");
      } finally {
        setIsCreatingRecord(false);
      }
    }
  };

  if (isLoading) {
    return <HomeLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="px-4 py-6 max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Milk className="size-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Milk Log
            </h1>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Delivered
                </p>
                <p className="text-lg font-bold text-gray-800 dark:text-white">
                  {todayDeliveredCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <div className="flex items-center gap-2">
              <Milk className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Total Milk
                </p>
                <p className="text-lg font-bold text-gray-800 dark:text-white">
                  {todayQuantity.toFixed(1)}L
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Cards */}

        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Today's Deliveries
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {customers
              .filter((customer) => customer.isActive)
              .map((customer) => {
                const existingRecord = todayRecords.find((record) => {
                  const customerId =
                    typeof record.customerId === "string"
                      ? record.customerId
                      : record.customerId._id;
                  return customerId === customer._id;
                });

                const hasRecord = !!existingRecord;
                const totalAmount = hasRecord
                  ? customer.customerType === "milkman"
                    ? (existingRecord.morningAmount || 0) +
                      (existingRecord.eveningAmount || 0)
                    : existingRecord.morningAmount &&
                        existingRecord.morningAmount > 0
                      ? existingRecord.morningAmount
                      : customer.dailyAmount
                  : 0;

                return (
                  <Drawer
                    key={customer._id}
                    onOpenChange={(open) => {
                      if (open) {
                        const existingRecord = todayRecords.find((record) => {
                          const customerId =
                            typeof record.customerId === "string"
                              ? record.customerId
                              : record.customerId._id;
                          return customerId === customer._id;
                        });

                        if (existingRecord) {
                          setEditingRecord(existingRecord);
                          setNewRecord({
                            customer: customer,
                            morningAmount: existingRecord.morningAmount || 0,
                            eveningAmount: existingRecord.eveningAmount || 0,
                          });
                        } else {
                          // Add new record
                          setEditingRecord(null);
                          setNewRecord({
                            customer: customer,
                            morningAmount: 0,
                            eveningAmount: 0,
                          });
                        }
                      }
                    }}
                  >
                    <DrawerTrigger asChild>
                      <div
                        key={customer._id}
                        className={`p-4 rounded-xl shadow-lg cursor-pointer transition-all duration-200 ${
                          hasRecord
                            ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800"
                            : "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {customer.name}
                          </h3>
                          <div
                            className={`w-3 h-3 rounded-full ${
                              hasRecord
                                ? "bg-green-500"
                                : "bg-gray-300 dark:bg-gray-600"
                            }`}
                          />
                        </div>

                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          {customer.customerType === "milkman"
                            ? "Milkman"
                            : `${customer.dailyAmount}L daily`}
                        </div>

                        {hasRecord ? (
                          <div className="text-sm font-medium text-green-700 dark:text-green-300">
                            {totalAmount > 0
                              ? `${totalAmount}L delivered`
                              : "No amount"}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Tap to add delivery
                          </div>
                        )}
                      </div>
                    </DrawerTrigger>
                    <DrawerContent>
                      <div className="px-4 space-y-4">
                        {newRecord.customer && (
                          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <DrawerHeader>
                              <DrawerTitle>
                                {newRecord.customer.name}
                              </DrawerTitle>
                            </DrawerHeader>
                            {newRecord.customer.customerType === "milkman" ? (
                              <div className="space-y-2">
                                <label htmlFor="morningAmount">Morning</label>
                                <input
                                  type="number"
                                  step="0.1"
                                  placeholder="Morning Amount"
                                  value={newRecord.morningAmount || ""}
                                  onChange={(e) =>
                                    setNewRecord({
                                      ...newRecord,
                                      morningAmount:
                                        parseFloat(e.target.value) || 0,
                                    })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                                <label htmlFor="eveningAmount">Evening</label>
                                <input
                                  type="number"
                                  step="0.1"
                                  placeholder="Evening Amount"
                                  value={newRecord.eveningAmount || ""}
                                  onChange={(e) => {
                                    const eveningAmount =
                                      parseFloat(e.target.value) || 0;
                                    setNewRecord({
                                      ...newRecord,
                                      eveningAmount,
                                      // Auto-fill morning amount if evening is entered and morning is empty
                                      morningAmount:
                                        eveningAmount > 0 &&
                                        newRecord.morningAmount <= 0
                                          ? eveningAmount
                                          : newRecord.morningAmount,
                                    });
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  At least one amount (morning or evening) is
                                  required
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <input
                                  type="number"
                                  step="0.1"
                                  placeholder={`Custom Amount (L) - Leave empty for ${
                                    customer?.dailyAmount || 0
                                  }L daily`}
                                  value={newRecord.morningAmount || ""}
                                  onChange={(e) =>
                                    setNewRecord({
                                      ...newRecord,
                                      morningAmount:
                                        parseFloat(e.target.value) || 0,
                                    })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Leave empty to use the regular daily amount (
                                  {customer?.dailyAmount || 0}L)
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <DrawerFooter>
                        <DrawerClose asChild>
                          <Button
                            onClick={handleAddRecord}
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={isCreatingRecord}
                          >
                            {isCreatingRecord
                              ? "Adding..."
                              : editingRecord
                                ? "Update Record"
                                : "Add Record"}
                          </Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                );
              })}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Customer Management Button */}
          <div className="col-span-1">
            <Link href="/customers">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Settings className="size-5" />
              </Button>
            </Link>
          </div>

          {/* Reports Button */}
          <Link href="/reports" className="col-span-2">
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              <BarChart3 className="size-5" />
              <span className="ml-2">Reports</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
