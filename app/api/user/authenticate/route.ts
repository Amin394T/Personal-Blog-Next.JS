// Next.js route handler for user authentication
import { NextResponse } from 'next/server';
import { authenticateUser } from '../../../../database/userController';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await authenticateUser(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ code: error.code ?? 500, message: error.message ?? 'Unknown error' }, { status: 400 });
  }
}
