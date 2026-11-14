const data = require('../models/data');

const render = async (res, next, extra = {}) => {
  try {
    const { contact } = await data.read('site');
    res.render('contact', { title: 'Travlr Getaways - Contact', contact, ...extra });
  } catch (err) {
    next(err);
  }
};

/* GET contact view */
const contact = (req, res, next) => render(res, next);

/* POST contact form.
   Module 3 only confirms receipt; the message is not stored or emailed yet. */
const send = (req, res, next) => {
  const { name = '', email = '', subject = '', message = '' } = req.body || {};
  const missing = !name.trim() || !email.trim() || !message.trim();
  if (missing) {
    res.status(400);
    return render(res, next, {
      error: 'Please enter your name, email and a message.',
      form: { name, email, subject, message }
    });
  }
  return render(res, next, { sent: true, sentName: name.trim() });
};

module.exports = {
  contact,
  send
};
