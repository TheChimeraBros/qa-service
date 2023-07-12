cosnt photoSchema = new Schema({
  url: { type: String, required: true }
});

const answerSchema = new Schema({
  body: { type: String, required: true },
  date: { type: Date, default: Date.now },
  answerer_name: { type: String, required: true },
  helpfulness: { type: Integer },
  reported: { type: Boolean, default: false },
  photos: [photoSchema]
});

const Answer = mongoose.mode('Answer', answerSchema);

const questionSchema = new Schema({
  body: { type: String, required: true },
  date: { type: Date, default: Date.now },
  asker_name: { type: String, required: true },
  helpfulness: { type: Integer },
  reported: { type: Boolean, default: false },
  answers: { type: 'ObjectId', ref: 'Answer'}
})

const Question = mongoose.model('Question', questionSchema);