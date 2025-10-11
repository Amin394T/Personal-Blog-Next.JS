import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/database/actions";
import User from "@/database/userModel";
import Message from "@/database/messageModel";


export const POST = async (req: NextRequest) => {
  let { username, password } = await req.json();

  const result = await registerUser(username, password);

  switch (result.code) {
    case 11:
    case 12:
    case 13:
      return NextResponse.json(result, { status: 422 });
    case 19:
      return NextResponse.json(result, { status: 201 });
    default:
      return NextResponse.json(result, { status: 500 });
  }
};


export const PATCH = async (req: NextRequest) => {
  let { id, username, password, status, token } = await req.json();
  
  if (token != process.env.ADMIN_TOKEN)
    return NextResponse.json({ code: 71, message: "Access Forbidden!" }, { status: 401 });

  try {
    const user: any = await User.findByPk(id);
    if (!user)
      return NextResponse.json({ code: 72, message: "User not Found!" }, { status: 404 });

    await User.update(
      { username, password, status },
      { where: { username: id } }
    );

    await Message.update(
      { user: username },
      { where: { user: id } }
    );

    return NextResponse.json({ code: 79, message: "User Modified."}, { status: 200 });
  }
  catch (error: any) {
    return NextResponse.json({ code: 70, message: error.message }, { status: 500 });
  }
};