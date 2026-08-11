const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.vpljcuugcohnerdyvuov:Pondgamerk0931@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
    }
  }
});

async function main() {
  try {
    const members = await prisma.member.findMany({ take: 1 });
    console.log("SUCCESS!", members);
  } catch (err) {
    console.error("ERROR!", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
