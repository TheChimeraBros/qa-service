const { getQuestions } = require('./controllers');
const router = require('express').Router();

// Gets all questions for a product_id query param
router.get('/questions', getQuestions);

// Gets all answers for a question_id query param
router.get('/answers', getAnswers);

// Adds a question
router.post('/questions', postQuestion);

// Adds an answer for a question_id request param
router.post('/questions/:question_id/answers', postAnswer);

// Updates a question's helpful field
router.put('/questions/:question_id/helpful', putHelpfulQuestion);

// Updates a question's reported field
router.put('/questions/:question_id/report', putReportQuestion);

// Updates an answers's helpful field
router.put('/answers/:answer_id/helpful', putHelpfulAnswer);

// Updates an answers's reported field
router.put('/answers/:answer_id/report', putReportAnswer);

module.exports = router;