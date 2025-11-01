'use server';
import { Op } from "sequelize";
import Message from "@/database/messageModel";
import User from "./userModel";


// User management functions

export const authorizeUser = async (username: string, password: string) => {
  const user: any = await User.findByPk(username);

  if (!user)
    return { code: 1, message: "Invalid Username!" };
  if (user.password != password)
    return { code: 2, message: "Invalid Password!" };
  if (user.status == "blocked")
    return { code: 3, message: "Account Blocked!" };
  
  return { code: 0, message: "User Authorized." };
}


export const registerUser = async (username: string, password: string) => {
  username = username.trim();
  const usernameRegex = /^[a-zA-Z0-9\u0600-\u06FF ]+$/;

  if (!usernameRegex.test(username))
    return { code: 11, message: "Username must be Alphanumeric!" };
  if (username.length < 3 || username.length > 25)
    return { code: 12, message: "Invalid Username Length!" };
  if (password.length < 8 || password.length > 100)
    return { code: 13, message: "Invalid Password Length!" };

  try {
      await User.create({ username, password });
      return { code: 19, message: "User Registered." };
  }
  catch (error: any) {
    return { code: 10, message: error.message };
  }
};


// Comment management actions

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


export const createComment = async (parent: string | number, formData: FormData) => {
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


export const updateComment = async (id: string, formData: FormData) => {
  const username = formData.get("username")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  const content = formData.get("content")?.toString() || "";

  if (!content)
    return { code: 56, message: "Comment is Empty!" };

  const authorization = await authorizeUser(username, password);
  if (authorization.code != 0)
    return { code: 50 + authorization.code, message: authorization.message };

  try {
    const message: any = await Message.findByPk(id);

    if (!message)
      return { code: 54, message: "Comment Not Found!" };
    if (message.user != username)
      return { code: 55, message: "Permission Denied!" };

      const timeLimit = new Date(Date.now() - Number(process.env.EDIT_HOURS_LIMIT) * 60 * 60 * 1000);
      if (new Date(message.date) < timeLimit)
        return { code: 57, message: "Time Limit Exceeded!" };

    message.content = content;
    message.status = "edited";
    message.date = new Date();
    await message.save();

    return { code: 59, ...message.dataValues };
  }
  catch (error: any) {
    return { code: 50, message: error.message };
  }
};


export const deleteComment = async (id: string, username: string, password: string) => {
  const authorization = await authorizeUser(username, password);
  if (authorization.code != 0)
    return { code: 60 + authorization.code, message: authorization.message };

  try {
    const message: any = await Message.findByPk(id);

    if (!message)
      return { code: 64, message: "Comment Not Found!" };
    if (message.user != username)
      return { code: 65, message: "Permission Denied!" };

    const timeLimit = new Date(Date.now() - Number(process.env.EDIT_HOURS_LIMIT) * 60 * 60 * 1000);
    if (new Date(message.date) < timeLimit)
      return { code: 66, message: "Time Limit Exceeded!" };

    message.status = "removed"
    message.date = new Date();
    await message.save();

    await Message.update(
      { status: "orphan" },
      { where: { 
          parent: id,
          status: { [Op.in]: ["normal", "edited"] }
      }}
    );

    return { code: 69, ...message.dataValues };
  }
  catch (error: any) {
    return { code: 60, message: error.message };
  }
};