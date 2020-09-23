const Survey = require('../../models/Survey');
const { authGuard } = require('../../helpers/auth');
const { throwError } = require('../../helpers/errorHandlers');

module.exports = {

  surveys: async (args, req) => {
    authGuard(req.user);
    const surveys = await Survey.find({ author: req.user })
      .sort({ createdAt: -1 })
      .populate('author')
      .populate({
        path: 'questions',
        populate: {
          path: 'question',
          model: 'Question',
        },
      });
    if (!surveys) {
      throwError('No surveys found!', 404);
    }

    const toReturn = surveys.map((survey) => ({
      ...survey._doc,
      id: survey._doc._id,
      questions: survey.questions.map((item) => ({
        ...item.question._doc,
        id: item.question._doc._id,
        position: item.position,
      })),
      createdAt: survey.createdAt.toISOString(),
      updatedAt: survey.updatedAt.toISOString(),
    }));
    return toReturn;
  },

  survey: async ({ id }, req) => {
    authGuard(req.user);
    const survey = await Survey.findOne({ _id: id, author: req.user })
      .populate('author')
      .populate({
        path: 'questions',
        populate: {
          path: 'question',
          model: 'Question',
        },
      });
    if (!survey) {
      throwError('No surveys found!', 404);
    }
    return {
      ...survey._doc,
      id: survey._doc._id,
      questions: survey.questions.map((item) => ({
        ...item.question._doc,
        id: item.question._doc._id,
        position: item.position,
      })),
      createdAt: survey.createdAt.toISOString(),
      updatedAt: survey.updatedAt.toISOString(),
    };
  },

  createSurvey: async (args, req) => {
    authGuard(req.user);
    const { topic } = args.data;
    const survey = new Survey({
      author: req.user,
      topic,
      questions: [],
    });
    const createdSurvey = await survey.save();
    return {
      ...createdSurvey._doc,
      id: createdSurvey._doc._id,
      createdAt: createdSurvey.createdAt.toISOString(),
      updatedAt: createdSurvey.updatedAt.toISOString(),
    };
  },

  updateSurvey: async ({ id, data }, req) => {
    authGuard(req.user);
    const { topic } = data;
    const survey = await Survey.findOne({ _id: id, author: req.user });
    if (!survey) {
      throwError('No survey found!', 404);
    }
    survey.topic = topic;
    const updatedSurvey = await survey.save();
    return {
      ...updatedSurvey._doc,
      id: updatedSurvey._id.toString(),
      createdAt: updatedSurvey.createdAt.toISOString(),
      updatedAt: updatedSurvey.updatedAt.toISOString(),
    };
  },

  deleteSurvey: async ({ id }, req) => {
    authGuard(req.user);
    const survey = await Survey.deleteOne({ _id: id, author: req.user });
    return {
      success: survey.ok === 1 && survey.n === 1 && survey.deletedCount === 1,
      matchedDocuments: survey.n,
      deletedCount: survey.deletedCount,
    };
  },

  updateQuestionPos: async ({ surveyId, questionId, position }, req) => {
    authGuard(req.user);
    const survey = await Survey.findOne({ _id: surveyId, author: req.user });
    if (!survey) {
      throwError('No surveys found!', 404);
    }
    const i = survey.questions.findIndex((item) => item.question.toString() === questionId);
    if (i !== -1) {
      survey.questions[i].position = position;
      await survey.save();
      return true;
    }
    return false;
  },

};
