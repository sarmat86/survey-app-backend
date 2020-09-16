const Poll = require('../../models/Poll');
const Survey = require('../../models/Survey');
const { authGuard } = require('../../helpers/auth');
const { throwError } = require('../../helpers/errorHandlers');

module.exports = {

  polls: async (_, req) => {
    authGuard(req.user);
    const polls = await Poll.find({ surveyAuthorId: req.user._id });
    if (!polls) {
      throwError('No polls found!', 404);
    }
    return polls.map((poll) => ({
      ...poll._doc,
      id: poll._doc._id,
      createdAt: poll.createdAt.toISOString(),
      updatedAt: poll.updatedAt.toISOString(),
    }));
  },
  poll: async ({ id }, req) => {
    authGuard(req.user);
    const poll = await Poll.findById({ _id: id, authorId: req.user._id });
    if (!poll) {
      throwError('No poll found!', 404);
    }
    return {
      ...poll._doc,
      id: poll._doc._id,
      createdAt: poll.createdAt.toISOString(),
      updatedAt: poll.updatedAt.toISOString(),
    };
  },
  createPoll: async ({ surveyId, data }) => {
    const survey = await Survey.findOne({ _id: surveyId })
      .populate('author');
    if (!survey) {
      throwError(`No surveys with id: ${surveyId} found!`, 404);
    }
    const poll = new Poll({
      surveyId,
      answers: data.answers,
      surveyAuthorId: survey.author.id,
    });
    const createdPoll = await poll.save();
    return {
      ...createdPoll._doc,
      id: createdPoll._doc._id,
      createdAt: createdPoll.createdAt.toISOString(),
      updatedAt: createdPoll.updatedAt.toISOString(),
    };
  },
  updatePollAnswers: async ({ id, answers }, req) => {
    authGuard(req.user);
    const poll = await Poll.findOne({ _id: id, surveyAuthorId: req.user._id });
    if (!poll) {
      throwError(`No surveys with id: ${id} found!`, 404);
    }
    answers.forEach((answer) => {
      const i = poll.answers.findIndex((item) => item.questionId.toString() === answer.questionId);
      if (i !== -1) {
        poll.answers[i].choices = answer.choices;
      }
    });
    const updatedPoll = await poll.save();
    return {
      ...updatedPoll._doc,
      id: updatedPoll._doc._id,
      createdAt: updatedPoll.createdAt.toISOString(),
      updatedAt: updatedPoll.updatedAt.toISOString(),
    };
  },
  deletePoll: async ({ id }, req) => {
    authGuard(req.user);
    const poll = await Poll.findById(id);
    if (!poll) {
      throwError('No poll found!', 404);
    }
    if (poll.surveyAuthorId.toString() !== req.user._id.toString()) {
      throwError('Not authorized!', 403);
    }
    await poll.deleteOne()
      .catch((err) => { throw new Error(err); });
    return true;
  },
};
