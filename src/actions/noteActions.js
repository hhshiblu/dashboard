"use server";

import { db } from "@/db/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Get all notes for the current user with pagination
export async function getNotes(searchParams = {}) {
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
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const [notes, total] = await Promise.all([
      db.note.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      db.note.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return { 
      success: true, 
      data: notes,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  } catch (error) {
    console.error("Error fetching notes:", error);
    return { success: false, message: error.message };
  }
}

// Get note by ID
export async function getNoteById(id) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const note = await db.note.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!note) {
      return { success: false, message: "Note not found" };
    }

    return { success: true, data: note };
  } catch (error) {
    console.error("Error fetching note:", error);
    return { success: false, message: error.message };
  }
}

// Create note
export async function createNote(formData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const data = {
      title: formData.title || null,
      content: formData.content,
      status: formData.status || "সক্রিয়",
      userId: session.user.id,
    };

    const note = await db.note.create({
      data,
    });

    revalidatePath("/notes");
    return { success: true, data: note };
  } catch (error) {
    console.error("Error creating note:", error);
    return { success: false, message: error.message };
  }
}

// Update note
export async function updateNote(id, formData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const note = await db.note.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!note) {
      return { success: false, message: "Note not found" };
    }

    const data = {
      title: formData.title !== undefined ? formData.title : note.title,
      content: formData.content || note.content,
      status: formData.status || note.status,
    };

    const updatedNote = await db.note.update({
      where: { id },
      data,
    });

    revalidatePath("/notes");
    return { success: true, data: updatedNote };
  } catch (error) {
    console.error("Error updating note:", error);
    return { success: false, message: error.message };
  }
}

// Delete note
export async function deleteNote(id) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const note = await db.note.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!note) {
      return { success: false, message: "Note not found" };
    }

    await db.note.delete({
      where: { id },
    });

    revalidatePath("/notes");
    return { success: true, message: "Note deleted successfully" };
  } catch (error) {
    console.error("Error deleting note:", error);
    return { success: false, message: error.message };
  }
}

