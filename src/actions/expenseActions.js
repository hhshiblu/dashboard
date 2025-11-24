"use server";

import { db } from "@/db/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Get all expenses for the current user with pagination
export async function getExpenses(searchParams = {}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const page = parseInt(searchParams.page || "1");
    const limit = parseInt(searchParams.limit || "3");
    const skip = (page - 1) * limit;
    const search = searchParams.search || "";

    const where = {
      userId: session.user.id,
    };

    if (search) {
      where.reason = { contains: search, mode: "insensitive" };
    }

    const [expenses, total] = await Promise.all([
      db.expense.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      db.expense.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return { 
      success: true, 
      data: expenses,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return { success: false, message: error.message };
  }
}

// Get expense by ID
export async function getExpenseById(id) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const expense = await db.expense.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!expense) {
      return { success: false, message: "Expense not found" };
    }

    return { success: true, data: expense };
  } catch (error) {
    console.error("Error fetching expense:", error);
    return { success: false, message: error.message };
  }
}

// Create expense
export async function createExpense(formData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const data = {
      amount: parseFloat(formData.amount),
      reason: formData.reason,
      userId: session.user.id,
    };

    const expense = await db.expense.create({
      data,
    });

    revalidatePath("/expense");
    return { success: true, data: expense };
  } catch (error) {
    console.error("Error creating expense:", error);
    return { success: false, message: error.message };
  }
}

// Update expense
export async function updateExpense(id, formData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const expense = await db.expense.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!expense) {
      return { success: false, message: "Expense not found" };
    }

    const data = {
      amount: formData.amount ? parseFloat(formData.amount) : expense.amount,
      reason: formData.reason || expense.reason,
    };

    const updatedExpense = await db.expense.update({
      where: { id },
      data,
    });

    revalidatePath("/expense");
    return { success: true, data: updatedExpense };
  } catch (error) {
    console.error("Error updating expense:", error);
    return { success: false, message: error.message };
  }
}

// Delete expense
export async function deleteExpense(id) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const expense = await db.expense.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!expense) {
      return { success: false, message: "Expense not found" };
    }

    await db.expense.delete({
      where: { id },
    });

    revalidatePath("/expense");
    return { success: true, message: "Expense deleted successfully" };
  } catch (error) {
    console.error("Error deleting expense:", error);
    return { success: false, message: error.message };
  }
}

