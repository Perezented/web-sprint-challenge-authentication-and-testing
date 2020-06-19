const router = require("express").Router();
const bcryptjs = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../users/usersModel");
const randomConfig = require("../config/randomConfig");

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
    const { username, password } = req.body;

    Users.findBy({ username })
        .then(([user]) => {
            console.log("1ST USER", user);
            // console.log(req.session.user);
            req.session.user = { user };
            console.log("req.session", req.session.user);
            console.log("password", password);
            console.log("user password", user.password);
            if (user && bcryptjs.compareSync(password, user.password)) {
                const token = createToken(user);
                console.log("token", token);
                console.log("useragian", user);
                res.status(200).json({
                    user,
                    session: req.session,
                    token: token,
                });
            } else
                res.status(401).json({
                    Error:
                        "The username and password combination was not found in our database.",
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "could not login", err });
        });
});

router.get("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    Error: "Could not log out, please try again...",
                });
            } else res.status(204).end();
        });
    } else {
        req.status(204).end();
    }
});

function createToken(user) {
    const secret = "process.env.JWT_SECRET";
    const payload = {
        subject: user.id,
        username: user.username,
    };
    const options = {
        expiresIn: "6h",
    };
    return jwt.sign(payload, secret, options);
}
module.exports = router;
