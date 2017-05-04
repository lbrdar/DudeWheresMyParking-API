import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';

// Routes
import routes from './routes/';


const app = express();

app.use(logger('dev'));
app.use(cors());
app.enable('trust proxy');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {  // eslint-disable-line no-unused-vars
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
}

app.use(function (err, req, res, next) {   // eslint-disable-line no-unused-vars
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: {}
  });
});

export default app;
