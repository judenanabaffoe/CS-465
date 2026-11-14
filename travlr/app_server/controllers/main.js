const data = require('../models/data');

/* GET Homepage */
const index = async (req, res, next) => {
  try {
    const [home, news] = await Promise.all([data.read('home'), data.read('news')]);
    res.render('index', {
      title: 'Travlr Getaways',
      home,
      blog: news.blog
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  index
};
