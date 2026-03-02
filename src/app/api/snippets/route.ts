import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  try {
    const snippets = await prisma.snippet.findMany({
      where: { 
        userId: (session.user as any).id as string,
        OR: query ? [
          { title: { contains: query, mode: 'insensitive' } },
          { code: { contains: query, mode: 'insensitive' } },
        ] : undefined
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(snippets);
  } catch (err) {
    return NextResponse.json({ message: "Error fetching snippets" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { title, code, tags } = await req.json();

    const snippet = await prisma.snippet.create({
      data: {
        userId: (session.user as any).id as string,
        title,
        code,
        tags: tags || [],
      },
    });

    return NextResponse.json(snippet, { status: 201 });
  } catch (err) {
    console.error("Snippet POST error:", err);
    return NextResponse.json({ message: "Error creating snippet" }, { status: 500 });
  }
}
