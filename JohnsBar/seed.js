const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");
const prisma = new PrismaClient();

async function main() {

  const users = [];
  for (let i = 0; i < 10; i++) {
    const plainPassword = `password${i + 1}`;
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: hashedPassword,
      },
    });
    users.push({ ...user, plainPassword });
  }
  
  console.log("Test users created:");
  users.forEach(user => console.log(`Email: ${user.email} | Password: ${user.plainPassword}`));


  const createDrink = () => ({
    name: `${faker.word.adjective()} ${faker.lorem.word()} ${faker.helpers.arrayElement([
      'Coffee', 'Tea', 'Smoothie', 'Juice', 'Milkshake', 'Soda', 'Cocktail', 'Mocktail'
    ])}`,
    ml: faker.number.float({ min: 200, max: 500, precision: 0.1 }),
    price: faker.number.float({ min: 1.5, max: 10, precision: 0.01 }),
    alcohol: faker.datatype.boolean() ? 
      faker.number.float({ min: 0.5, max: 40, precision: 0.1 }) : 0
  });

  const drinks = await Promise.all(
    Array.from({ length: 20 }, () => 
      prisma.drink.create({ data: createDrink() })
    )
  );
  console.log(`Created ${drinks.length} drinks`);

  for (let i = 0; i < 5; i++) {
    const customer = faker.helpers.arrayElement(users);
    const selectedDrinks = faker.helpers.arrayElements(
      drinks,
      faker.number.int({ min: 1, max: 3 })
    );

    await prisma.order.create({
      data: {
        customerId: customer.id,
        drinks: {
          create: selectedDrinks.map(drink => ({
            quantity: faker.number.int({ min: 1, max: 5 }),
            drinkId: drink.id
          }))
        }
      }
    });
  }
  console.log("Created 5 orders with random drinks and customers");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });