import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { logInfo } from "./logging.js";

async function seedUser(NUM_USERS, saltRounds = 10) {
  const users = [];

  for (let i = 0; i < NUM_USERS; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const username = faker.internet.username({ firstName, lastName });
    const email = username + "@gmail.com";
    const password = faker.internet.password({ length: 10 });
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const score = Math.floor(Math.random() * 100 + 1);

    const user = new User({
      username: username,
      password: hashedPassword,
      email: email,
      profile: {
        first_name: firstName,
        last_name: lastName,
        avatar: faker.image.avatar(),
        bio: faker.lorem.paragraph({ min: 1, max: 5 }),
      },
      score: score,
    });

    const savedUser = await user.save();
    users.push(savedUser);
    if (i % 10 === 0 || i === NUM_USERS - 1)
      logInfo(`${i + 1}/${NUM_USERS} users created`);
  }

  return users;
}

export default seedUser;
