const express    = require('express');
const app        = module.exports = express();
const path       = require('path');
const bodyParser = require('body-parser');
const favicon    = require('serve-favicon');
const routes     = require('./routes/index');
const error      = require('./helpers/error');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes);

app.use(error.notFound);

app.use(error.devErrors);

app.listen(app.get('port'));


