const request = require('supertest');
const app = require('../app');
const controller = require('../controllers');

// API Unit Tests
// Unit tests focus on testing individual components or units of code in isolation. In the case of an API service, a unit test would typically target a specific function, method, or class that handles a specific piece of functionality within the API service. Unit tests are designed to validate that each unit of code functions correctly and produces the expected output for a given set of inputs.
//
// 1. Input validation
// Test how the API service handles different types of inputs, such as valid inputs, invalid inputs, edge cases, and boundary values.
//
// 2. Error handling
// Test how the API service handles and reports errors or exceptions, ensuring that error conditions are properly handled and appropriate error responses are returned.
//
// 3. Data access & persistence
// If the API service interacts with a database or external data sources, you can write unit tests to verify the correctness of data retrieval, storage, and manipulation operations.
//
// Integration Tests
// Integration tests focus on testing the interactions between different components or units of code within the API service. Instead of testing individual units in isolation, integration tests verify that these units work correctly when combined and communicate with each other as expected. Integration tests help uncover issues that may arise due to the integration of multiple components or dependencies.
//
// 1. API Endpoints
// Test the API endpoints by making HTTP requests to the API service and verifying that the responses are correct and consistent with the expected behavior.
//
// 2. Data flow and dependencies
// Test how different components of the API service interact with each other and any external dependencies, such as databases, third-party APIs, or message queues. Verify that the data flow between components is correct and that the API service behaves as expected under different scenarios.
//
// Things to test:
// Custom middleware
// Controller functions
// Model functions
//
// ENDPOINTS TO TEST
// GET /qa/questions
// GET /qa/questions/:question_id/answers
// POST /qa/questions
// POST /qa/questions/:question_id/answers
// PUT /qa/questions/:question_id/helpful
// PUT /qa/questions/:question_id/report
// PUT /qa/answers/:answer_id/helpful
// PUT /qa/answers/:answer_id/report
// Unknown endpoints

const questionInput = {
  'product_id': 5,
  'body': 'Hello Will this get posted?',
  'name': 'Patrick',
  'email': 'fake@email.com'
};

const questionPayload = {"count": 1, "page": 0, "product": "1", "results": [{"answers": {}, "asker_name": "jbilas", "date": "2020-12-21T15:31:47.083Z", "question_body": "Does this product run big or small?", "question_helpfulness": 8, "question_id": 3, "reported": false}]};

const answerInput = {
  'body': 'This is an answer to a question.',
  'name': 'Patrick',
  'email': 'fake@email.com',
  'photos': ['this is a url', 'this is another url']
};

const randomInt = () => {
  return Math.floor(Math.random() * 10000);
}


describe('questions', () => {
  describe('GET questions route', () => {

      it('should return a 404 status code when not provided a product ID', async () => {
        const response = await request(app)
          .get('/qa/questions')
          expect(response.status).toBe(404);
      });

      it('should return a 404 status code when provided an invalid product ID', async () => {
        const response = await request(app)
          .get('/qa/questions')
          .query({ product_id: 1.2571 })
          expect(response.status).toBe(404);
      });

      it('should return a 200 status code and five questions when count is not defined', async () => {
        const response = await request(app)
        .get('/qa/questions')
        .query({ product_id: 1 });

        expect(response.status).toBe(200);
        expect(response.body.count).toBe(5);
      });

      it('should return a 200 status code and an object with one question with valid Product ID and query param count = 1', async () => {
        const response = await request(app)
          .get('/qa/questions')
          .query({ product_id: 1, count: 1 });

          expect(response.status).toBe(200);
          expect(response.body.results.length).toBe(1);
      });

      it('should return a 200 status code and two different questions when setting count to 1 and page to 1 and then 2', async () => {
        const responsePageOne = await request(app)
          .get('/qa/questions')
          .query({ product_id: 1, count: 1, page: 1 });
        const responsePageTwo = await request(app)
          .get('/qa/questions')
          .query({ product_id: 1, count: 1, page: 2 });

          expect(responsePageOne.status).toBe(200);
          expect(responsePageTwo.status).toBe(200);
          expect(responsePageOne.body).not.toEqual(responsePageTwo.body);
      }, 99999);


      it('should not return any reported questions', async () => {
        const response = await request(app)
          .get('/qa/questions')
          .query({ product_id: 102 });
          expect(response.status).toBe(200);
          expect(response.body.results[333]).not.toBeDefined();
      });

  });

  describe('POST question route', () => {

    it('should return status code 201 with valid question input', async () => {
      const response = await request(app)
        .post('/qa/questions')
        .send(questionInput)
        .set('content-type', 'application/json')

      expect(response.status).toBe(201);
    });

    it('should return status code 400 with invalid question input', async () => {
      const response = await request(app)
        .post('/qa/questions')
        .send({})
        .set('content-type', 'application/json')

      expect(response.status).toBe(400);
    });

  });

  describe('PUT questions/:question_id/helpful route', () => {

    it('should return status code 204 with valid question ID', async () => {
      let questionId = randomInt();
      const response = await request(app)
        .put(`/qa/questions/${questionId}/helpful`)

      expect(response.status).toBe(204);
    });

    it('should return status code 404 with invalid question ID', async () => {
      let questionId = 'not a valid question ID';
      const response = await request(app)
        .put(`/qa/questions/${questionId}/helpful`)

      expect(response.status).toBe(404);
    });

  });

  describe('PUT questions/:question_id/report route', () => {

    it('should return status code 204 with valid question ID', async () => {
      let questionId = randomInt();
      const response = await request(app)
        .put(`/qa/questions/${questionId}/report`)

      expect(response.status).toBe(204);
    });

    it('should return status code 404 with invalid question ID', async () => {
      let questionId = 'not a valid question ID';
      const response = await request(app)
        .put(`/qa/questions/${questionId}/report`)

      expect(response.status).toBe(404);
    });

  });
});

