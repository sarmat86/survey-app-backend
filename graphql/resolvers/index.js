const Survey = require('./question');
const Question = require('./survey');
const Poll = require('./poll');

module.exports = {
  ...Survey,
  ...Question,
  ...Poll,
};
