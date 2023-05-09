const db = require("../db/connection.js");
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const { response } = require("../app");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  return db.end();
});

describe("Get /api/categories", () => {
  test("Function able to recieve a positive response", () => {
    return request(app).get("/api/categories").expect(200);
  });
  test("Function outputs the requested information", () => {
    const result = [
      {
        slug: "euro game",
        description: "Abstact games that involve little luck",
      },
      {
        slug: "social deduction",
        description: "Players attempt to uncover each other's hidden role",
      },
      { slug: "dexterity", description: "Games involving physical skill" },
      {
        slug: "children's games",
        description: "Games suitable for children",
      },
    ];

    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((response) => {
        expect(response.body.categories).toEqual(result);
      });
  });
  test("When unable to access the server, Funtion responds with error", () => {
    return db
      .query(`DROP TABLE IF EXISTS comments;`)
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS reviews;`);
      })
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS users;`);
      })
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS categories;`);
      })
      .then(() => {
        return request(app).get("/api/categories").expect(500);
      })
      .then((response) => {
        expect(response.error.text).toBe(
          "There is currently an issue witht the server. Please try again later"
        );
      });
  });
});
