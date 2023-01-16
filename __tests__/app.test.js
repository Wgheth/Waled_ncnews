
const { app } = require("../app.js");
const request = require("supertest");
const  db  = require("../db/connection");
const data = require("../db/data/test-data/index");
const   seed  = require("../db/seeds/seed");

afterAll(() => {
  return db.end();
});
beforeEach(() => {
  return seed(data);
});

describe("app", () => {
  describe("/api", () => {
    it("returns a status of 200 ", () => {
      return request(app)
      .get("/api/topics")
      .expect(200)
      .then((result) => {
        expect(result.body).toHaveLength(3);
        result.body.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description")
          
          console.log(result.body[1]);
          expect(result.body[0].slug).toBe('mitch')
          expect(result.body[1].description).toBe('Not dogs')
         
        });
      });
    });
    
  });
  
});


