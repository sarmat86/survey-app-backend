/**
 * GET /
 * Home page.
 */
exports.panel = (req, res) => {
  res.render('panel', {
    title: 'Panel'
  });
};
