const data = require('../models/data');

/* GET news view */
const news = async (req, res, next) => {
  try {
    const { featured, latest, tips } = await data.read('news');
    res.render('news', {
      title: 'Travlr Getaways - News',
      featured,
      latest,
      tips
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  news
};
