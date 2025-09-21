// Next.js route handler for importing messages
import { NextResponse } from 'next/server';
import { importMessages } from '../../../../database/messageController';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await importMessages(body.token, body.fileName);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ code: error.code ?? 500, message: error.message ?? 'Unknown error' }, { status: 400 });
  }
}
