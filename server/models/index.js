const db = require('../db');

const query = (queryString, queryArgs) => {
  return db.query(queryString, queryArgs)
    .then((res) => {
      // console.log(res.rows);
      return res;
    })
    .catch((err) => err);
};

module.exports = {

  fetchQuestions: (productId, limit, offset) => {
    var queryString = 'SELECT id AS question_id, body AS question_body, date, asker_name, helpfulness AS question_helpfulness, reported FROM questions WHERE product_id=$1 AND reported=false LIMIT $2 OFFSET $3';
    var queryArgs = [productId, limit, offset];
    return query(queryString, queryArgs);
  },

  fetchAnswers: (questionId, limit, offset) => {
    var queryString = 'SELECT id, body, date, answerer_name, helpfulness FROM answers WHERE question_id=$1 LIMIT $2 OFFSET $3';
    var queryArgs = [questionId, limit, offset];
    return query(queryString, queryArgs);
  },

  fetchPhotos: (answerId) => {
    var queryString = 'SELECT id, url FROM photos WHERE answer_id=$1';
    var queryArgs = [answerId];
    return query(queryString, queryArgs);
  },

  createQuestion: (data) => {
    var queryString = 'INSERT INTO questions (product_id, body, asker_name, asker_email) VALUES ($1, $2, $3, $4)';
    var queryArgs = [data.product_id, data.body, data.name, data.email];
    return query(queryString, queryArgs);
  },

  createAnswer: (data) => {
    var queryString = 'INSERT INTO answers (question_id, body, answerer_name, answerer_email) VALUES ($1, $2, $3, $4) RETURNING id';
    var queryArgs = [data.question_id, data.body, data.name, data.email];
    return query(queryString, queryArgs);
  },

  createPhoto: (answerId, photoUrl) => {
    var queryString = 'INSERT INTO photos (answer_id, url) VALUES ($1, $2) RETURNING url';
    var queryArgs = [answerId, photoUrl];
    return query(queryString, queryArgs);
  },

  updateHelpfulQuestion: (questionId) => {
    var queryString = 'UPDATE questions SET helpfulness = helpfulness + 1 WHERE id = $1';
    var queryArgs = [questionId];
    return query(queryString, queryArgs);
  },

  updateReportQuestion: (questionId) => {
    var queryString = 'UPDATE questions SET reported = true WHERE id = $1';
    var queryArgs = [questionId];
    return query(queryString, queryArgs);
  },

  updateHelpfulAnswer: (answerId) => {
    var queryString = 'UPDATE answers SET helpfulness = helpfulness + 1 WHERE id = $1';
    var queryArgs = [answerId];
    return query(queryString, queryArgs);
  },

  updateReportAnswer: (answerId) => {
    var queryString = 'UPDATE answers SET reported = true WHERE id = $1';
    var queryArgs = [answerId];
    return query(queryString, queryArgs);
  }
};