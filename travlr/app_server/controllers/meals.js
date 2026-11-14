const data = require('../models/data');

/* GET meals view */
const meals = async (req, res, next) => {
  try {
    res.render('meals', {
      title: 'Travlr Getaways - Meals',
      meals: await data.read('meals')
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  meals
};
