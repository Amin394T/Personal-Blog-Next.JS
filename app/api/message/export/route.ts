// Next.js route handler for exporting messages
import { NextResponse } from 'next/server';
import { exportMessages } from '../../../../database/messageController';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await exportMessages(body.token);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ code: error.code ?? 500, message: error.message ?? 'Unknown error' }, { status: 400 });
  }
}
