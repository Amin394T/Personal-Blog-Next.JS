import { NextRequest, NextResponse } from "next/server";
import { createComment, updateComment, deleteComment } from "@/database/actions";


export const POST = async (req: NextRequest) => {
  const { parent, username, password, content } = await req.json();

  const formData = new FormData();
  formData.set("username", username);
  formData.set("password", password);
  formData.set("content", content || "");

  const result = await createComment(parent, formData);

  switch (result.code) {
    case 31:
    case 32:
      return NextResponse.json(result, { status: 401 });
    case 33:
      return NextResponse.json(result, { status: 403 });
    case 34:
      return NextResponse.json(result, { status: 422 });
    case 39:
      return NextResponse.json(result, { status: 201 });
    default:
      return NextResponse.json(result, { status: 500 });
  }
};


export const PATCH = async (req: NextRequest) => {
  const { id, username, password, content } = await req.json();

  const formData = new FormData();
  formData.set("username", username);
  formData.set("password", password);
  formData.set("content", content);

  const result = await updateComment(id.toString(), formData);

  switch (result.code) {
    case 51:
    case 52:
      return NextResponse.json(result, { status: 401 });
    case 53:
    case 55:
    case 57:
      return NextResponse.json(result, { status: 403 });
    case 54:
      return NextResponse.json(result, { status: 404 });
    case 56:
      return NextResponse.json(result, { status: 422 });
    case 59:
      return NextResponse.json(result, { status: 200 });
    default:
      return NextResponse.json(result, { status: 500 });
  }
};

    
export const DELETE = async (req: NextRequest) => {
  const { id, username, password } = await req.json();

  const result = await deleteComment(id, username, password);

  switch (result.code) {
    case 61:
    case 62:
      return NextResponse.json(result, { status: 401 });
    case 63:
    case 65:
    case 66:
      return NextResponse.json(result, { status: 403 });
    case 64:
      return NextResponse.json(result, { status: 404 });
    case 69:
      return NextResponse.json(result, { status: 200 });
    default:
      return NextResponse.json(result, { status: 500 });
  }
}