import 'dotenv/config';
import app, { prisma } from './app';

const PORT = Number(process.env.PORT) || 3001;

async function main() {
  await prisma.$connect();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