describe('answers', () => {

  describe('GET answers route', () => {

    it('should return status code 200 and results when valid', async () => {
      const questionId = randomInt();
      const response = await request(app)
        .get(`/qa/questions/${questionId}/answers`);

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(5);
      expect(response.body.page).toBe(0);
      expect(response.body.results).toBeDefined();
    });

    it('should not return any reported answers', async () => {
      const questionId = 3111028;
      const response = await request(app)
        .get(`/qa/questions/${questionId}/answers`);

      expect(response.status).toBe(200);
      expect(response.body.results[6080521]).not.toBeDefined();
    })

    it('should return status code 200 with count = 1 and page = 2 with valid query params', async () => {
      const questionId = randomInt();
      const response = await request(app)
        .get(`/qa/questions/${questionId}/answers`)
        .query({ count: 1, page: 2})

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(1);
      expect(response.body.page).toBe(1);
      expect(response.body.results).toBeDefined();
    });

  });

  describe('POST answers route', () => {

    it('should return status code 201 when successfully creating an answers record', async () => {
      const questionId = randomInt();
      const response = await request(app)
        .post(`/qa/questions/${questionId}/answers`)
        .send(answerInput)
        .set('content-type', 'application/json')

        expect(response.status).toBe(201);
    });

    it('should return status code 400 when posting w/ invalid input data', async () => {
      const questionId = randomInt();
      const response = await request(app)
        .post(`/qa/questions/${questionId}}/answers`)
        .send({})
        .set('content-type', 'application/json')

      expect(response.status).toBe(400);
    });

    it('should return status code 400 when posting w/ invalid question ID', async () => {
      const questionId = 'not a valid question id';
      const response = await request(app)
        .post(`/qa/questions/${questionId}}/answers`)
        .send({})
        .set('content-type', 'application/json')

      expect(response.status).toBe(400);
    });


  });

  describe('PUT answers/helpful route', () => {

    it('should return status code 204 with valid question ID', async () => {
      let answerId = randomInt();
      const response = await request(app)
        .put(`/qa/answers/${answerId}/helpful`)

      expect(response.status).toBe(204);
    });

    it('should return status code 404 with invalid question ID', async () => {
      let answerId = 'not a valid answer ID';
      const response = await request(app)
        .put(`/qa/answers/${answerId}/helpful`)

      expect(response.status).toBe(404);
    });

  });

  describe('PUT answers/report route', () => {


    it('should return status code 204 with valid answer ID', async () => {
      let answerId = randomInt();
      console.log(answerId);
      const response = await request(app)
        .put(`/qa/answers/${answerId}/report`)

      expect(response.status).toBe(204);
    });

    it('should return status code 404 with invalid answer ID', async () => {
      let answerId = 'not a valid answer ID';
      const response = await request(app)
        .put(`/qa/answers/${answerId}/report`)

      expect(response.status).toBe(404);
    });
  });

});