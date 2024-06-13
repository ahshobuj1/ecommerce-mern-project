const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const createError = require('http-errors');
const rateLimit = require('express-rate-limit');
const userRouter = require('./routers/userRoutes');
const seedRouter = require('./routers/seedRoute');
const {errorResponse} = require('./controllers/responseController');

const rateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    limit: 5,
    message: 'Too many request from this api, please try after a minutes',
});

app.use('/api/seed', seedRouter);
app.use('/api/users', userRouter);
app.use(rateLimiter);
app.use(morgan('dev'));
app.use(express.json());

app.get('/test', rateLimiter, (req, res) => {
    res.status(200).send({
        message: `welcome to the server test `,
    });
});

//client error handling
app.use((req, res, next) => {
    next(createError(404, 'route not found'));
});

//server error handling
app.use((err, req, res, next) => {
    return errorResponse(res, {
        statusCode: err.status,
        message: err.message,
    });
});

module.exports = app;
