
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
  describe("/api/topics", () => {
    test("Returns Error with 404 when the path is incorrect", () => {
      return request(app)
        .get("/api")
        .expect(404);
        
    });
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


  describe("/api/articles", () => {
    it("returns a status of 200 ", () => {
      return request(app)
      .get("/api/articles")
      .expect(200)
      .then((result) => {
        expect(result.body).toHaveLength(12);
        result.body.forEach((topic) => {
          expect(topic).toHaveProperty("author");
          expect(topic).toHaveProperty("title")
          expect(topic).toHaveProperty("article_id");
          expect(topic).toHaveProperty("created_at")
          expect(topic).toHaveProperty("votes");
          expect(topic).toHaveProperty("article_img_url")
          expect(topic).toHaveProperty("comment_count")
         
         });

         expect(result.body[0].created_at).toBe('2020-11-03T09:12:00.000Z')
         expect(result.body[0].comment_count).toBe('2')
         expect(result.body[5].comment_count).toBe('11')
         expect(result.body[result.body.length-1].created_at).toBe('2020-01-07T14:08:00.000Z')
        //  console.log(result.body);
       });
    });
    
  });
  
  
});

