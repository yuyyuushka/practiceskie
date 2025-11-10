const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const corsOptions = require('./config/cors');

const app = express();

app.use(helmet());
app.use(compression());

app.use(cors(corsOptions));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: process.env.API_RATE_LIMIT || 100, 
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

app.use(express.json());
app.use('/api', require('./routes'));

module.exports = app;