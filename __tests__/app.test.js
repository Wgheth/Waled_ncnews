const { app } = require("../app.js");
const request = require("supertest");
const  db  = require("../db/connection");
const data = require("../db/data/test-data/index");
const   seed  = require("../db/seeds/seed");

require('jest-sorted');


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



  describe("GET /api/articles/:article_id/comments", () => {
    
    test("it returns an array of comments for  a given article_id", () => {
      const article_id = 9;
      return request(app)
        .get(`/api/articles/${article_id}/comments`)
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


  test('Returns Error with 404 when invalid path', () => {
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
   .get("/api/articles/invalid_article_id/comments")
    .expect(400)
    .then(({body})=>{
    expect(body.msg).toBe("Invalid id")

      });
    
  });

  

  describe("POST /api/articles/:article_id/comments", () => {
    test("It returns status code 201 and an object that have an updated body and author properties", () => {
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
         
     expect(Object.keys(result.body).length).toBe(6);  
        expect(result.body).toHaveProperty("comment_id");
        expect(result.body).toHaveProperty("body")
        expect(result.body).toHaveProperty("article_id");
        expect(result.body).toHaveProperty("votes");
        expect(result.body).toHaveProperty("author")
        expect(result.body).toHaveProperty("created_at")

        expect(result.body.body).toBe("I have never expected this to be stressful.")
        expect(result.body.author).toBe("icellusedkars")
           
        });
    });

    test("It returns status code 400 and message: User does not exist, if the user doesn`t exist", () => {
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
        .expect(400)
        .then(({body})=>{
        expect(body.msg).toBe("User does not exist")

    });
    });

    test("It returns status code 400 with a message (Missing properties) if the username and or body are not present on the request", () => {
      const postartecle = [
        {
          body: "I have never expected this to be stressful.",
        },
      ];
      const article_id = 3;
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(postartecle)
        .expect(400)

        .then(({body})=>{
        expect(body.msg).toBe("Missing properties")
  
      });
        
      });

      test('Returns Error with 400 non existent article id', () => {
        const postartecle = [
          {
            username: "icellusedkars",
            body: "I have never expected this to be stressful.",
          },
        ];
        const article_id = 50;
        return request(app)
          .post(`/api/articles/${article_id}/comments`)
          .send(postartecle)
          .expect(400)
         .then(({body})=>{
        expect(body.msg).toBe("User does not exist")
    
          });
        
      });
      
    
  });

  describe("8. PATCH /api/articles/:article_id", () => {
    test("It Returns 200 status and an array of objects for a particular article", () => {
      const article_id = 3;
      const incremnt = { inc_votes: 100 };
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send(incremnt)
        .expect(200)
        .then((result) => {
         
            expect(result.body[0]).toHaveProperty("article_id");
            expect(result.body[0]).toHaveProperty("title");
            expect(result.body[0]).toHaveProperty("topic");
            expect(result.body[0]).toHaveProperty("author");
            expect(result.body[0]).toHaveProperty("body");
            expect(result.body[0]).toHaveProperty("created_at");
            expect(result.body[0]).toHaveProperty("votes");
            expect(result.body[0]).toHaveProperty("article_img_url");
        });
    });
  
    test("It Returns 200 status and an array of objects for a particular article with the updated votes property", () => {
      const article_id = 1;
      const incremnt = { inc_votes: 50 };
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send(incremnt)
        .expect(200)
        .then((result) => {
          expect(result.body[0].votes).toBe(150);
        
        });
    });
  
    test("It Returns 200 status and an array of objects for a particular article with the updated votes property", () => {
      const article_id = 9;
      const incremnt = { inc_votes: -50 };
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send(incremnt)
        .expect(200)
        .then((result) => {
          expect(result.body[0].votes).toBe(-50);
        
        });
    });
  
    test('Returns Error with 404 for invalid path ( id is valid but doesnt exist )', () => {
      const article_id = 50;
      const incremnt = { inc_votes: -50 };
      return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(incremnt)
      .expect(404)
      .then(({body})=>{
      expect(body.msg).toBe("Article not found")
  
        });
      
    });
  
    test("it returns a 400 status with a message : (Invalid id) if the endpoint is invalid", () => {
      const article_id = "Waled";
      const incremnt = { inc_votes: -50 };
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send(incremnt)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid id");
        });
    });

    test('Returns Error with 400 when incremnt isnt provided/has a missing inv_votes/isnt a number', () => {
      
      const article_id = 9;
     
      return request(app)
      .patch(`/api/articles/${article_id}`)
     
      .expect(400)
      .then(({body})=>{
      expect(body.msg).toBe("No votes provided")
  
        });
      
    });
  });

  describe("9. GET /api/users", () => {

    test("it returns a 200 status and  an array of 4 objects and every object has 3 proberties where each object should have username, name and avatar_url proberties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((users) => {
        expect(users.body).toHaveLength(4)
        users.body.forEach((user) => {
        expect(Object.keys(user).length).toBe(3);
        users.body.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
        });
        });
    });
  });

  describe("10. GET /api/articles (queries)", () => {
    test("it should return an array of articles objects filtered by a givin topic sorted in ascending order by article_id", () => {
      
      return request(app)
        .get(`/api/articles?topic=mitch&order=ASC&sortBy=article_id`)
        .expect(200)
        .then((data) => {
          expect(data.body.length).toBe(11);
          expect([data.body]).toBeSorted({ key: 'article_id' });
          console.log(data.body);
          data.body.forEach((topic) => {
          expect(topic.topic).toBe("mitch");
        
          });
        });
    });

    test("it should return a 400 and Please sort by acceptable parameter messsage when invalid sort by ", () => {
      
      return request(app)
        .get(`/api/articles?topic=mitch&order=ASC&sortBy=body`)
        .expect(400)
        .then((data) => {
          expect(data.body.msg).toBe("Please sort and oredr by acceptable parameters");
         });
        
          });

    test("it should return a 400 and Please sort and oredr by acceptable parameters messsage when invalid order by ", () => {
      
      return request(app)
        .get(`/api/articles?topic=mitch&order=MKD&sortBy=body`)
        .expect(400)
        .then((data) => {
        expect(data.body.msg).toBe("Please sort and oredr by acceptable parameters");
        });
              
         });    

       test("it should return an array of articles objects filtered by a givin topic sorted and ordered by the defult values", () => {
     
        return request(app)
        .get(`/api/articles?topic=mitch`)
        .expect(200)
        .then((data) => {
        expect(data.body.length).toBe(11);
        expect([data.body]).toBeSorted({ key: 'created_at' }); 
        data.body.forEach((topic) => {
        expect(topic.topic).toBe("mitch");
          
          });

        })
       
    });
  
  test(" it should return an array of all articles objects if no topic is passed", () => {
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
  
  test("Returns a 400 err status when passing a topic which doesn`t exist", () => {
   
      return request(app)
      .get(`/api/articles?topic=NeverEnding`)
      .expect(404)
      .then((data) => {
       expect(data.body.msg).toBe("Topic does not exist");
      });
  });
});
    
   });
