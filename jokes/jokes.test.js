/**
 * @jest-environment node
 */

// test("use jsdom in this test file", () => {
//     const element = document.createElement("div");
//     expect(element).not.toBeNull();
// });

const db = require("../database/dbConfig");
const supertest = require("supertest");
const server = require("../api/server");

it("should user the testing environment", () => {
    expect(process.env.DB_ENV).toBe("testing");
});
describe("GET /api/jokes", () => {
    it("should not let in with out a token", () => {
        supertest(server)
            .get("/api/jokes")
            .then((res) => {
                expect(res.body).toStrictEqual({
                    Error:
                        "Please provide credentials to access this resource.",
                });
            });
    });
    it("should let in with a token", async () => {
        let jokes = await supertest(server)
            .get("/api/jokes")
            .set(
                "Authorization",
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoxLCJ1c2VybmFtZSI6Im5ldyIsImlhdCI6MTU5MjU4NTQ5MSwiZXhwIjoxNTkyNjA3MDkxfQ.ViEWBZ5sCKQdSc3MRLtZFgvMPpLyO_rBi3o3r8hVCqA"
            );
        expect(jokes.body).toHaveLength(20);
    });
});
