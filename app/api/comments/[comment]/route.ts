import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";
import Message from "@/database/messageModel";

type Parameters = {
  params: Promise<{ comment: string }>;
};


export const GET = async (_req: NextRequest, { params }: Parameters) => {
  const { comment } = await params;

  try {
    const messages = await Message.findAll({
      where: {
        parent: comment,
        status: { [Op.in]: ["normal", "edited"] },
      },
    });

    return NextResponse.json(messages);
  }
  catch (error: any) {
    return NextResponse.json({ code: 40, message: error.message });
  }
};