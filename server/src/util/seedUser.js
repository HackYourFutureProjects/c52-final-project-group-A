import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { logInfo } from "./logging.js";

async function seedUser(numUsers, createAdmin, saltRounds = 10) {
  const users = [];

  for (let i = 0; i < numUsers; i++) {
    const admin = createAdmin && i === 0; // create an admin user if requested and it's the first user
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const username = admin ? "admin" : faker.internet.username();
    const email = admin
      ? "admin@gmail.com"
      : faker.internet.email({ firstName, lastName });
    const password = admin
      ? "admin123"
      : faker.internet.password({ length: 10 });
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const score = Math.floor(Math.random() * 100 + 1);

    const user = new User({
      admin,
      username,
      password: hashedPassword,
      email,
      profile: {
        first_name: firstName,
        last_name: lastName,
        avatar: faker.image.avatar(),
        bio: faker.lorem.paragraph({ min: 1, max: 5 }),
      },
      score,
    });

    const savedUser = await user.save();
    users.push(savedUser);
    if (i % 10 === 0 || i === numUsers - 1)
      logInfo(`${i + 1}/${numUsers} users created`);
  }

  return users;
}

export default seedUser;
