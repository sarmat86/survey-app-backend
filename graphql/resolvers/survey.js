const Survey = require('../../models/Survey');
const Question = require('../../models/Question');
const { authGuard } = require('../../helpers/auth');
const { throwError } = require('../../helpers/errorHandlers');

module.exports = {

  surveys: async (args, req) => {
    authGuard(req.user);
    const surveys = await Survey.find({ author: req.user })
      .sort({ createdAt: -1 })
      .populate('author')
      .populate('questions');
    if (!surveys) {
      throwError('No surveys found!', 404);
    }
    return surveys.map((survey) => ({
      ...survey._doc,
      id: survey._doc._id,
      createdAt: survey.createdAt.toISOString(),
      updatedAt: survey.updatedAt.toISOString(),
    }));
  },

  survey: async ({ id }, req) => {
    const survey = await Survey.findOne({ _id: id })
      .populate('author')
      .populate('questions');
    if (!survey) {
      throwError('No surveys found!', 404);
    }
    return {
      ...survey._doc,
      id: survey._doc._id,
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
    const survey = await Survey.findOne({ _id: id, author: req.user });
    if (!survey) {
      throwError('No survey found!', 404);
    }
    if (survey.author._id.toString() !== req.user._id.toString()) {
      throwError('Not authorized!', 403);
    }
    await survey.deleteOne()
      .catch((err) => { throw new Error(err); });
    return true;
  },

};
