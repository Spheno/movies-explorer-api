const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const errorsMiddlewares = require('./middlewares/errors-middlewares');
const options = require('./middlewares/options');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');
const { DATABASE } = require('./utils/config');

const { NODE_ENV, NSQL } = process.env;

const { PORT = 3001 } = process.env;

const app = express();

app.use(helmet());

mongoose.connect(NODE_ENV === 'production' ? NSQL : DATABASE, {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);

app.use(limiter);

app.use('*', cors(options));

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(errorsMiddlewares);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
