const { fetchQuestions, fetchAnswers, createQuestion, createAnswer, createPhoto, updateQuestion, updateAnswer } = require('../models');

module.exports = {

  getQuestions: (req, res) => {

    if (!req.query.product_id) {
      console.log(req.params);
      res.status(404).end();
    }

    var productId = req.query.product_id;
    var limit = req.query.count || 5;
    var offset = (req.query.page - 1 || 0) * limit;

    fetchQuestions(productId, limit, offset)
      .then((result) => {
        // console.log(result.rows);
        res.send(result.rows);
        return result.rows;
      })
      .catch((error) => {
        console.error('Error retrieving questions:', error);
        res.status(400).end();
      })
  },

  getAnswers: (req, res) => {




    res.end();
  },

  postQuestion: (req, res) => {
    createQuestion(req.body)
      .then((result) => {
        res.status(201).end();
      })
      .catch((error) => {
        console.error('Error creating question:', error);
        res.status(400).end();
      });
  },

  postAnswer: (req, res) => {

    var data = {
      question_id: req.params.question_id,
      body: req.body.body,
      name: req.body.name,
      email: req.body.email
    };

    var photoUrls = req.body.photos;

    createAnswer(data)
      .then((result) => {
        var answerId = result.rows[0].id;
        return Promise.all(photoUrls.map((photoUrl) => {
          createPhoto(answerId, photoUrl)
            .then((result) => console.log(result.rows[0].url));
        }))
          .then((result) => {
            res.status(201).end();
          });
      })
      .catch((error) => {
        console.error('Error creating answer and photos:', error);
        res.status(500).end();
      });
  },

  putQuestion: (req, res) => {


    res.end();
  },

  putAnswer: (req, res) => {


    res.end();
  }

};