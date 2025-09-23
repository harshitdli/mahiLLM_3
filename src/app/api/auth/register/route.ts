import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/userModel";

export async function POST(req: Request) {
  await dbConnect();
  const { name, age, email, password, phone, tier } = await req.json();
  try {
    const user = await User.create({ name, age, email, password, phone, tier });
    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
