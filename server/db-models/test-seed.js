const DB_NAME = 'testreviewservice';
const RID = '5a9455fc03a13c457820e762';
const NUM_USR = 100;

const mongoose = require('mongoose');
mongoose.connect(process.env.DB + DB_NAME);
const faker = require('faker');
const chance = new require('chance')();
const Models = require('./models.js');
const _ = require('ramda');

const createRestaurant = (_id) => {
  return Models.restaurantModel({
    _id: _id,
    name: faker.random.words(2),
    locations: [faker.address.city(), faker.address.city()]
  }).save();
}

const createUsers = () => {
  const users = _.map(() => {
    return Models.userModel({
      name: faker.name.findName(),
      isVIP: faker.random.boolean(),
      avatar: faker.image.avatar()
    }).save();
  }, _.range(0, NUM_USR));

  return Promise.all(users);  
}

const createReviewsWithRating = (rating, amount, users, restaurant) => {
  const reviews = _.map(() => {
    const user = chance.pickone(users);

    return Models.reviewsModel({
      user: user._id,
      text: faker.lorem.paragraphs(),
      tags: _.map(() => faker.random.word(), _.range(0, 5)),
      averageRating: rating,
      rating: {
        food: rating,
        ambience: rating,
        service: rating,
        value: rating
      },
      wouldRecommendToFriend: faker.random.boolean(),
      restaurant: RID,
      location: chance.pickone(restaurant.locations),
      helpfulCount: 3,
      dinedOn: faker.date.recent()
    }).save();
  }, _.range(0, amount));

  return Promise.all(reviews);  
}

Promise.all([createRestaurant(RID), createUsers()]).then((results) => {
  const restaurant = results[0];
  const users = results[1];

  return Promise.all([
    createReviewsWithRating(5, 10, users, restaurant),
    createReviewsWithRating(4, 10, users, restaurant),
    createReviewsWithRating(3, 10, users, restaurant),
    createReviewsWithRating(2, 10, users, restaurant),
    createReviewsWithRating(1, 10, users, restaurant)
  ]);
}).then((results) => {
  console.log('created test users and reviews');
  process.exit();
});