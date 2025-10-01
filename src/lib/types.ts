export interface Customer {
  _id: string;
  name: string;
  customerType: "milkman" | "regular";
  dailyAmount: number; // fixed daily amount in liters
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MilkRecord {
  _id: string;
  customerId: string;
  customerName?: string; // populated field
  date: string;
  morningAmount?: number; // morning delivery amount
  eveningAmount?: number; // evening delivery amount
  isFestival: boolean; // festival condition - no delivery
  createdAt: string;
  updatedAt: string;
}

export interface Holiday {
  _id: string;
  date: string;
  description: string;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DailySummary {
  date: string;
  totalQuantity: number;
  deliveredCount: number;
  totalCustomers: number;
  isHoliday: boolean;
}

export interface PeriodSummary {
  startDate: string;
  endDate: string;
  totalQuantity: number;
  deliveredDays: number;
  averageDaily: number;
  totalDeliveries: number;
}
