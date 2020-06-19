const db = require("../database/dbConfig");
const supertest = require("supertest");
const server = require("../api/server");
const newUser = { username: "testing", password: "password" };
it("should user the testing environment", () => {
    expect(process.env.DB_ENV).toBe("testing");
});

describe("GET / of server.js", () => {
    afterEach(async () => {
        await db("users").truncate();
    });

    it("Should test stuff", async () => {
        supertest(server)
            .get("/")
            .then((res) => {
                expect(res.body).toStrictEqual({
                    message: "home slash of the login page",
                });
            });
    });
});
describe("POST /api/auth/register", () => {
    it("should not let you register without a username/password", async () => {
        supertest(server)
            .post("/api/auth/register")
            .then((res) => {
                expect(res.body).toStrictEqual({
                    error: "Need username and password",
                });
                expect(res.body.error).toBe("Need username and password");

                // expect(req.body).toBe({});
            });
    });
    it("register, fails as its not running on node?", async () => {
        await supertest(server)
            .post("/api/auth/register")
            .send({ username: "testing", password: "password" });
        let allThem = await supertest(server)
            .get("/api/users")
            .set(
                "Authorization",
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoxLCJ1c2VybmFtZSI6Im5ldyIsImlhdCI6MTU5MjU5MzEyOCwiZXhwIjoxNTkyNjE0NzI4fQ.J7eg33ixSqb7dx82xfYRjNA13WonNAQFCWC4ja7BB6o"
            );

        expect(allThem.body).toStrictEqual([{ id: 1, username: "testing" }]);
    });
});
describe("POST /api/auth/login", () => {
    it("should login", () => {
        supertest(server)
            .post("/api/auth/login")
            .send({ username: "testing", password: "password" })
            .then((res) => {
                // console.log(res.body);
                expect(res.body.user.username).toBe("testing");
            });
    });
    it("should not login", () => {
        supertest(server)
            .post("/api/auth/login")
            .send(newUser)
            .then((res) => {
                // console.log(res.body);
                expect(res.body.user.username).toBe("testing");
            });
    });
});
