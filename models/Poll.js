const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    required: true,
  },
  surveyAuthorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
      },
      choices: [{
        type: mongoose.Schema.Types.ObjectId,
      }],
    },
  ],

}, { timestamps: true });

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
