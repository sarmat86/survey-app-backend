const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  }],
}, { timestamps: true });

const Survey = mongoose.model('Survey', surveySchema);

module.exports = Survey;
