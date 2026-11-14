const data = require('../models/data');

/* GET rooms view */
const rooms = async (req, res, next) => {
  try {
    res.render('rooms', {
      title: 'Travlr Getaways - Rooms',
      rooms: await data.read('rooms')
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  rooms
};
