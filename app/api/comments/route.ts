import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";
import Message from "@/database/messageModel";
import User from "@/database/userModel";

type Parameters = {
  params: Promise<{ blog: string }>;
};


async function authorizeUser(username: string, password: string) {
  const user: any = await User.findByPk(username);
  if (!user)
    return { code: 1, message: "Invalid Username!" };
  if (user.password != password)
    return { code: 2, message: "Invalid Password!" };
  if (user.status == "blocked")
    return { code: 3, message: "Account Blocked!" };
  
  return { code: 0, message: "User Authorized." };
}


export const GET = async (_req: NextRequest, { params }: Parameters) => {
  const { blog } = await params;

  try {
    const messages = await Message.findAll({
      where: {
        parent: blog,
        status: { [Op.in]: ["normal", "edited"] },
      },
    });

    return NextResponse.json(messages);
  }
  catch (error: any) {
    return NextResponse.json({ code: 40, message: error.message });
  }
};

export const POST = async (req: NextRequest) => {
  const { parent, username, password, content } = await req.json();

  if (!content)
      return NextResponse.json({ code: 34, message: "Comment is Empty!" }, { status: 422 });

  const authorization = await authorizeUser(username, password);
  if (authorization.code != 0)
    return NextResponse.json({ code: 30 + authorization.code, message: authorization.message }, { status: 401 });

  try {
    const message = await Message.create({ user: username, content, parent });

    return NextResponse.json({ code: 39, ...message.dataValues }, { status: 201 });
  }
  catch (error: any) {
    return NextResponse.json({ code: 30, message: error.message }, { status: 400 });
  }
};


export const PUT = async (req: NextRequest) => {
  const { id, username, password, content } = await req.json();

  if (!content)
      return NextResponse.json({ code: 56, message: "Comment is Empty!" }, { status: 422 });

  const authorization = await authorizeUser(username, password);
  if (authorization.code != 0)
    return NextResponse.json({ code: 50 + authorization.code, message: authorization.message }, { status: 401 });

  try {
    const message: any = await Message.findByPk(id);

    if (!message)
      return NextResponse.json({ code: 54, message: "Comment not Found!" }, { status: 404 });
    if (message.user != username)
      return NextResponse.json({ code: 55, message: "Access Forbidden!" }, { status: 403 });

    const timeLimit = new Date(Date.now() - 24 * 60 * 60 * 1000);
    if (new Date(message.date) < timeLimit)
      return NextResponse.json({ code: 57, message: "Time Limit Exceeded!" }, { status: 403 });

    message.content = content;
    message.status = "edited";
    message.date = new Date();
    await message.save();

    return NextResponse.json({ code: 59, ...message.dataValues }, { status: 200 });
  }
  catch (error: any) {
    return NextResponse.json({ code: 50, message: error.message }, { status: 400 });
  }
}

    
export const DELETE = async (req: NextRequest) => {
  const { id, username, password, token } = await req.json();

  const authorization = await authorizeUser(username, password);
  if (authorization.code != 0 && token != process.env.ADMIN_TOKEN)
    return NextResponse.json({ code: 60 + authorization.code, message: authorization.message }, { status: 401 });

  try {
    const message: any = await Message.findByPk(id);

    if (!message)
      return NextResponse.json({ code: 64, message: "Comment not Found!" }, { status: 404 });
    if (message.user != username)
      return NextResponse.json({ code: 65, message: "Access Forbidden!" }, { status: 403 });

    const timeLimit = new Date(Date.now() - 24 * 60 * 60 * 1000);
    if (new Date(message.date) < timeLimit)
      return NextResponse.json({ code: 66, message: "Time Limit Exceeded!" }, { status: 403 });

    token != process.env.ADMIN_TOKEN
      ? message.status = "removed"
      : message.status = "blocked";
    message.date = new Date();
    await message.save();

    await Message.update(
      { status: "orphan" },
      { where: { 
          parent: id,
          status: { [Op.in]: ["normal", "edited"] }
      }}
    );

    return NextResponse.json({ code: 69, ...message.dataValues }, { status: 200 });
  }
  catch (error: any) {
    return NextResponse.json({ code: 60, message: error.message }, { status: 400 });
  }
}