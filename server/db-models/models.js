const mongoose = require('mongoose');
// mongoose.connect(process.env.DB_URI);
const Schemas = require('./schemas.js');

// console.log(Schemas);
const ratingsDistModel = mongoose.model('RatingsDist', Schemas.ratingsDistributionSchema);
const statsModel = mongoose.model('ReviewStats', Schemas.statsSchema);
const reviewsModel = mongoose.model('Review', Schemas.reviewsSchema);
const userModel = mongoose.model('User', Schemas.userSchema);
const restaurantModel = mongoose.model('Restaurant', Schemas.restaurantSchema);

module.exports = {
  ratingsDistModel: ratingsDistModel,
  statsModel: statsModel,
  reviewsModel: reviewsModel,
  userModel: userModel,
  restaurantModel: restaurantModel
};