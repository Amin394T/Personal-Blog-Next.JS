import User from './userModel';
import { exportData, importData, TOKEN } from './backupUtilities';

export async function registerUser({ username, password }: any) {
  username = username.trim();
  const usernameRegex = /^[a-zA-Z0-9\u0600-\u06FF ]+$/;
  if (!usernameRegex.test(username)) throw { code: 11, message: 'Username must be Alphanumeric!' };
  if (username.length < 3 || username.length > 25) throw { code: 12, message: 'Invalid Username Length!' };
  if (password.length < 8 || password.length > 100) throw { code: 13, message: 'Invalid Password Length!' };
  await User.create({ username, password });
  return { code: 19, message: 'User Registered.' };
}

export async function authenticateUser({ username, password }: any) {
  const user = await User.findByPk(username);
  if (!user) throw { code: 21, message: 'Invalid Username!' };
  if (user.get('password') !== password) throw { code: 22, message: 'Invalid Password!' };
  if (user.get('status') === 'blocked') throw { code: 23, message: 'Account Blocked!' };
  return { code: 29, message: 'User Authenticated.' };
}

export async function modifyUser(id: string, { username, password, toggle, token }: any) {
  if (token !== TOKEN) throw { code: 71, message: 'Access Forbidden!' };
  const user = await User.findByPk(id);
  if (!user) throw { code: 72, message: 'User not Found!' };
  user.set('username', username || user.get('username'));
  user.set('password', password || user.get('password'));
  user.set('status', toggle === 'Y' ? 'blocked' : toggle === 'N' ? 'active' : user.get('status'));
  await user.save();
  return user;
}

export async function exportUsers(token: string) {
  return await exportData(User, token);
}

export async function importUsers(token: string, fileName: string) {
  return await importData(User, token, fileName);
}
