const db = require("../database/dbConfig");
const supertest = require("supertest");
const server = require("../api/server");

it("should user the testing environment", () => {
    expect(process.env.DB_ENV).toBe("testing");
});
