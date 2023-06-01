const db = require("../db/connection.js");
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const reviewTestData = require("../db/data/test-data/reviews.js");
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

describe("7. POST /api/reviews/:review_id/comments", () => {
  test("Function returns object with the required keys ", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ username: "mallionaire", body: "Test Review Message" })
      .expect(201)
      .then((response) => {
        const keys = [
          "comment_id",
          "body",
          "review_id",
          "author",
          "votes",
          "created_at",
        ];
        const result = Object.keys(response.body.addedComment);

        expect(keys.toString()).toEqual(result.toString());
      });
  });

  test("The values added by the client match what appears in the recieved object ", () => {
    const username = "mallionaire";
    const body = "Test Review Message";
    const review_id = 1;
    return request(app)
      .post(`/api/reviews/${review_id}/comments`)
      .send({ username: username, body: body })
      .expect(201)
      .then((response) => {
        const object = response.body.addedComment;

        expect(object.body).toBe(body);
        expect(object.author).toBe(username);
        expect(object.review_id).toBe(review_id);
      });
  });

  test("When client inputs an ID that is not a number, the Function responds with status 400 and informational error message", () => {
    return request(app)
      .post("/api/reviews/;DROP TABLE/comments")
      .send({ username: "mallionaire", body: "Test Review Message" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid review ID provided");
      });
  });

  test("When the author is not a registered user, the function will respond with informational error", () => {
    const username = "Aaron";
    const body = "Test Review Message";
    const review_id = 1;
    return request(app)
      .post(`/api/reviews/${review_id}/comments`)
      .send({ username: username, body: body })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Supplied username is not registerd");
      });
  });

  test("When client does not provide a comment, error is trown informing of this", () => {
    const username = "mallionaire";
    const review_id = 1;
    return request(app)
      .post(`/api/reviews/${review_id}/comments`)
      .send({ username: username })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Required fields not been completed");
      });
  });
  test("When client does not provide a username, error is trown informing of this", () => {
    const body = "Test comment text";
    const review_id = 1;
    return request(app)
      .post(`/api/reviews/${review_id}/comments`)
      .send({ body: body })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Required fields not been completed");
      });
  });
});

describe("8. PATCH /api/reviews/:review_id", () => {
  test("Function returns object with updated review value", () => {
    let original = "";
    let update = "";
    return request(app)
      .get("/api/reviews/1")
      .then((response) => {
        original = response.body;
      })
      .then((response) => {
        return request(app)
          .patch("/api/reviews/1")
          .send({ inc_votes: -100 })
          .expect(200)
          .then((response) => {
            update = response.body.editedReview[0];
            expect((original.votes -= 100)).toBe(update.votes);
          });
      });
  });
});

describe("9. DELETE /api/comments/:comment_id", () => {
  test("Deletes comment", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then((response) => {
        expect(response.text).toBe("")
      
      });
  });
});



describe("11. GET /api/reviews (queries)",()=>{
  test("",()=>{
return request(app).get("/api/reviews?sort_by=votes&order=asc")
  })
})
