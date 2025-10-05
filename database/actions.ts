import { Op } from "sequelize";
import Message from "@/database/messageModel";

export const getComments = async (blog: string) => {
  try {
    let comments: any = await Message.findAll({
      where: {
        parent: blog,
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

    return JSON.parse(JSON.stringify(comments));
  }
  catch (error: any) {
    return { code: 40, message: error.message };
  }
};