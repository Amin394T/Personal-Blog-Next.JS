import Message from './messageModel';
import User from './userModel';
import { Op } from 'sequelize';
import { exportData, importData, TOKEN } from './backupUtilities';

async function authorizeUser(username: string, password: string) {
  const user = await User.findByPk(username);
  if (!user) return { code: 1, message: 'Invalid Username!' };
  if (user.get('password') !== password) return { code: 2, message: 'Invalid Password!' };
  if (user.get('status') === 'blocked') return { code: 3, message: 'Account Blocked!' };
  return { code: 0, message: 'User Authorized.' };
}

export async function readMessages(parent: string) {
  return await Message.findAll({
    where: {
      parent,
      status: { [Op.in]: ['normal', 'edited'] },
    },
  });
}

export async function createMessage({ username, password, content, parent }: any) {
  if (!content) throw { code: 34, message: 'Comment is Empty!' };
  const authorization = await authorizeUser(username, password);
  if (authorization.code !== 0) throw { code: 30 + authorization.code, message: authorization.message };
  const message = await Message.create({ user: username, content, parent });
  return { code: 39, ...message.dataValues };
}

export async function updateMessage(id: string, { username, password, content }: any) {
  if (!content) throw { code: 56, message: 'Comment is Empty!' };
  const authorization = await authorizeUser(username, password);
  if (authorization.code !== 0) throw { code: 50 + authorization.code, message: authorization.message };
  const message = await Message.findByPk(id);
  if (!message) throw { code: 54, message: 'Comment not Found!' };
  if (message.get('user') !== username) throw { code: 55, message: 'Access Forbidden!' };
  const timeLimit = new Date(Date.now() - 24 * 60 * 60 * 1000);
  if (new Date(message.get('date') as string | number | Date) < timeLimit) throw { code: 57, message: 'Time Limit Exceeded!' };
  message.set('content', content);
  message.set('status', 'edited');
  message.set('date', new Date());
  await message.save();
  return { code: 59, ...message.dataValues };
}

export async function deleteMessage(id: string, { username, password, token }: any) {
  const authorization = await authorizeUser(username, password);
  if (authorization.code !== 0 && token !== TOKEN) throw { code: 60 + authorization.code, message: authorization.message };
  const message = await Message.findByPk(id);
  if (!message) throw { code: 64, message: 'Comment not Found!' };
  if (message.get('user') !== username) throw { code: 65, message: 'Access Forbidden!' };
  const timeLimit = new Date(Date.now() - 24 * 60 * 60 * 1000);
  if (new Date(message.get('date') as string | number | Date) < timeLimit) throw { code: 66, message: 'Time Limit Exceeded!' };
  message.set('status', token !== TOKEN ? 'removed' : 'blocked');
  message.set('date', new Date());
  await message.save();
  await Message.update(
    { status: 'orphan' },
    { where: { parent: id, status: { [Op.in]: ['normal', 'edited'] } } }
  );
  return { code: 69, ...message.dataValues };
}

export async function exportMessages(token: string) {
  return await exportData(Message, token);
}

export async function importMessages(token: string, fileName: string) {
  return await importData(Message, token, fileName);
}
