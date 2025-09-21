// Next.js route handler for exporting users
import { NextResponse } from 'next/server';
import { exportUsers } from '../../../../database/userController';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await exportUsers(body.token);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ code: error.code ?? 500, message: error.message ?? 'Unknown error' }, { status: 400 });
  }
}
