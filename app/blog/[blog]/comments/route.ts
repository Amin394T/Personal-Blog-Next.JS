import { NextResponse } from "next/server";

type Parameters = {
  params: Promise<{ blog: string }>;
};

export const GET = async (_req: Request, { params }: Parameters) => {
  const { blog } = await params;

  return NextResponse.json({ lastButOne: blog });
};
