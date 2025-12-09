"use server";

import { db } from "@/db/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Get all products for the current user with pagination and filtering
export async function getProducts(searchParams = {}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const page = parseInt(searchParams.page || "1");
    const limit = parseInt(searchParams.limit || "12");
    const skip = (page - 1) * limit;
    
    const search = searchParams.search || "";
    const status = searchParams.status || "";
    const dateFilter = searchParams.dateFilter || "";

    // Build where clause
    const where = {
      userId: session.user.id,
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { customerName: { contains: search, mode: "insensitive" } },
        { customerPhone: { contains: search, mode: "insensitive" } },
      ];
    }

    // Date filters
    if (dateFilter === "oneMonth") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      where.createdAt = { lte: oneMonthAgo };
    } else if (dateFilter === "thisMonth") {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      where.createdAt = { gte: startOfMonth };
    } else if (dateFilter === "lastSixMonths") {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      where.createdAt = { gte: sixMonthsAgo };
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      db.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return { 
      success: true, 
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, message: error.message };
  }
}

// Get product by ID
export async function getProductById(id) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const product = await db.product.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!product) {
      return { success: false, message: "Product not found" };
    }

    return { success: true, data: product };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { success: false, message: error.message };
  }
}

// Create product
export async function createProduct(formData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const data = {
      type: formData.type || "অন্যান্য",
      name: formData.name,
      customerName: formData.customerName,
      customerAddress: formData.customerAddress || null,
      customerPhone: formData.customerPhone || null,
      amount: formData.amount ? parseFloat(formData.amount) : null,
      joma: formData.joma ? parseFloat(formData.joma) : 0,
      status: "pending",
      userId: session.user.id,
    };

    const product = await db.product.create({
      data,
    });

    revalidatePath("/products");
    return { success: true, data: product };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, message: error.message };
  }
}

// Update product
export async function updateProduct(id, formData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const product = await db.product.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!product) {
      return { success: false, message: "Product not found" };
    }

    const data = {
      type: formData.type || product.type,
      name: formData.name || product.name,
      customerName: formData.customerName || product.customerName,
      customerAddress: formData.customerAddress !== undefined ? formData.customerAddress : product.customerAddress,
      customerPhone: formData.customerPhone !== undefined ? formData.customerPhone : product.customerPhone,
      amount: formData.amount ? parseFloat(formData.amount) : product.amount,
      joma: formData.joma ? parseFloat(formData.joma) : product.joma,
    };

    const updatedProduct = await db.product.update({
      where: { id },
      data,
    });

    revalidatePath("/products");
    return { success: true, data: updatedProduct };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, message: error.message };
  }
}

// Delete product
export async function deleteProduct(id) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const product = await db.product.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!product) {
      return { success: false, message: "Product not found" };
    }

    await db.product.delete({
      where: { id },
    });

    revalidatePath("/products");
    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, message: error.message };
  }
}

// Update product status
export async function updateProductStatus(id, status, finalJoma, discount) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const product = await db.product.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!product) {
      return { success: false, message: "Product not found" };
    }

    const updateData = {
      status: status,
    };

    // If status is delivered, update joma and discount
    if (status === "delivered") {
      const totalAmount = product.amount || 0;
      
      // Update joma (already calculated in component)
      updateData.joma = finalJoma || product.joma || 0;
      
      // Update discount (already calculated in component)
      updateData.discount = discount || 0;
      
      // Calculate final remaining
      const finalRemaining = totalAmount - updateData.joma - updateData.discount;
      if (finalRemaining > 0) {
        updateData.bakiAmount = finalRemaining;
        updateData.baki = true;
      } else {
        updateData.bakiAmount = 0;
        updateData.baki = false;
      }
    }

    const updatedProduct = await db.product.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/products");
    return { success: true, data: updatedProduct };
  } catch (error) {
    console.error("Error updating product status:", error);
    return { success: false, message: error.message };
  }
}

