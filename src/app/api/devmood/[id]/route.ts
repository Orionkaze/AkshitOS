import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    
    // Ensure the entry belongs to the user
    const entry = await prisma.devMoodEntry.findUnique({
      where: { id },
    });

    if (!entry || entry.userId !== (session.user as any).id) {
      return NextResponse.json({ message: "Entry not found" }, { status: 404 });
    }

    await prisma.devMoodEntry.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Entry deleted" });
  } catch (err) {
    console.error("DevMood DELETE error:", err);
    return NextResponse.json({ message: "Error deleting entry" }, { status: 500 });
  }
}
