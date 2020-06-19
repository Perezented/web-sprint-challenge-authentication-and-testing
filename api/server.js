const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authenticate = require("../auth/authenticate-middleware.js");
const authRouter = require("../auth/auth-router.js");
const jokesRouter = require("../jokes/jokes-router.js");
const usersRouter = require("../users/usersRouter");

const session = require("express-session");
const KnexSessionsStore = require("connect-session-knex")(session);
const dbConnection = require("../database/dbConfig");
const server = express();

const sessionConfig = {
    name: "monster",
    secret: process.env.SESSION_SECRET || "keep it secret, keep it safe!",
    cookie: {
        maxAge: 1000 * 600,
        secure: process.env.COOKIE_SECURE || false, //  true means only use over https //  true in production
        httpOnly: true, //JS code on the client cannot access the session cookie
    }, // 10 min in milliseconds
    resave: false,
    saveUninitialiezed: false, //  GDPR compliance
    store: new KnexSessionsStore({
        knex: dbConnection,
        sidfieldname: "sid",
        createtable: true,
        clearInterval: 6000, //  delete expired sessions - in milliseconds
    }),
};
server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use("/api/auth", authRouter);
server.use("/api/jokes", authenticate, jokesRouter);
server.use("/api/users", usersRouter, authenticate);

server.get("/", (req, res) => {
    res.status(200).json({ message: "home slash of the login page" });
});
module.exports = server;
