import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";
import Message from "@/database/messageModel";
import User from "@/database/userModel";

type Parameters = {
  params: Promise<{ blog: string }>;
};


async function authorizeUser(username: string, password: string) {
  const user = await User.findByPk(username);
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


export const POST = async (req: NextRequest, { params }: Parameters) => {
  const { blog } = await params;
  const { parent, username, password, content } = await req.json();

  if (!content)
      return NextResponse.json({ code: 34, message: "Comment is Empty!" }); //422

  const authorization = await authorizeUser(username, password);
    if (authorization.code != 0)
      return NextResponse.json({ code: 30 + authorization.code, message: authorization.message }); //401

  try {
    const message = await Message.create({ user: username, content, parent });

    return NextResponse.json({ code: 39, ...message.dataValues }); //201
  }
  catch (error: any) {
    return NextResponse.json({ code: 30, message: error.message }); //400
  }
};





    
    
    