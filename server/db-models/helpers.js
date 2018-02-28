const DB_NAME = 'reviewservice';

const mongoose = require('mongoose');
mongoose.connect(process.env.DB + DB_NAME);
const _ = require('ramda');