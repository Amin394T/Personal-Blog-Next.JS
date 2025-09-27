import fs from 'node:fs';
import path from 'node:path';
import { NextRequest, NextResponse } from "next/server";
import Message from "@/database/messageModel";
import User from '@/database/userModel';

type Parameters = {
  params: Promise<{ entity: string }>;
};


export const GET = async (req: NextRequest, { params }: Parameters) => {
  const { token } = await req.json();
  const { entity } = await params;
  let Model: any = entity == 'comments' ? Message : entity == 'users' ? User : null;

  if (token !== process.env.ADMIN_TOKEN)
    return NextResponse.json({ code: 81, message: "Access Forbidden!" }, { status: 403 });

  try {
    const data = await Model.findAll();
    const fileName = `${Model.name}_${Date.now()}.json`;
    const filePath = path.join(process.cwd(), 'database', fileName);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    const fileContent = fs.readFileSync(filePath);

    const headers = {
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Type': 'application/json',
    };
    return new NextResponse(fileContent, { status: 200, headers });
  }
  catch (error: any) {
    return NextResponse.json({ code: 80, message: error.message }, { status: 400 });
  }
};

export const POST = async (req: NextRequest, { params }: Parameters) => {
  const { token, fileName } = await req.json();
  const { entity } = await params;
  let Model: any = entity == 'comments' ? Message : entity == 'users' ? User : null;

  if (token !== process.env.ADMIN_TOKEN)
    return NextResponse.json({ code: 91, message: "Access Forbidden!" }, { status: 403 });

  try {
    const filePath = path.join(process.cwd(), 'database', fileName);
    if (!fs.existsSync(filePath))
      return NextResponse.json({ code: 92, message: "File not Found!" }, { status: 404 });

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    for (const item of data)
      await Model.upsert(item);

    return NextResponse.json({ code: 99, message: "Import Succeeded." }, { status: 200 });
  }
  catch (error: any) {
    return NextResponse.json({ code: 90, message: error.message }, { status: 400 });
  }
};