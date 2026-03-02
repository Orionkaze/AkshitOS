import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { id } = params;
    const log = await prisma.studyLog.findUnique({ where: { id } });

    if (!log || log.userId !== (session.user as any).id) {
      return NextResponse.json({ message: "Log not found" }, { status: 404 });
    }

    await prisma.studyLog.delete({ where: { id } });
    return NextResponse.json({ message: "Log deleted" });
  } catch (err) {
    return NextResponse.json({ message: "Error deleting log" }, { status: 500 });
  }
}
