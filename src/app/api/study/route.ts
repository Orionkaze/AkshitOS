import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const logs = await prisma.studyLog.findMany({
      where: { userId: (session.user as any).id as string },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(logs);
  } catch (err) {
    return NextResponse.json({ message: "Error fetching study logs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { subject, hours, confidence } = await req.json();

    const log = await prisma.studyLog.create({
      data: {
        userId: (session.user as any).id as string,
        subject,
        hours: parseFloat(hours),
        confidence: parseInt(confidence),
      },
    });

    return NextResponse.json(log, { status: 201 });
  } catch (err) {
    console.error("Study POST error:", err);
    return NextResponse.json({ message: "Error creating log" }, { status: 500 });
  }
}
