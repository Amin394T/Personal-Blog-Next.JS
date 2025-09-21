// Next.js route handler for reading messages for a parent (blog post)
import { NextResponse } from 'next/server';
import { readMessages, updateMessage, deleteMessage } from '../../../../database/messageController';


export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const messages = await readMessages(params.id);
    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json({ code: error.code ?? 500, message: error.message ?? 'Unknown error' }, { status: 400 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const result = await updateMessage(params.id, body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ code: error.code ?? 500, message: error.message ?? 'Unknown error' }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const result = await deleteMessage(params.id, body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ code: error.code ?? 500, message: error.message ?? 'Unknown error' }, { status: 400 });
  }
}
