const { fetchQuestions, fetchAnswers, fetchPhotos, createQuestion, createAnswer, createPhoto, updateHelpfulQuestion, updateReportQuestion, updateHelpfulAnswer, updateReportAnswer } = require('../models');

module.exports = {

  getQuestions: (req, res) => {


  },

  getAnswers: (req, res) => {

    var questionId = req.params.question_id;
    var limit = parseInt(req.query.count || 5);
    var offset = parseInt((req.query.page - 1 || 0) * limit);

    var answersResponseObject = {
      'question': questionId,
      'page': req.query.page - 1,
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
          // .then((obj) => {
          //   console.log('object', JSON.stringify(obj));
          //   return obj;
          // })
          // .catch((error) => {
          //   console.error('Error appending photos to answers', error);
          //   res.status(500).end();
          // });
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

  putHelpfulQuestion: (req, res) => {
    updateHelpfulQuestion(req.params.question_id)
      .then(() => {
        res.status(204).end();
      })
      .catch((error) => {
        console.error('Error updating question helpfulness:', error);
        res.status(500).end();
      });
  },

  putReportQuestion: (req, res) => {
    updateREportQuestion(req.params.question_id)
      .then(() => {
        res.status(204).end();
      })
      .catch((error) => {
        console.error('Error reporting question:', error);
        res.status(500).end();
      });
  },

  putHelpfulAnswer: (req, res) => {
    updateHelpfulAnswer(req.params.answer_id)
      .then(() => {
        res.status(204).end();
      })
      .catch((error) => {
        console.error('Error updating answer helpfulness:', error);
        res.status(500).end();
      });
  },

  putReportAnswer: (req, res) => {
    updateReportAnswer(req.params.answer_id)
      .then(() => {
        res.status(204).end();
      })
      .catch((error) => {
        console.error('Error reporting answer:', error);
        res.status(500).end();
      });

    res.status(204).end();
  }

};