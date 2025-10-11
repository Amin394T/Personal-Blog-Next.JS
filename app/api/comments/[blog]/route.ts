import { NextRequest, NextResponse } from "next/server";
import { fetchComments } from "@/database/actions";

type Parameters = {
  params: Promise<{ blog: string }>;
};


export const GET = async (_req: NextRequest, { params }: Parameters) => {
  const { blog } = await params;

  const result = await fetchComments(blog);
  switch (result.code) {
    case 40:
      return NextResponse.json(result, { status: 500 });
    default:
      return NextResponse.json(result, { status: 200 });   
  }
};