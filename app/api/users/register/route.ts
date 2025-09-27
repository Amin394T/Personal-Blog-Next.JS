import { NextRequest, NextResponse } from "next/server";
import User from "@/database/userModel";

export const POST = async (req: NextRequest) => {
  let { username, password } = await req.json();
  username = username.trim();
  const usernameRegex = /^[a-zA-Z0-9\u0600-\u06FF ]+$/;

  if (!usernameRegex.test(username))
    return NextResponse.json({ code: 11, message: "Username must be Alphanumeric!" }, { status: 400 });
  if (username.length < 3 || username.length > 25)
    return NextResponse.json({ code: 12, message: "Invalid Username Length!" }, { status: 400 });
  if (password.length < 8 || password.length > 100)
    return NextResponse.json({ code: 13, message: "Invalid Password Length!" }, { status: 400 });

  try {
      await User.create({ username, password });
      return NextResponse.json({ code: 19, message: "User Registered." }, { status: 201 });
  }
  catch (error: any) {
    return NextResponse.json({ code: 10, message: error.message }, { status: 400 });
  }
};