/* GET Homepage */
const index = (req, res) => {
  res.render('index', { title: 'Travlr Getaways', active: { home: true } });
};

module.exports = {
  index
};
