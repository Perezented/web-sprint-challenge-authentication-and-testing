const router = require("express").Router();

const Users = require("./usersModel.js");
const restricted = require("../auth/authenticate-middleware");
const database = require("../database/dbConfig");
router.get("/", restricted, (req, res) => {
    Users.find()
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((err) => res.send(err));
});

module.exports = router;
