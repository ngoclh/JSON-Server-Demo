import fs from "fs";
import faker from "faker";

const generateUsers = (num) => {
  const listUsers = [];
  for (let index = 0; index < num; index++) {
    listUsers.push({
      id: faker.datatype.uuid(),
      userName: faker.internet.userName(),
      password: faker.internet.userName(),
    });
  }
  return listUsers;
};

// IFFE
(() => {
  const db = {
    users: [],
  };
  const listUser = generateUsers(10);
  db.users = listUser;
  console.log(listUser);
  fs.writeFile("./db.json", JSON.stringify(db), () => {
    console.log("Generate date successfully");
  });
})();
