const controllers = require('./controllers');
const router = require('express').Router();

// Gets all questions for a product_id query param
router.get('/questions', controllers.getQuestions);

// Gets all answers for a question_id query param
router.get('/answers', controllers.getAnswers);

// Adds a question
router.post('/questions', controllers.postQuestion);

// Adds an answer for a question_id request param
router.post('/questions/:question_id/answers', controllers.postAnswer);

// Updates a question's helpful field
router.put('/questions/:question_id/helpful', controllers.putQuestion);

// Updates a question's reported field
router.put('/questions/:question_id/report', controllers.putQuestion);

// Updates an answers's helpful field
router.put('/answers/:answer_id/helpful', controllers.putAnswer);

// Updates an answers's reported field
router.put('/answers/:answer_id/report', controllers.putAnswer);

module.exports = router;