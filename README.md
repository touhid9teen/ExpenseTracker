# FinVue - Modern Expense Tracker

FinVue is a modern, full-stack Expense Tracker application built with Next.js and React. It helps you manage your personal finances by tracking daily expenses, visualizing spending habits, and categorizing transactions.

## ✨ Features

- **User Authentication**: Secure signup and login flow using JWT (JSON Web Tokens) and bcrypt for password hashing.
- **Expense Management**: Add, edit, delete, and view your daily expenses seamlessly.
- **Filtering & Sorting**: Filter expenses by category, search by description, or view by specific date ranges.
- **Dashboard & Statistics**: View quick statistics, category breakdowns, and spending trends with a beautiful, responsive UI.
- **Dark/Light Mode**: Full support for theme toggling with smooth transitions.
- **Modern UI**: Built with Tailwind CSS for a sleek, responsive design and micro-interactions.
- **Database Integration**: Powered by a robust PostgreSQL database using Neon (serverless).

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Edge API Routes)
- **Frontend**: [React 18](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/), [@neondatabase/serverless](https://neon.tech/)
- **Authentication**: JWT (`jose`), `bcryptjs`, Cookies (`js-cookie`)
- **UI Components**: `react-hot-toast` for notifications

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd ExpenseTracker
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add the following keys:

   ```env
   APP_ENV=development or production      
   GEMINI_API_KEY=your-GEMINI_API_KEY
   DATABASE_URL="your-neon-postgres-database-url"
   JWT_SECRET="your-secure-jwt-secret"
   ```

4. **Initialize the Database:**
   The application uses a SQL database. Ensure your PostgreSQL database is running and accessible via the `DATABASE_URL`. Run any provided initialization scripts to create the `users` and `expenses` tables.

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at [http://localhost:3000](http://localhost:3000).

## 📂 Project Structure

- `/src/app`: Next.js App Router pages and API routes.
- `/src/Components`: Reusable React components (AuthModal, ExpenseTable, etc.).
- `/src/hooks`: Custom React hooks (e.g., `useExpenseClipper`).
- `/src/utils`: Helper functions for date formatting, calculations, etc.
- `/src/lib`: Database and authentication utilities.

## 📄 License

This project is licensed under the MIT License.
