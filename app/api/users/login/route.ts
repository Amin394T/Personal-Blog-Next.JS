import { NextRequest, NextResponse } from "next/server";
import { authorizeUser } from "@/database/actions";


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