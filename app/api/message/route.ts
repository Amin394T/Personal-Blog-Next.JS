// Next.js route handler for creating a message
import { NextResponse } from 'next/server';
import { createMessage } from '../../../database/messageController';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createMessage(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ code: error.code ?? 500, message: error.message ?? 'Unknown error' }, { status: 400 });
  }
}
