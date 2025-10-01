# 🥛 Milk Log

A simple and efficient **mobile-first** web application for managing daily milk distribution. Track deliveries to multiple customers with separate morning and evening amounts, manage different customer types (milkmen vs regular customers), and generate billing reports.

**Streamlined for daily use** - Simple interface focused on essential features!

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
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/milk-log-db?retryWrites=true&w=majority
   ```

   (Replace with your MongoDB connection string - supports both local and cloud MongoDB)

4. **Start the development server:**

   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Go to [http://localhost:3000](http://localhost:3000)

## 🛠️ Technical Details

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui components for consistent design
- **Icons**: Lucide React icons
- **Database**: MongoDB with Mongoose
- **TypeScript**: Full type safety
- **Date Handling**: date-fns library for robust date operations
- **Responsive**: Mobile-first design
