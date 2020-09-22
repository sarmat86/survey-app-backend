const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  favourite: {
    type: Boolean,
  },
  choices: [
    {
      content: {
        type: String,
        required: true,
      },
      position: {
        type: Number,
      },
    },
  ],
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
