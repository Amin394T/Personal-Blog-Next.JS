// Next.js route handler for importing users
import { NextResponse } from 'next/server';
import { importUsers } from '../../../../database/userController';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await importUsers(body.token, body.fileName);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ code: error.code ?? 500, message: error.message ?? 'Unknown error' }, { status: 400 });
  }
}
