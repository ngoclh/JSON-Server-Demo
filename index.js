import { createToken, verifyToken } from "./handleToken.js";
import fs from "fs";
import jsonServer from "json-server";
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults({ bodyParser: true });
// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

const MSG_401 = "Expired";

// Add custom routes before JSON Server router

server.post("/api/login", (req, res) => {
  console.log(req.body);
  const db = fs.readFileSync("./db.json", { encoding: "utf8" });
  const listUser = JSON.parse(db).users;
  console.log(listUser);
  const user = listUser.find(
    (x) => x.userName === req.body.userName && x.password === req.body.password
  );
  if (!user) {
    res.status(200).jsonp({
      status: false,
      message: "UserName or password invalid",
    });
    return;
  }
  res.status(200).jsonp({
    status: true,
    token: createToken({ user: "" }),
  });
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  const header = req.headers;
  console.log(header);
  if (header.token === undefined) {
    res.status(401).json({ status: false, message: MSG_401 });
    return;
  }
  const result = verifyToken(header.token);
  console.log("RESULT", result);
  if (!result) {
    res.status(401).json({ status: false, message: MSG_401 });
    return;
  }

  console.log(header);
  if (req.method === "POST") {
    req.body.createdAt = Date.now();
    req.body.updateAt = Date.now();
  } else if (req.method === "PUT") {
    req.body.updateAt = Date.now();
  }
  // Continue to JSON Server router
  next();
});

// Use default router
server.use("/api", router);
server.listen(3000, () => {
  console.log("JSON Server is running");
});
