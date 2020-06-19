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
                expect(res.body).toBe({
                    message: "home slash of the login page",
                });
            });
    });
});
