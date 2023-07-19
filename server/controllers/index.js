const { fetchQuestions, fetchAnswers, fetchPhotos, createQuestion, createAnswer, createPhoto, updateHelpfulQuestion, updateReportQuestion, updateHelpfulAnswer, updateReportAnswer } = require('../models');

module.exports = {

  getQuestions: (req, res) => {

    if (req.query.product_id === undefined || isNaN(req.query.product_id) || !Number.isInteger(Number(req.query.product_id))) {
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
          }));
        })
        .then(() => {
          res.status(200).send(questionsResponseObject);
        })
        .catch((error) => {
          console.error('Error fetching questions and respective answers and photos:', error);
          res.status(500).json({ error: error });
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
        res.status(200).send(answersResponseObject);
      })
      .catch((error) => {
        console.error('Error fetching answers and photos:', error);
        res.status(500).json({ error: error });
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
          res.status(500).json({ error: error });
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
            return createPhoto(answerId, photoUrl);
          }));
        })
        .then(() => {
          res.status(201).end();
        })
        .catch((error) => {
          console.error('Error creating answer and photos:', error);
          res.status(500).json({ error: error });
        });
    }
  },

  putHelpfulQuestion: (req, res) => {
    updateHelpfulQuestion(req.params.question_id)
      .then((result) => {
        if (result.rowCount === 1) {
          res.status(204).end();
        } else {
          res.status(404).end();
        }
      })
      .catch((error) => {
        console.error('Error updating question helpfulness:', error);
        res.status(500).json({ error: error });
      });
  },

  putReportQuestion: (req, res) => {
    updateReportQuestion(req.params.question_id)
      .then((result) => {
        if (result.rowCount === 1) {
          res.status(204).end();
        } else {
          res.status(404).end();
        }
      })
      .catch((error) => {
        console.error('Error reporting question:', error);
        res.status(500).json({ error: error });
      });
  },

  putHelpfulAnswer: (req, res) => {
    updateHelpfulAnswer(req.params.answer_id)
      .then((result) => {
        if (result.rowCount === 1) {
          res.status(204).end();
        } else {
          res.status(404).end();
        }
      })
      .catch((error) => {
        console.error('Error updating answer helpfulness:', error);
        res.status(500).json({ error: error });
      });
  },

  putReportAnswer: (req, res) => {
    updateReportAnswer(req.params.answer_id)
      .then((result) => {
        if (result.rowCount === 1) {
          res.status(204).end();
        } else {
          res.status(404).end();
        }
      })
      .catch((error) => {
        console.error('Error reporting answer:', error);
        res.status(500).json({ error: error });
      });
  }
};