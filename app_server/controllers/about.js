const data = require('../models/data');

/* GET about view */
const about = async (req, res, next) => {
  try {
    res.render('about', {
      title: 'Travlr Getaways - About',
      about: await data.read('about')
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  about
};
