"use server";

import { db } from "@/db/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Get all debts for the current user with pagination
export async function getDebts(searchParams = {}) {
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
      where.OR = [
        { debtor: { contains: search, mode: "insensitive" } },
        { reason: { contains: search, mode: "insensitive" } },
      ];
    }

    const [debts, total] = await Promise.all([
      db.debt.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      db.debt.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return { 
      success: true, 
      data: debts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  } catch (error) {
    console.error("Error fetching debts:", error);
    return { success: false, message: error.message };
  }
}

// Get debt by ID
export async function getDebtById(id) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const debt = await db.debt.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!debt) {
      return { success: false, message: "Debt not found" };
    }

    return { success: true, data: debt };
  } catch (error) {
    console.error("Error fetching debt:", error);
    return { success: false, message: error.message };
  }
}

// Create debt
export async function createDebt(formData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const data = {
      debtor: formData.debtor,
      amount: parseFloat(formData.amount),
      reason: formData.reason,
      paid: false,
      userId: session.user.id,
    };

    const debt = await db.debt.create({
      data,
    });

    revalidatePath("/debt");
    return { success: true, data: debt };
  } catch (error) {
    console.error("Error creating debt:", error);
    return { success: false, message: error.message };
  }
}

// Update debt
export async function updateDebt(id, formData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const debt = await db.debt.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!debt) {
      return { success: false, message: "Debt not found" };
    }

    const data = {
      debtor: formData.debtor || debt.debtor,
      amount: formData.amount ? parseFloat(formData.amount) : debt.amount,
      reason: formData.reason || debt.reason,
      paid: formData.paid !== undefined ? formData.paid : debt.paid,
    };

    const updatedDebt = await db.debt.update({
      where: { id },
      data,
    });

    revalidatePath("/debt");
    return { success: true, data: updatedDebt };
  } catch (error) {
    console.error("Error updating debt:", error);
    return { success: false, message: error.message };
  }
}

// Delete debt
export async function deleteDebt(id) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const debt = await db.debt.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!debt) {
      return { success: false, message: "Debt not found" };
    }

    await db.debt.delete({
      where: { id },
    });

    revalidatePath("/debt");
    return { success: true, message: "Debt deleted successfully" };
  } catch (error) {
    console.error("Error deleting debt:", error);
    return { success: false, message: error.message };
  }
}

