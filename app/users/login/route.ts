import { NextRequest, NextResponse } from "next/server";
import User from "@/database/userModel";

export const POST = async (req: NextRequest) => {
  let { username, password } = await req.json();

  try {
    const user: any = await User.findByPk(username);
    if (!user)
      return NextResponse.json({ code: 21, message: "Invalid Username!" }, { status: 401 });
    if (user.password != password)
      return NextResponse.json({ code: 22, message: "Invalid Password!" }, { status: 401 });
    if (user.status == "blocked")
      return NextResponse.json({ code: 23, message: "Account Blocked!" }, { status: 403 });

    return NextResponse.json({ code: 29, message: "User Authenticated." }, { status: 200 });
  }
  catch (error: any) {
    return NextResponse.json({ code: 20, message: error.message }, { status: 400 });
  }
};