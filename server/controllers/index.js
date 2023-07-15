const { fetchQuestions, fetchAnswers, createQuestion, createAnswer, createPhoto, updateHelpfulQuestion, updateReportQuestion, updateHelpfulAnswer, updateReportAnswer } = require('../models');

module.exports = {

  getQuestions: (req, res) => {


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