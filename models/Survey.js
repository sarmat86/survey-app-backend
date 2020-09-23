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
  questions: [
    {
      position: {
        type: Number,
      },
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
      },
    },
  ],
}, { timestamps: true });

const Survey = mongoose.model('Survey', surveySchema);

module.exports = Survey;
