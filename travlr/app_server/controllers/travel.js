const fs = require('fs');
const path = require('path');

// MODULE 2: trip data is read from a JSON file.
// A later module replaces this read with a call to the RESTful API / MongoDB.
const tripsPath = path.join(__dirname, '..', '..', 'data', 'trips.json');

/* GET travel view */
const travel = (req, res, next) => {
  fs.readFile(tripsPath, 'utf8', (err, raw) => {
    if (err) return next(err);

    let trips;
    try {
      trips = JSON.parse(raw);
    } catch (parseErr) {
      return next(parseErr);
    }

    res.render('travel', {
      title: 'Travlr Getaways - Travel',
      active: { travel: true },
      trips
    });
  });
};

module.exports = {
  travel
};
