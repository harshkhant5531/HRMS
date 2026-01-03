import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

const rawUrl = (process.env.DATABASE_URL || 'dev.db')
    .replace(/^"|"$/g, '')
    .replace(/^file:/, '');

const absolutePath = path.isAbsolute(rawUrl)
    ? rawUrl
    : path.resolve(process.cwd(), rawUrl);

const adapter = new PrismaBetterSqlite3({
    url: absolutePath,
});

export const prisma = new PrismaClient({ adapter });
export default prisma;
