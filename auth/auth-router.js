const router = require("express").Router();
const bcryptjs = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../users/usersModel");

router.post("/register", (req, res) => {
    // implement registration
    const { username, password } = req.body;

    //  hash user password
    const rounds = process.env.HASH_ROUNDS || 8;
    const hash = bcryptjs.hashSync(password, rounds);
    Users.add({ username, password: hash })
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((err) => res.send(err));
});

router.post("/login", (req, res) => {
    // implement login
});

module.exports = router;
