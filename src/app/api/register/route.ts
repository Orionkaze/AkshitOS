import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
