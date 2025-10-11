import { NextRequest, NextResponse } from "next/server";
import User from "@/database/userModel";

export const PATCH = async (req: NextRequest) => {
  let { id, username, password, status, token } = await req.json();
  
  if (token != process.env.ADMIN_TOKEN)
        return NextResponse.json({ code: 71, message: "Access Forbidden!" }, { status: 401 });

  try {
    const user: any = await User.findByPk(id);
    if (!user)
      return NextResponse.json({ code: 72, message: "User not Found!" }, { status: 404 });

    user.username = username || user.username;
    user.password = password || user.password;
    user.status = status || user.status;
    await user.save();

    return NextResponse.json(user, { status: 200 });
  }
  catch (error: any) {
    return NextResponse.json({ code: 70, message: error.message }, { status: 500 });
  }
};

// modify all comments with new name