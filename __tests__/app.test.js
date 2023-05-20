const db = require("../db/connection.js");
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const { response } = require("../app");
const toBeSortedBy = require("jest-sorted");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  return db.end();
});

describe("3. Get /api/categories", () => {
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
});

describe("3.5 GET /api", () => {
  test("", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(endpoints).toEqual(response.body);
      });
  });
});

describe("4. GET /api/reviews/:review_id", () => {
  test("Function gives requested information when given the correct ID", () => {
    result = {
      review_id: 1,
      title: "Agricola",
      category: "euro game",
      designer: "Uwe Rosenberg",
      owner: "mallionaire",
      review_body: "Farmyard fun!",
      review_img_url:
        "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
      created_at: "2021-01-18T10:00:20.514Z",
      votes: 1,
    };

    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(result);
      });
  });
  test("When user submits query that does not consist of ONLY numbers Function sends back an error", () => {
    return request(app)
      .get("/api/reviews/2;DROP TABLE IF EXISTS reviews")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid review ID provided");
      });
  });
  test("When user submits a valid request but there is not a matching review ID, function to notify user", () => {
    return request(app)
      .get("/api/reviews/100")
      .expect(200)
      .then((response) => {
        expect(response.body.msg).toBe("No matching review id");
      });
  });
});
describe("5. GET /api/reviews", () => {
  test("Function to recieve an object of arrays in descending date order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        expect(response.body.review.rows).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("The received object does not include a review_body key", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        const result = response.body.review.rows.filter(
          (obj) => obj.review_body
        );
        expect(result).toEqual([]);
      });
  });
  test("The returned object has all required keys", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        const test = [
          "owner",
          "title",
          "review_id",
          "category",
          "review_img_url",
          "created_at",
          "votes",
          "designer",
          "comment_count",
        ];
        const result = response.body.review.rows.filter(
          (obj) => Object.keys(obj).toString() === test.toString()
        );
        expect(result.length).toBe(13);
      });
  });
});

describe("6. GET /api/reviews/:review_id/comments", () => {
  test("Function gives requested information when given the correct ID", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then((response) => {
        const result = testData.commentData.filter(
          (obj) => obj.review_id === 2
        );

        const test = response.body.reviewComments.filter(
          (obj) => delete obj.comment_id
        );

        expect(test.toString()).toBe(result.toString());
      });
  });
  test("The Recieved data is to have the most recent comments first", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.reviewComments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("When client inputs an ID that is not a number, the Function responds with status 400 and informational error message", () => {
    return request(app)
      .get("/api/reviews/;Drop table/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid review ID provided");
      });
  });
  test("When Review id is valid but there is no matching data, Function to respond with status code of 200 and an empty array", () => {
    return request(app)
      .get("/api/reviews/13/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.reviewComments).toEqual([]);
      });
  });
  test("When client inputs a number but there is no matching review_id, Funtion to respond with error ", () => {
    return request(app)
      .get("/api/reviews/500/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toEqual(
          "There is no record of review ID provided"
        );
      });
  });
});
