const db = require("../db/connection.js");
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const { response } = require("../app");
const toBeSortedBy = require('jest-sorted')

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
    return request(app).get("/api/reviews").expect(200).then((response)=>{
      expect(response.body).toBeSortedBy("created_at",{descending:true})
    })

  });
  test("The received object does not include a review_body key", () => {
    return request(app).get("/api/reviews").expect(200).then((response)=>{
      expect(Object.keys(response.body[0]).includes("review_body")).toBe(false)
  });
})
test("The received object does include a comment_count key", () => {
  return request(app).get("/api/reviews").expect(200).then((response)=>{
    expect(Object.keys(response.body[0]).includes("comment_count")).toBe(true)
  })
  
})
test("The function counts comments correctly", () => {
  return request(app).get("/api/reviews").expect(200).then((response)=>{

    expect(response.body[8].comment_count).toBe(3)
  })
})
})