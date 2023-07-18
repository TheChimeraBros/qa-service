const { fetchQuestions, fetchAnswers, fetchPhotos, createQuestion, createAnswer, createPhoto, updateHelpfulQuestion, updateReportQuestion, updateHelpfulAnswer, updateReportAnswer } = require('../models');

module.exports = {

  getQuestions: (req, res) => {

    if (!req.query.product_id) {
      console.log(req.params);
      res.status(404).end();
    } else {
      var productId = req.query.product_id;
      var limit = parseInt(req.query.count) || 5;
      var offset = (parseInt(req.query.page) - 1 || 0) * limit;

      var questionsResponseObject = {
        'product': productId,
        'page': req.query.page - 1 || 0,
        'count': limit
      };

      console.log('fetching questions');
      fetchQuestions(productId, limit, offset)
        .then((data) => {
          questionsResponseObject.results = data.rows;
          return questionsResponseObject;
        })
        .then((questionsResponseObject) => {
          return Promise.all(questionsResponseObject.results.map((question) => {
            question.answers = {};
            var questionId = question.question_id;
            return fetchAnswers(questionId, 999, 0)
              .then((data) => {
                return Promise.all(data.rows.map((answer) => {
                  var answerId = answer.id;
                  return fetchPhotos(answerId)
                    .then((data) => {
                      answer.photos = data.rows;
                      question.answers[answer.id] = answer;
                    });
                }));
              })
              .catch((error) => {
                console.error('Error fetching answers');
                res.status(500).end();
              });
          }))
            .then((something) => console.log('something:', something))
            .catch((error) => {
              console.error('Errow with something, I guess:', error);
              res.status(500).end();
            });
        })
        .then((something) => {
          console.log(something);
          res.status(200).send(questionsResponseObject);
        })
        .catch((error) => {
          console.error('Error fetching questions, answers, and photos:', error);
          res.status(500).end();
        });
    }
  },

  getAnswers: (req, res) => {

    var questionId = req.params.question_id;
    var limit = parseInt(req.query.count) || 5;
    var offset = (parseInt(req.query.page) - 1 || 0) * limit;

    var answersResponseObject = {
      'question': questionId,
      'page': req.query.page - 1 || 0,
      'count': limit
    };

    fetchAnswers(questionId, limit, offset)
      .then((result) => {
        answersResponseObject.results = result.rows;
        return answersResponseObject;
      })
      .then((answersResponseObject) => {
        return Promise.all(answersResponseObject.results.map((answer) => {
          var answerId = answer.id;
          return fetchPhotos(answerId)
            .then((result) => {
              answer.photos = result.rows;
            });
        }));
      })
      .then(() => {
        console.log(answersResponseObject);
        res.status(200).send(answersResponseObject);
      })
      .catch((error) => {
        console.error('Error fetching answers and photos:', error);
        res.status(500).end();
      });
  },

  postQuestion: (req, res) => {
    if (!req.body.body || !req.body.name || !req.body.email || !req.body.product_id) {
      res.status(400).end();
    } else {
      createQuestion(req.body)
        .then((result) => {
          res.status(201).end();
        })
        .catch((error) => {
          console.error('Error creating question:', error);
          res.status(500).end();
        });
    }
  },

  postAnswer: (req, res) => {

    if (!req.body.body || !req.body.name || !req.body.email || !req.params.question_id || isNaN(parseInt(req.params.question_id))) {
      res.status(400).end();
    } else {
      var data = {
        question_id: req.params.question_id,
        body: req.body.body,
        name: req.body.name,
        email: req.body.email
      };

      var photoUrls = req.body.photos || [];

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
    }
  },

  putHelpfulQuestion: (req, res) => {
    if (isNaN((req.params.question_id))) {
      res.status(404).end();
    } else {
      updateHelpfulQuestion(req.params.question_id)
        .then(() => {
          res.status(204).end();
        })
        .catch((error) => {
          console.error('Error updating question helpfulness:', error);
          res.status(500).end();
        });
    }
  },

  putReportQuestion: (req, res) => {
    if (isNaN(req.params.question_id)) {
      res.status(404).end();
    } else {
      updateReportQuestion(req.params.question_id)
        .then(() => {
          res.status(204).end();
        })
        .catch((error) => {
          console.error('Error reporting question:', error);
          res.status(500).end();
        });
    }
  },

  putHelpfulAnswer: (req, res) => {
    if (isNaN(req.params.answer_id)) {
      res.status(404).end();
    } else {
      updateHelpfulAnswer(req.params.answer_id)
        .then(() => {
          res.status(204).end();
        })
        .catch((error) => {
          console.error('Error updating answer helpfulness:', error);
          res.status(500).end();
        });
    }
  },

  putReportAnswer: (req, res) => {
    if (isNaN(req.params.answer_id)) {
      res.status(404).end();
    } else {
      updateReportAnswer(req.params.answer_id)
        .then(() => {
          res.status(204).end();
        })
        .catch((error) => {
          console.error('Error reporting answer:', error);
          res.status(500).end();
        });
    }
  }
};