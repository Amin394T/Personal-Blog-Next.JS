import fs from 'fs';
import path from 'path';

const TOKEN = process.env.ADMIN_TOKEN || 'changeme';

export async function exportData(model: any, token: string) {
  if (token !== TOKEN) throw new Error('Access Denied!');
  const data = await model.findAll();
  const fileName = `${model.name}_${Date.now()}.json`;
  const filePath = path.join(process.cwd(), 'database', fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return { fileName, filePath };
}

export async function importData(model: any, token: string, fileName: string) {
  if (token !== TOKEN) throw new Error('Access Denied!');
  const filePath = path.join(process.cwd(), 'database', fileName);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  for (const item of data) await model.upsert(item);
  return { message: 'Import Succeeded.' };
}

export { TOKEN };
