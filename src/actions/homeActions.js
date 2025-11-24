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
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const chartMonths = 6;
    const chartStartDate = new Date(now.getFullYear(), now.getMonth() - (chartMonths - 1), 1);

    // Get all products for calculations
    const allProducts = await db.product.findMany({
      where: { userId },
    });

    // Counts
    const pendingCount = allProducts.filter(p => p.status === "pending").length;
    const kajComplateCount = allProducts.filter(p => p.status === "কাজ সম্পন্ন").length;
    const deliveredCount = allProducts.filter(p => p.status === "delivered").length;
    const oneMonthOldCount = allProducts.filter(p => new Date(p.createdAt) <= oneMonthAgo).length;

    // Monthly calculations
    const monthlyProducts = allProducts.filter(p => new Date(p.createdAt) >= startOfMonth);
    const monthlyIncome = monthlyProducts
      .filter(p => p.status === "delivered")
      .reduce((sum, p) => sum + (p.joma || 0), 0);
    
    const monthlyExpenses = await db.expense.aggregate({
      where: {
        userId,
        createdAt: { gte: startOfMonth },
      },
      _sum: {
        amount: true,
      },
    });

    const monthlyDebts = await db.debt.aggregate({
      where: {
        userId,
        createdAt: { gte: startOfMonth },
      },
      _sum: {
        amount: true,
      },
    });

    const totalIncome = allProducts
      .filter(p => p.status === "delivered")
      .reduce((sum, p) => sum + (p.joma || 0), 0);

    const totalExpenses = await db.expense.aggregate({
      where: { userId },
      _sum: { amount: true },
    });

    const totalDebts = await db.debt.aggregate({
      where: { userId },
      _sum: { amount: true },
    });

    const recentProducts = await db.product.findMany({
      where: {
        userId,
        createdAt: { gte: chartStartDate },
      },
      select: {
        createdAt: true,
        updatedAt: true,
        status: true,
      },
    });

    const recentExpenses = await db.expense.findMany({
      where: {
        userId,
        createdAt: { gte: chartStartDate },
      },
      select: {
        createdAt: true,
        amount: true,
      },
    });

    const banglaMonths = ["জানু", "ফেব্রু", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টে", "অক্টো", "নভে", "ডিসে"];

    const chartData = Array.from({ length: chartMonths }).map((_, idx) => {
      const monthOffset = chartMonths - idx - 1;
      const start = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - monthOffset + 1, 1);
      const label = banglaMonths[start.getMonth()];

      const productsCount = recentProducts.filter(
        (p) => new Date(p.createdAt) >= start && new Date(p.createdAt) < end
      ).length;

      const deliveryCount = recentProducts.filter(
        (p) =>
          p.status === "delivered" &&
          new Date(p.updatedAt) >= start &&
          new Date(p.updatedAt) < end
      ).length;

      const expenseSum = recentExpenses
        .filter((e) => new Date(e.createdAt) >= start && new Date(e.createdAt) < end)
        .reduce((sum, e) => sum + (e.amount || 0), 0);

      return {
        month: label,
        products: productsCount,
        delivery: deliveryCount,
        expense: Number(expenseSum.toFixed(0)),
      };
    });

    const monthlyBalance = monthlyIncome - (monthlyExpenses._sum.amount || 0);
    const totalWork = monthlyProducts.length;

    return {
      success: true,
      data: {
        pendingCount,
        kajComplateCount,
        deliveredCount,
        oneMonthOldCount,
        monthlyIncome,
        monthlyExpenses: monthlyExpenses._sum.amount || 0,
        monthlyBalance,
        totalWork,
        totalProducts: allProducts.length,
        totalIncome,
        totalExpenses: totalExpenses._sum.amount || 0,
        totalDebts: totalDebts._sum.amount || 0,
        totalPending: allProducts
          .filter(p => p.status === "delivered")
          .reduce((sum, p) => {
            const remaining = (p.amount || 0) - (p.joma || 0);
            return sum + (remaining > 0 ? remaining : 0);
          }, 0),
        chartData,
      },
    };
  } catch (error) {
    console.error("Error fetching home stats:", error);
    return { success: false, message: error.message };
  }
}

