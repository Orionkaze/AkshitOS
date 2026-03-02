import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const entries = await prisma.devMoodEntry.findMany({
      where: { userId: (session.user as any).id as string },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(entries);
  } catch (err) {
    return NextResponse.json({ message: "Error fetching entries" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { mood, hours, energy, note } = await req.json();

    const entry = await prisma.devMoodEntry.create({
      data: {
        userId: (session.user as any).id as string,
        mood,
        hours: parseFloat(hours),
        energy: parseInt(energy),
        note,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (err) {
    console.error("DevMood POST error:", err);
    return NextResponse.json({ message: "Error creating entry" }, { status: 500 });
  }
}
