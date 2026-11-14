const data = require('../models/data');

// MODULE 3: puts the data every page needs (brand, navigation, year) on res.locals,
// so the header and footer partials render the same menu everywhere.
// The nav item matching the current URL is flagged `current` for highlighting.
const site = async (req, res, next) => {
  try {
    const { brand, nav } = await data.read('site');
    res.locals.brand = brand;
    res.locals.year = new Date().getFullYear();
    res.locals.nav = nav.map((item) => ({
      ...item,
      current: item.href === '/'
        ? req.path === '/'
        : req.path === item.href || req.path.startsWith(item.href + '/')
    }));
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = site;
