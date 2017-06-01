/* eslint-disable */
exports.notFound = (req, res, next) => {
  const err = new Error('Route Not Found!');
  err.status = 404;
  this.devErrors(err,req, res)
};

exports.arrayLength = (req, res) => {
  const err = new Error('ID not found!');
  err.status = 404;
  this.devErrors(err, req, res);
};

exports.invalidID = (response) => {
  response.status(404).json({ error: 'ID not found!' });
};

exports.queryArrayLength = (req, res) => {
  const err = new Error('Your query param is ultra invalid!');
  err.status = (404);
  this.devErrors(err, req, res);
};

exports.dontTouchID = (response) => {
  response.status(422).json({ error: 'you cannot update that yung ID!' });
};

exports.missingFields = (response) => {
  response.status(422).json({ error: 'Missing fields from request!' });
};

exports.serverError = (response) => {
  response.status(500).json({ error: 'Internal Server Error'});
};

exports.devErrors = (err, req, res) => {
  err.stack = err.stack || '';
  const errorDetails = {
    message: err.message,
    status: err.status,
    stackHighlighted: err.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>')
  };
  res.status(err.status || 500);
  res.format({
    'text/html': () => {
      res.render('error', errorDetails);
    },
    'application/json': () => res.json(errorDetails)
  });
};

exports.productionErrors = (err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
};

