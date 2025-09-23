import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/userModel";

export async function POST(req: Request) {
  await dbConnect();
  const { email, tier } = await req.json();
  const user = await User.findOneAndUpdate({ email }, { tier }, { new: true });
  if (!user) {
    return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, user });
}
