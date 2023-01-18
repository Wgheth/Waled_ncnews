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
        .get("/not-a-path")
        .expect(404)
        .then(({body})=>{
        expect(body.msg).toBe("Path not found")

        });
        
    });
    it("returns a status of 200, and array of three objects where each object has three proberties ", () => {
      return request(app)
      .get("/api/topics")
      .expect(200)
      .then((result) => {
        expect(result.body).toHaveLength(3);
        result.body.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description")
          expect(result.body[0].slug).toBe('mitch')
          expect(result.body[1].description).toBe('Not dogs')
         
        });
      });
    });
    
  });


  describe("/api/articles", () => {
    it("returns a status of 200 and array of 12 objects.", () => {
      return request(app)
      .get("/api/articles")
      .expect(200)
      .then((result) => {
        expect(result.body).toHaveLength(12);
        result.body.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title")
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("created_at")
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url")
          expect(article).toHaveProperty("comment_count")
         
         });

         
        
       });
    });


   test("it should return array of object sorted by their date of creation", ()=>{

    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((result) => {
    expect(result.body[0].created_at).toBe('2020-11-03T09:12:00.000Z')
    expect(result.body[0].comment_count).toBe('2')
    expect(result.body[5].comment_count).toBe('11')
    expect(result.body[result.body.length-1].created_at).toBe('2020-01-07T14:08:00.000Z')
      })
   })
    
  });

  describe('GET /api/articles/:articles_id', () => {

    test('Returns Error with 404 when the article id it does not exist', () => {
      const article_id = 33;
      return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(404)
      .then(({body})=>{
      expect(body.msg).toBe("Article not found")
     });
      
    });

    test('returns a status of 200 and an object with a number of proberties', () => {
      const article_id = 1;
      return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200)
      .then((result) => {
        
          expect(result.body).toHaveProperty("author");
          expect(result.body).toHaveProperty("title")
          expect(result.body).toHaveProperty("article_id");
          expect(result.body).toHaveProperty("body");
          expect(result.body).toHaveProperty("topic");
          expect(result.body).toHaveProperty("created_at")
          expect(result.body).toHaveProperty("votes");
          expect(result.body).toHaveProperty("article_img_url")
         
         });
      
    });
  });


  describe("/api/articles/:article_id/comments", () => {
    
    test("it returns an array of comments for  a given article_id", () => {
      const article_id = 9;
      return request(app)
        .get(`/api/articles/${article_id}/commentS`)
        .expect(200)
        .then((result) => {
          result.body.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id");
            expect(comment).toHaveProperty("body")
            expect(comment).toHaveProperty("article_id");
            expect(comment).toHaveProperty("created_at")
            expect(comment).toHaveProperty("votes");
            expect(comment).toHaveProperty("author")
           
           
           });
          expect(result.body).toEqual([
            {
              comment_id: 1,
              body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              article_id: 9,
              author: 'butter_bridge',
              votes: 16,
              created_at: '2020-04-06T12:17:00.000Z'
            },
            {
              comment_id: 17,
              body: 'The owls are not what they seem.',
              article_id: 9,
              author: 'icellusedkars',
              votes: 20,
              created_at: '2020-03-14T17:02:00.000Z'
            }
          ]);
        });
    });

  });

  test('Returns Error with 404 when the article id it does not exist', () => {
    const article_id = 50;
    return request(app)
   .get(`/api/articles/${article_id}/commentS`)
    .expect(404)
    .then(({body})=>{
    expect(body.msg).toBe("Article not found")

      });
    
  });

  test('Returns Error with 404 if the article id is invalid', () => {
    
    return request(app)
   .get("/api/articles/article/commentS")
    .expect(400)
    .then(({body})=>{
    expect(body.msg).toBe("Invalid Path")

      });
    
  });
  

  describe("POST /api/articles/:article_id/comments", () => {
    test("It returns status code 201 and array with an object that have an updated body and author properties", () => {
      const postartecle = [
        {
          username: "icellusedkars",
          body: "I have never expected this to be stressful.",
        },
      ];
      const article_id = 3;
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(postartecle)
        .expect(201)
        .then((result) => {
         
       expect(Object.keys(result.body[0]).length).toBe(6);  
        expect(result.body[0]).toHaveProperty("comment_id");
        expect(result.body[0]).toHaveProperty("body")
        expect(result.body[0]).toHaveProperty("article_id");
        expect(result.body[0]).toHaveProperty("votes");
        expect(result.body[0]).toHaveProperty("author")
        expect(result.body[0]).toHaveProperty("created_at")

        expect(result.body[0].body).toBe("I have never expected this to be stressful.")
        expect(result.body[0].author).toBe("icellusedkars")
           
        });
    });

    test("It returns status code 201 and array with an object that have an updated body and author properties", () => {
      const postartecle = [
        {
          username: "Waled",
          body: "I have never expected this to be stressful.",
        },
      ];
      const article_id = 3;
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(postartecle)
        .expect(404)
        .then(({body})=>{
        expect(body.msg).toBe("User does not exist")

    });
    });
  });
  
});