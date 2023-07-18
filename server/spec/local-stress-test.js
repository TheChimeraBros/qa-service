import http from 'k6/http';
import { sleep } from 'k6';

const target = 1400;

export const options = {
  stages: [
    { duration: '30s', target: target },
    { duration: '1m', target: target },
    { duration: '30s', target: 0 },
  ],
  systemTags: ['status', 'method', 'url']
};

const productsCount = 1000011;
const questionsCount = 3518963;
const answersCount = 6879306;

const randomInt = (resourcesCount) => { return Math.floor(Math.random() * (resourcesCount + 1 - (0.9 * resourcesCount))) + Math.floor(0.9 * resourcesCount); };
const randomIntRange = (min, max) => { return Math.floor(Math.random() * (max + 1 - (min))) + min; };

const testRequests = [
  () => {
    // GET /qa/questions
    let randomProductId = randomInt(productsCount);
    let randomPage = randomIntRange(1, 6);
    let randomCount = randomIntRange(1, 6);

    return http.get(`http://localhost:3001/qa/questions?product_id=${randomProductId}&page=${randomPage}&count=${randomCount}`);
  },
  () => {
    // GET /qa/questions/:question_id/answers
    let randomQuestionId = randomInt(questionsCount);
    let randomPage = randomIntRange(1, 6);
    let randomCount = randomIntRange(1, 6);

    return http.get(`http://localhost:3001/qa/questions/${randomQuestionId}/answers?page=${randomPage}&count=${randomCount}`);
  },
  () => {
    // POST /qa/questions
    let randomProductId = randomInt(productsCount);

    let data = JSON.stringify({
      product_id: randomProductId,
      body: 'Is this a question?',
      name: 'K6 Asker',
      email: 'K6@email.com'
    });
    let headers = { 'Content-Type': 'application/json' };

    return http.post('http://localhost:3001/qa/questions', data, { headers });

  },
  () => {
    // POST /qa/questions/:question_id/answers
    let randomQuestionId = randomInt(questionsCount);

    let data = JSON.stringify({
      'body': 'This is an answer.',
      'name': 'K6 Answerer',
      'email': 'k6@email.com',
      'photos': ['photo number 1', 'photo number 2']
    });
    let headers = { 'Content-Type': 'application/json' };

    return http.post(`http://localhost:3001/qa/questions/${randomQuestionId}/answers`, data, { headers });
  },
  () => {
    // PUT /qa/questions/:question_id/helpful
    let randomQuestionId = randomInt(questionsCount);
    return http.put(`http://localhost:3001/qa/questions/${randomQuestionId}/helpful`);
  },
  () => {
    // PUT /qa/questions/:question_id/report
    let randomQuestionId = randomInt(questionsCount);
    return http.put(`http://localhost:3001/qa/questions/${randomQuestionId}/report`);
  },
  () => {
    // PUT /qa/answers/:answer_id/helpful
    let randomAnswerId = randomInt(answersCount);
    return http.put(`http://localhost:3001/qa/answers/${randomAnswerId}/helpful`);
  },
  () => {
    // PUT /qa/answers/:answer_id/report
    let randomAnswerId = randomInt(answersCount);
    return http.put(`http://localhost:3001/qa/answers/${randomAnswerId}/report`);
  }
];

export default () => {

  let randomValue = Math.random();
  let res;

  if (randomValue <= 0.3) {
    res = testRequests[0]();
  } else if (randomValue <= 0.5) {
    res = testRequests[1]();
  } else if (randomValue <= 0.575) {
    res = testRequests[2]();
  } else if (randomValue <= 0.65) {
    res = testRequests[3]();
  } else if (randomValue <= 0.775) {
    res = testRequests[4]();
  } else if (randomValue <= 0.9) {
    res = testRequests[5]();
  } else if (randomValue <= 0.95) {
    res = testRequests[6]();
  } else {
    res = testRequests[7]();
  }

  // console.log(res.status, res.method, res.url);

  sleep(1);

};
