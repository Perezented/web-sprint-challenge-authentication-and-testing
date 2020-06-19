const router = require("express").Router();
const bcryptjs = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../users/usersModel");
const randomConfig = require("../config/randomConfig");

router.post("/register", (req, res) => {
    // implement registration
    if (!req.body.username || !req.body.password) {
        res.status(500).json({ error: "Need username and password" });
    } else if (req.body.username && req.body.password) {
        const { username, password } = req.body;
        //  hash user password
        const rounds = process.env.HASH_ROUNDS || 8;
        const hash = bcryptjs.hashSync(password, rounds);
        Users.add({ username, password: hash }).then((users) => {
            res.status(200).json(users);
        });
    }
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    Users.findBy({ username })
        .then(([user]) => {
            // console.log(req.session.user);
            req.session.user = { user };
            if (user && bcryptjs.compareSync(password, user.password)) {
                const token = createToken(user);
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
            res.status(500).json({ error: "could not login", err });
        });
});

router.get("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
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
