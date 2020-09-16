const authGuard = (user) => {
  if (!user) {
    const error = new Error('Not authenticated!');
    error.code = 401;
    throw error;
  }
};

module.exports = {
  authGuard,
};
