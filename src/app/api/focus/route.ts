import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const sessions = await prisma.focusSession.findMany({
      where: { userId: (session.user as any).id as string },
      orderBy: { timestamp: "desc" },
    });
    return NextResponse.json(sessions);
  } catch (err) {
    return NextResponse.json({ message: "Error fetching sessions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { duration, completed } = await req.json();

    const newSession = await prisma.focusSession.create({
      data: {
        userId: (session.user as any).id as string,
        duration: parseInt(duration),
        completed: !!completed,
      },
    });

    return NextResponse.json(newSession, { status: 201 });
  } catch (err) {
    console.error("FocusSession POST error:", err);
    return NextResponse.json({ message: "Error logging session" }, { status: 500 });
  }
}
