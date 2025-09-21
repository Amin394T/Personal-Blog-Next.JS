import { NextRequest, NextResponse } from "next/server";
import Message from "@/database/messageModel";
import { Op } from "sequelize";

type Parameters = {
  params: Promise<{ blog: string }>;
};

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
