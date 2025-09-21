// Next.js route handler for modifying user info/status
import { NextResponse } from 'next/server';
import { modifyUser } from '../../../../../database/userController';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const result = await modifyUser(params.id, body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ code: error.code ?? 500, message: error.message ?? 'Unknown error' }, { status: 400 });
  }
}
