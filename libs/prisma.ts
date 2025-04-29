import { PrismaClient } from "@prisma/client";

declare global {
  // globalに`prisma`を登録しないと、開発中ホットリロードで何度もインスタンスが作られてエラーになるため
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
