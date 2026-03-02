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
    
    const snippet = await prisma.snippet.findUnique({
      where: { id },
    });

    if (!snippet || snippet.userId !== (session.user as any).id) {
      return NextResponse.json({ message: "Snippet not found" }, { status: 404 });
    }

    await prisma.snippet.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Snippet deleted" });
  } catch (err) {
    return NextResponse.json({ message: "Error deleting snippet" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const { title, code, tags } = await req.json();

    const snippet = await prisma.snippet.findUnique({
      where: { id },
    });

    if (!snippet || snippet.userId !== (session.user as any).id) {
      return NextResponse.json({ message: "Snippet not found" }, { status: 404 });
    }

    const updated = await prisma.snippet.update({
      where: { id },
      data: { title, code, tags },
    });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ message: "Error updating snippet" }, { status: 500 });
  }
}
