'use client';

import { useState } from 'react';
import { BarChart3, Calendar, TrendingUp, DollarSign } from 'lucide-react';

interface Customer {
  _id: string;
  name: string;
  phone?: string;
  customerType: 'milkman' | 'regular';
  dailyAmount: number;
  isActive: boolean;
}

interface MilkRecord {
  _id: string;
  customerId: string;
  customerName?: string;
  date: string;
  delivered: boolean;
  isFestival: boolean;
}

interface ReportsSectionProps {
  records: MilkRecord[];
  customers: Customer[];
}

export default function ReportsSection({ records, customers }: ReportsSectionProps) {
  const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [showReports, setShowReports] = useState(false);

  const filteredRecords = records.filter(record => {
    const recordDate = new Date(record.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return recordDate >= start && recordDate <= end;
  });

  const deliveredRecords = filteredRecords.filter(record => record.delivered);
  const periodQuantity = deliveredRecords.reduce((sum, record) => {
    const customer = customers.find(c => c._id === record.customerId);
    return sum + (customer?.dailyAmount || 0);
  }, 0);
  const periodDeliveredCount = deliveredRecords.length;
  const averageDaily = periodQuantity / Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)));

  // Group records by date for daily breakdown
  const dailyBreakdown = filteredRecords.reduce((acc, record) => {
    const date = record.date;
    if (!acc[date]) {
      acc[date] = { quantity: 0, deliveredCount: 0, totalCount: 0 };
    }
    if (record.delivered) {
      const customer = customers.find(c => c._id === record.customerId);
      acc[date].quantity += customer?.dailyAmount || 0;
      acc[date].deliveredCount += 1;
    }
    acc[date].totalCount += 1;
    return acc;
  }, {} as Record<string, { quantity: number; deliveredCount: number; totalCount: number }>);

  const dailyData = Object.entries(dailyBreakdown).map(([date, data]) => ({
    date,
    ...data
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-4">
      {/* Date Range Selector */}
      <div className="flex gap-3 items-center">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-600" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        <span className="text-gray-500">to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Period Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3 text-white">
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-medium">Total Quantity</span>
          </div>
          <p className="text-lg font-bold">{periodQuantity.toFixed(1)}L</p>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-3 text-white">
          <div className="flex items-center gap-1 mb-1">
            <DollarSign className="h-4 w-4" />
            <span className="text-xs font-medium">Deliveries</span>
          </div>
          <p className="text-lg font-bold">{periodDeliveredCount}</p>
        </div>
      </div>

      {/* Average Daily */}
      <div className="bg-purple-100 dark:bg-purple-900/20 rounded-lg p-3">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-purple-600">📊</span>
          <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Average Daily</span>
        </div>
        <p className="text-lg font-bold text-purple-800 dark:text-purple-200">{averageDaily.toFixed(1)}L</p>
      </div>

      {/* Daily Breakdown */}
      {dailyData.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Daily Breakdown</h3>
          <div className="space-y-2">
            {dailyData.map((day) => (
              <div key={day.date} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(day.date).toLocaleDateString()}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {day.quantity.toFixed(1)}L
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center">
                    <div className="text-gray-600 dark:text-gray-400">Total Customers</div>
                    <div className="font-medium">{day.totalCount}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-600">✅ Delivered</div>
                    <div className="font-medium">{day.deliveredCount}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {dailyData.length === 0 && (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No records found for the selected period</p>
        </div>
      )}
    </div>
  );
}

