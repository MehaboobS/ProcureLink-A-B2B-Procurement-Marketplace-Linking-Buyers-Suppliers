// test.ts
import path from 'node:path';
import { loadEnvFile } from 'node:process';

loadEnvFile(path.resolve(__dirname, '.env.local'));

const { prisma } = require('./lib/prisma');

async function main() {
  const user = await prisma.user.upsert({
    where: {
      email: "check@test.com",
    },
    update: {
      passwordHash: "hashed",
      role: "BUYER",
    },
    create: {
      email: "check@test.com",
      passwordHash: "hashed",
      role: "BUYER",
    },
  });

  console.log(user);
}

main();