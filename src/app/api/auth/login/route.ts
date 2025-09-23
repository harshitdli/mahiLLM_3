import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/userModel";

export async function POST(req: Request) {
  await dbConnect();
  const { email, password } = await req.json();
  const user = await User.findOne({ email, password });
  if (!user) {
    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
  }
  // Placeholder for session/token logic
  return NextResponse.json({ success: true, user });
}
