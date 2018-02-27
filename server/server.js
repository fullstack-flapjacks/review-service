const _ = require('ramda');

const express = require('express');
// const reactApp = require('./reactApp.bundle');
// const reactDOMServer = require('react-dom/server');


const DB_NAME = 'reviewservice';

const mongoose = require('mongoose');
mongoose.connect(process.env.DB + DB_NAME);
const Models = require('./db-models/models.js');

const app = express();
app.use(express.static('../public'));


const amw = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

function createSearchString(searchString){
  if (!searchString || searchString.length === 0){ return ""; }
  const words = searchString.split(',');
  const andWords = _.map((word) => '\"' + word + '\"', words);
  // console.log(andWords);
  return andWords.join(' ');

}

const router = express.Router();
// router.use(asyncMiddleware);

router.get('/home', amw(async (req, res, next) => {
    const restaurants  = await Models.restaurantModel.find({}).limit(10);
    const restaurant   = restaurants[0];
    const reviews      = await Models.reviewsModel.find({ restaurant: restaurant._id }).limit(100).sort({ dinedOn: -1 }).exec();
    const totalReviews = await Models.reviewsModel.find({ restaurant: restaurant._id }).count();
    const reviewsUsers = await Promise.all(_.map(async (review) => {
      const reviewClone = _.clone(review._doc);
      const user = await Models.userModel.findOne({ _id: review.user });

      return {...reviewClone, user: user._doc };
    }, reviews));

    const stats = await Models.statsModel.findOne({ restaurant: restaurant._id });

    res.send({ status: 'ok', json: { reviews: reviews, stats: stats, totalReviews: totalReviews }});
}));

// router.get('/reviews/:rid/:page/:page_length/:search?', amw(async (req, res, next) => {
//   const params      = req.params;
//   const rid         = params.rid;
//   const page        = parseInt(params.page);
//   const page_length = parseInt(params.page_length);
//   const search      = createSearchString(params.search);

//   if (search === undefined){
//     var reviews = await Models.reviewsModel.find({ restaurant: rid }).skip(page*page_length).limit(page_length);
//   } else {
//     var reviews = await Models.reviewsModel.find({ restaurant: rid, $text: { $search: search } }).skip(page*page_length).limit(page_length);
//   }

//   res.send({ status: 'ok', json: { reviews: reviews } });
// }));

router.get('/newest/:rid/:page/:page_length/:search?', amw(async (req, res) => {
  const params      = req.params;

  // console.log('params', params);
  const rid         = params.rid;
  const page        = parseInt(params.page);
  const page_length = parseInt(params.page_length);
  const search      = createSearchString(params.search);

  // console.log('offset', (page - 1)*page_length);

  if (search === undefined || search.length === 0){
    var reviews = await Models.reviewsModel
      .find({ restaurant: rid })
      .sort({ dinedOn: -1 })
      .skip((page - 1)*page_length)
      .limit(page_length);

    var totalReviews = await Models.reviewsModel
      .find({ restaurant: rid }).count();
  } else {
    var reviews = await Models.reviewsModel
      .find({ restaurant: rid, $text: { $search: search } })
      .sort({ dinedOn: -1 })
      .skip((page - 1)*page_length)
      .limit(page_length);

    var totalReviews = await Models.reviewsModel
      .find({ restaurant: rid, $text: { $search: search } }).count();
  }

  res.send({ status: 'ok', json: { reviews: reviews, totalReviews: totalReviews } });
}));

router.get('/highest/:rid/:page/:page_length/:search?', amw(async (req, res, next) => {
  const params      = req.params;

  // console.log('params', params);
  const rid         = params.rid;
  const page        = parseInt(params.page);
  const page_length = parseInt(params.page_length);
  const search      = createSearchString(params.search);

  if (search === undefined || search.length === 0){
    var reviews = await Models.reviewsModel
      .find({ restaurant: rid })
      .sort({ averageRating: -1 })
      .skip((page - 1)*page_length)
      .limit(page_length);

    var totalReviews = await Models.reviewsModel
      .find({ restaurant: rid }).count();
  } else {
    var reviews = await Models.reviewsModel
      .find({ restaurant: rid, $text: { $search: search } })
      .sort({ averageRating: -1 })
      .skip((page - 1)*page_length)
      .limit(page_length);

    var totalReviews = await Mdoels.reviewsModel
      .find({ restaurant: rid, $text: { $search: search } }).count();
  }

  res.send({ status: 'ok', json: { reviews: reviews, totalReviews: totalReviews } });
}));

router.get('/lowest/:rid/:page/:page_length/:search?', amw(async (req, res, next) => {
  const params      = req.params;
  const rid         = params.rid;
  const page        = parseInt(params.page);
  const page_length = parseInt(params.page_length);
  const search      = createSearchString(params.search);

  if (search === undefined || search.length === 0){
    var reviews = await Models.reviewsModel
      .find({ restaurant: rid })
      .sort({ averageRating: 1 })
      .skip((page - 1)*page_length)
      .limit(page_length);

    var totalReviews = await Models.reviewsModel
      .find({ restaurant: rid }).count();
  } else {
    var reviews = await Models.reviewsModel
      .find({ restaurant: rid, $text: { $search: search } })
      .skip((page - 1)*page_length)
      .limit(page_length);

    var totalReviews = await Models.reviewsModel
      .find({ restaurant: rid, $text: { $search: search } }).count();
  }

  res.send({ status: 'ok', json: { reviews: reviews, totalReviews: totalReviews } });
}));

app.use('/', router);
app.listen(4004);
