
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Checking Transaction model fields...");
  // Use prisma.$dmmf to check the model structure in the generated client
  const model = prisma._baseDmmf.datamodel.models.find(m => m.name === 'Transaction');
  if (model) {
    console.log("Fields in Transaction model:", model.fields.map(f => f.name).join(", "));
  } else {
    console.log("Transaction model not found!");
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
