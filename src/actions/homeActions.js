"use server";

import { db } from "@/db/prisma";
import { auth } from "@/auth";

// Get home page statistics
export async function getHomeStats() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = session.user.id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Get all products
    const allProducts = await db.product.findMany({
      where: { userId },
    });

    // Pending work - products with status "pending"
    const pendingCount = allProducts.filter(
      (p) => p.status === "pending"
    ).length;

    // Completed work - products with status "কাজ সম্পন্ন"
    const kajComplateCount = allProducts.filter(
      (p) => p.status === "কাজ সম্পন্ন"
    ).length;

    // One month old products - products older than one month
    const oneMonthOldCount = allProducts.filter(
      (p) => new Date(p.createdAt) <= oneMonthAgo
    ).length;

    // This month's work - products created this month
    const monthlyProducts = allProducts.filter(
      (p) =>
        new Date(p.createdAt) >= startOfMonth &&
        new Date(p.createdAt) <= endOfMonth
    );
    const totalWork = monthlyProducts.length;

    // This month's income - products joma created this month (monthly wise)
    const monthlyIncome = monthlyProducts.reduce(
      (sum, p) => sum + (p.joma || 0),
      0
    );

    // This month's expense - from expenses table
    const monthlyExpenses = await db.expense.aggregate({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: {
        amount: true,
      },
    });

    // This month's balance - products joma (this month) - expenses (this month)
    const monthlyBalance = monthlyIncome - (monthlyExpenses._sum.amount || 0);

    // Total products count
    const totalProducts = allProducts.length;

    // Total deliveries - products with status "delivered"
    const deliveredCount = allProducts.filter(
      (p) => p.status === "delivered"
    ).length;

    // Total income - all products joma sum (not filtered by status)
    const totalIncome = allProducts.reduce((sum, p) => sum + (p.joma || 0), 0);

    // Total debt - from debt table
    const totalDebts = await db.debt.aggregate({
      where: { userId },
      _sum: { amount: true },
    });

    // Total expense - from expense table (all time)
    const totalExpenses = await db.expense.aggregate({
      where: { userId },
      _sum: { amount: true },
    });

    return {
      success: true,
      data: {
        pendingCount,
        kajComplateCount,
        oneMonthOldCount,
        totalWork,
        monthlyIncome,
        monthlyExpenses: monthlyExpenses._sum.amount || 0,
        monthlyBalance,
        totalProducts,
        deliveredCount,
        totalIncome,
        totalDebts: totalDebts._sum.amount || 0,
        totalExpenses: totalExpenses._sum.amount || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching home stats:", error);
    return { success: false, message: error.message };
  }
}
