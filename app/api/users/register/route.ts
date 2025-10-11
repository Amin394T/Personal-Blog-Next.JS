import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/database/actions";


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