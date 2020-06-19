const db = require("../database/dbConfig");
const supertest = require("supertest");
const server = require("../api/server");

describe("GET / of server.js", () => {
    it("Should be status 200", () => {
        return supertest(server)
            .get("/")
            .then((res) => {
                // console.log(res);
                expect(res.status).toBe(200);
            });
    });
    it("Should test stuff", async () => {
        supertest(server)
            .get("/")
            .then((res) => {
                // console.log(res)
                expect(res.body).toStrictEqual({
                    message: "home slash of the login page",
                });
            });
    });
    it("should not let you into users", async () => {
        supertest(server)
            .get("/api/users")
            .then((res) => {
                expect(res.body).toStrictEqual({
                    Error:
                        "Please provide credentials to access this resource.",
                });
            });
    });
    it("should let you into users", async () => {
        supertest(server)
            .get("/api/users")
            .set(
                "Authorization",
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoxLCJ1c2VybmFtZSI6Im5ldyIsImlhdCI6MTU5MjU4NTQ5MSwiZXhwIjoxNTkyNjA3MDkxfQ.ViEWBZ5sCKQdSc3MRLtZFgvMPpLyO_rBi3o3r8hVCqA"
            )
            .then((res) => {
                // console.log(res.body);
                expect(res.body).toStrictEqual([{ id: 1, username: "new" }]);
            });
    });
});
