const Survey = require('../../models/Survey');
const Question = require('../../models/Question');
const { authGuard } = require('../../helpers/auth');
const { throwError } = require('../../helpers/errorHandlers');

module.exports = {

  questions: async (_, req) => {
    authGuard(req.user);
    const questions = await Question.find({ authorId: req.user._id });
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
  addQuestionToSurvey: async ({ id, surveyId, position }, req) => {
    authGuard(req.user);
    const survey = await Survey.findOne({ _id: surveyId, author: req.user });
    if (!survey) {
      throwError('No survey found!', 404);
    }
    const question = await Question.findOne({ _id: id, authorId: req.user._id });
    if (!question) {
      throwError('No question found!', 404);
    }
    survey.questions.push({
      question,
      position,
    });
    await survey.save();
    return true;
  },
  createQuestion: async ({ surveyId, position, data }, req) => {
    authGuard(req.user);
    let survey = null;
    if (surveyId) {
      survey = await Survey.findById(surveyId);
      if (!survey) {
        throwError('No survey found!', 404);
      }
    }
    const { content, favourite, choices } = data;
    const newQuestion = new Question({
      content,
      favourite: !!favourite,
      choices,
      authorId: req.user._id,
    });
    const createdQuestion = await newQuestion.save();

    if (survey) {
      survey.questions.push({
        question: createdQuestion,
        position,
      });
      await survey.save();
    }
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
    const { content, favourite, choices } = data;
    if (content) {
      foundQuestion.content = content;
    }
    if (favourite) {
      foundQuestion.favourite = favourite;
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
    const surveys = await Survey.updateMany({ 'questions.question': id, author: req.user },
      { $pull: { questions: { question: id } } });
    const deleted = await Question.deleteOne({ _id: id, authorId: req.user._id });
    return {
      success: deleted.ok === 1 && deleted.n === 1 && deleted.deletedCount === 1,
      matchedDocuments: deleted.n,
      deletedCount: deleted.deletedCount,
      updatedSurvey: surveys.n,
    };
  },

  deleteQuestions: async ({ questionsId }, req) => {
    authGuard(req.user);
    const surveys = await Survey.updateMany({ 'questions.question': { $in: questionsId }, author: req.user },
      { $pull: { questions: { question: { $in: questionsId } } } });
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
      updatedSurvey: surveys.n,
    };
  },
  updateChoice: async ({
    questionId, choiceId, content, position,
  }, req) => {
    authGuard(req.user);
    const question = await Question.findById({ _id: questionId, authorId: req.user._id });
    if (!question) {
      throwError('No question found!', 404);
    }
    const i = question.choices.findIndex((choice) => choice.id.toString() === choiceId);
    if (i !== -1 && (content || position)) {
      if (position) {
        question.choices[i].position = position;
      }
      if (content) {
        question.choices[i].content = content;
      }
      await question.save();
      return true;
    }
    return false;
  },
};
