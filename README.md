# 🥛 Milk Distribution Manager

A simple and beautiful **mobile-first** web application designed to help manage daily milk distribution. Perfect for tracking milk supplied to multiple customers with **morning and evening deliveries**, recording quantities, managing **festival conditions**, and viewing totals over selected periods.

**Perfect for non-English speakers** - Uses intuitive icons instead of text for easy navigation!

## ✨ Features

- **🌅 Morning & Evening Deliveries**: Track both delivery times separately
- **🎉 Festival Conditions**: Handle special days (no morning, evening only)
- **📱 Mobile-First Design**: Optimized for phone use with large touch targets
- **🎨 Icon-Based Interface**: No English text needed - intuitive icons everywhere
- **👥 Customer Management**: Add customers with simple drawer interface
- **📊 Visual Dashboard**: Beautiful cards showing daily summaries
- **📈 Period Reports**: View totals and analytics for any date range
- **🌙 Dark Mode Support**: Easy on the eyes in any lighting
- **📱 Drawer Navigation**: Smooth mobile-friendly interactions

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- MongoDB (local or cloud)

### Installation

1. **Clone or download the project**
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add:
   ```
   MONGODB_URI=mongodb://localhost:27017/milk-log
   ```
   (Replace with your MongoDB connection string)

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Go to [http://localhost:3000](http://localhost:3000)

## 📱 How to Use

### Adding Customers
1. Tap the **👤 Customer** button (green button with user icon)
2. Fill in the customer name (required)
3. Optionally add phone number and address
4. Tap **"Add Customer"**

### Recording Daily Deliveries
1. Select the date using the date picker
2. Tap **📝 Record** button (blue button with document icon)
3. Choose a customer from the dropdown
4. Select delivery time: **☀️ Morning**, **🌙 Evening**, or **🕐 Both**
5. Enter quantities for selected times
6. Enter the price per liter
7. Add any notes if needed
8. Check **"Festival Day (No Morning)"** if applicable
9. Tap **"Add Record"**

### Viewing Reports
1. Tap **📊 Reports** button (purple button with chart icon)
2. Select a date range using the date fields
3. View period totals, morning/evening breakdown, and daily details

### Daily Summary
The dashboard shows key metrics for the selected date:
- **👥 Customers**: Number of deliveries
- **💰 Total**: Total money collected
- **☀️ Morning**: Morning delivery quantity
- **🌙 Evening**: Evening delivery quantity

## 🎨 Design Features

- **Beautiful Gradient Background**: Soft blue gradient that's easy on the eyes
- **Card-based Layout**: Clean, organized information display
- **Color-coded Icons**: Different colors for different types of information
- **Responsive Tables**: Easy to read on any screen size
- **Smooth Animations**: Pleasant hover effects and transitions
- **Large, Clear Buttons**: Easy to click and understand

## 🛠️ Technical Details

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React icons
- **Database**: MongoDB with Mongoose
- **TypeScript**: Full type safety
- **Responsive**: Mobile-first design

## 📊 Data Structure

The app tracks:
- **Customers**: Name, phone, address, active status
- **Milk Records**: Customer, date, quantity, price, total, notes, holiday status
- **Holidays**: Date, description, recurring status

## 🔧 Customization

The app is designed to be easily customizable:
- Colors can be changed in the Tailwind classes
- Icons can be swapped from Lucide React
- Layout can be modified in the component files
- Database schema can be extended in `src/lib/models.ts`

## 📱 Mobile Friendly

The app is fully responsive and works great on:
- Desktop computers
- Tablets
- Mobile phones
- Any screen size

## 🌙 Dark Mode

The app automatically adapts to your system's dark/light mode preference, providing a comfortable viewing experience in any lighting condition.

## 🆘 Need Help?

The interface is designed to be intuitive, but if you need help:
1. All buttons have clear labels
2. Required fields are marked
3. Error messages will guide you
4. The design is consistent throughout

Enjoy managing your milk distribution with this simple and beautiful app! 🥛✨
