const mongoose = require('mongoose');
mongoose.connect(process.env.DB + 'testreviewservice');
const Models = require('./server/db-models/models.js');

test('seeds test database with mock data using the npm scripts', async () => {
    const reviews = await Models.reviewsModel.count();
    const users = await Models.userModel.count();
    const restaurants = await Models.restaurantModel.count();
    const stats = await Models.statsModel.count();
    const ratings = await Models.ratingsDistModel.count();

    expect(reviews).toBe(50);
    expect(users).toBe(100);
    expect(restaurants).toBe(1);
    expect(stats).toBe(1);
    expect(ratings).toBe(1);    
});

test('review data is valid', async () => {
  const reviews = await Models.reviewsModel.find({});
  const review = reviews[0];

  expect(typeof review.text).toBe('string');
  expect(Array.isArray(review.tags)).toBe(true);
  expect(typeof review.rating.food).toBe('number');
  expect(typeof review.rating.service).toBe('number');
  expect(typeof review.rating.ambience).toBe('number');
  expect(typeof review.rating.value).toBe('number');
  expect(typeof review.wouldRecommendToFriend).toBe('boolean');
  expect(typeof review.location).toBe('string');
  expect(typeof review.helpfulCount).toBe('number');
  expect(review.dinedOn instanceof Date).toBe(true);
  
});

test('user data is valid', async () => {
  const users = await Models.userModel.find({});
  const user = users[0];

  expect(typeof user.name).toBe('string');
  // expect(user.reviews.length).toBe(1);
  expect(typeof user.isVIP).toBe('boolean');
  expect(typeof user.avatar).toBe('string');
});

test('restaurants data is valid', async () => {
  const restaurants = await Models.restaurantModel.find({});
  const restaurant = restaurants[0];

  expect(typeof restaurant.name).toBe('string');
  expect(Array.isArray(restaurant.locations)).toBe(true);
});

test('stats data is valid', async () => {
  const stats = await Models.statsModel.find({});
  const stat = stats[0];

  expect(typeof stat.totalRatingsScore).toBe('number');
  expect(typeof stat.totalRatings).toBe('number');
  expect(typeof stat.averageRating.food).toBe('number');
  expect(typeof stat.averageRating.service).toBe('number');
  expect(typeof stat.averageRating.ambience).toBe('number');
  expect(typeof stat.averageRating.value).toBe('number');
  expect(typeof stat.recommendationPercentage).toBe('number');
  expect(typeof stat.noise).toBe('number');
});

test('ratings distribution data is valid', async () => {
  const dists = await Models.ratingsDistModel.find({});
  const dist = dists[0];

  expect(typeof dist['1']).toBe('number');
  expect(typeof dist['2']).toBe('number');
  expect(typeof dist['3']).toBe('number');
  expect(typeof dist['4']).toBe('number');
  expect(typeof dist['5']).toBe('number');

  await mongoose.disconnect();
});



