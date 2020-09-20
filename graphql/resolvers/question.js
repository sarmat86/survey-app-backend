const Survey = require('../../models/Survey');
const Question = require('../../models/Question');
const { authGuard } = require('../../helpers/auth');
const { throwError } = require('../../helpers/errorHandlers');

module.exports = {

  questions: async ({ surveyId }, req) => {
    authGuard(req.user);
    const query = {};
    query.authorId = req.user._id;
    if (surveyId) {
      query.surveyId = surveyId;
    }
    const questions = await Question.find(query);
    if (!questions) {
      throwError('No surveys found!', 404);
    }
    return questions.map((question) => ({
      ...question._doc,
      id: question._doc._id,
      createdAt: question.createdAt.toISOString(),
      updatedAt: question.updatedAt.toISOString(),
    }));
  },

  question: async ({ id }, req) => {
    authGuard(req.user);
    const question = await Question.findById({ _id: id, authorId: req.user._id });
    if (!question) {
      throwError('No question found!', 404);
    }
    return {
      ...question._doc,
      id: question._doc._id,
      createdAt: question.createdAt.toISOString(),
      updatedAt: question.updatedAt.toISOString(),
    };
  },
  addQuestion: async ({ surveyId, data }, req) => {
    authGuard(req.user);
    const survey = await Survey.findById(surveyId);
    if (!survey) {
      throwError('No survey found!', 404);
    }
    const { content, position, choices } = data;
    const newQuestion = new Question({
      content,
      position,
      choices,
      surveyId: survey._id,
      authorId: req.user._id,
    });
    const createdQuestion = await newQuestion.save();
    survey.questions.push(createdQuestion._id);
    await survey.save();
    return {
      ...createdQuestion._doc,
      id: createdQuestion._id,
      createdAt: createdQuestion.createdAt.toISOString(),
      updatedAt: createdQuestion.updatedAt.toISOString(),
    };
  },

  updateQuestion: async ({ id, data }, req) => {
    authGuard(req.user);
    const foundQuestion = await Question.findOne({ _id: id, authorId: req.user._id });
    if (!foundQuestion) {
      throwError('No question found!', 404);
    }
    const { content, position, choices } = data;
    if (content) {
      foundQuestion.content = content;
    }
    if (position) {
      foundQuestion.position = position;
    }
    if (choices) {
      foundQuestion.choices = choices;
    }
    const updatedQuestion = await foundQuestion.save();

    return {
      ...updatedQuestion._doc,
      id: updatedQuestion._id,
      createdAt: updatedQuestion.createdAt.toISOString(),
      updatedAt: updatedQuestion.updatedAt.toISOString(),
    };
  },

  deleteQuestion: async ({ id }, req) => {
    authGuard(req.user);
    try {
      const deleted = await Question.deleteOne({ _id: id, authorId: req.user._id });
      return {
        success: deleted.ok === 1 && deleted.n === 1 && deleted.deletedCount === 1,
        matchedDocuments: deleted.n,
        deletedCount: deleted.deletedCount,
      };
    } catch (err) {
      throw new Error(err);
    }
  },

  deleteQuestions: async ({ questionsId }, req) => {
    authGuard(req.user);
    try {
      const deleted = await Question.deleteMany({
        _id: {
          $in: questionsId,
        },
        authorId: req.user._id,
      });
      return {
        success: deleted.ok === 1
        && deleted.n === questionsId.length && deleted.deletedCount === questionsId.length,
        matchedDocuments: deleted.n,
        deletedCount: deleted.deletedCount,
      };
    } catch (err) {
      throw new Error(err);
    }
  },
};
