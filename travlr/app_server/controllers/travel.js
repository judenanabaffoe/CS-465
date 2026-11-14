const data = require('../models/data');

const dateFmt = new Intl.DateTimeFormat('en-US', {
  month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC'
});

// Shape a raw trip record into what the view displays.
const toViewModel = (trip) => ({
  ...trip,
  startDisplay: dateFmt.format(new Date(trip.start)),
  // 1199.00 -> 1,199.00
  perPerson: Number(trip.perPerson).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
});

/* GET travel view */
const travel = async (req, res, next) => {
  try {
    const trips = (await data.read('trips')).map(toViewModel);
    res.render('travel', {
      title: 'Travlr Getaways - Travel',
      trips
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  travel
};
