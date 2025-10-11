import { NextRequest, NextResponse } from "next/server";
import { authorizeUser } from "@/database/actions";
import User from "@/database/userModel";


export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") || "";
  const token = searchParams.get("token") || "";
  
  if (token != process.env.ADMIN_TOKEN)
    return NextResponse.json({ code: 1, message: "Access Forbidden!" }, { status: 401 });
  
  try {
    let users = id
      ? await User.findByPk(id)
      : await User.findAll();
    
    if (id && !users)
        return NextResponse.json({ code: 2, message: "User not Found!" }, { status: 404 });

    return NextResponse.json(users, { status: 200 });
  }
  catch (error: any) {
    return NextResponse.json({ code: 0, message: error.message }, { status: 500 });
  }
};


export const POST = async (req: NextRequest) => {
  let { username, password } = await req.json();

  const result = await authorizeUser(username, password);
  result.code += 20;

  switch (result.code) {
    case 21:
    case 22:
      return NextResponse.json(result, { status: 401 });
    case 23:
      return NextResponse.json(result, { status: 403 });
    case 29:
      return NextResponse.json(result, { status: 200 });
    default:
      return NextResponse.json(result, { status: 500 });
  }
};