const mongoose = require('mongoose');
// mongoose.connect(process.env.DB_URI);
const Schema = mongoose.Schema;

var ratingsDistributionSchema = new Schema({
  1: Number,
  2: Number,
  3: Number,
  4: Number,
  5: Number
});

var statsSchema = new Schema({
  totalRatingsScore: Number,
  totalRatings: Number,
  averageRating: {
    food: Number,
    service: Number,
    ambience: Number,
    value: Number
  },
  recommendationPercentage: Number,
  ratingsDistribution: Schema.Types.ObjectId,
  noise: Number,
  restaurant: Schema.Types.ObjectId,
  // filterWords: Array
});

var reviewsSchema = new Schema({
  user: Schema.Types.ObjectId,
  text: String,
  tags: Array,
  rating: {
    food: Number,
    service: Number,
    ambience: Number,
    value: Number
  },
  wouldRecommendToFriend: Boolean,
  restaurant: Schema.Types.ObjectId,
  location: String,
  helpfulCount: Number,
  dinedOn: Date
});

var userSchema = new Schema({
  name: String,
  // reviews: Array,
  isVIP: Boolean,
  avatar: String
});

var restaurantSchema = new Schema({
  name: String,
  locations: Array
});

module.exports = {
  ratingsDistributionSchema: ratingsDistributionSchema,
  statsSchema: statsSchema,
  reviewsSchema: reviewsSchema,
  userSchema: userSchema,
  restaurantSchema: restaurantSchema
};