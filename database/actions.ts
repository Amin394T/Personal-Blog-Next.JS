'use server';
import { Op } from "sequelize";
import Message from "@/database/messageModel";
import User from "./userModel";


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


export const fetchComments = async (blog: string) => {
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


export const createComment = async (formData: FormData) => {
  const parent = formData.get("parent")?.toString() || "";
  const username = formData.get("username")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  const content = formData.get("content")?.toString() || "";

  if (!content)
    return { code: 34, message: "Comment is Empty!" };

  const authorization = await authorizeUser(username, password);
  if (authorization.code != 0)
    return { code: 30 + authorization.code, message: authorization.message };

  try {
    const message = await Message.create({ user: username, content, parent });
    return { code: 39, ...message.dataValues };
  }
  catch (error: any) {
    return { code: 30, message: error.message };
  }
};