const throwError = (msg, code) => {
  const error = new Error(msg);
  error.code = code;
  throw error;
};

module.exports = {
  throwError,
};
