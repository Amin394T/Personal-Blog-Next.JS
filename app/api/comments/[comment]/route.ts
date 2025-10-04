import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";
import Message from "@/database/messageModel";

type Parameters = {
  params: Promise<{ comment: string }>;
};


export const GET = async (_req: NextRequest, { params }: Parameters) => {
  const { comment } = await params;

  try {
    const comments: any = await Message.findAll({
      where: {
        parent: comment,
        status: { [Op.in]: ["normal", "edited"] },
      },
    });

    for (let comment of comments) {
      const replies = await Message.findAll({
        where: {
          parent: comment.id,
          status: { [Op.in]: ["normal", "edited"] },
        },
      });
      comment.setDataValue('replies', replies);
    }

    return NextResponse.json(comments);
  }
  catch (error: any) {
    return NextResponse.json({ code: 40, message: error.message });
  }
};