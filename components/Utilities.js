const roundRating = (rating) => (Math.round(rating*10)/10).toFixed(1);
const generateStars = (stars) => {
  var nearestHalfStar = Math.round(stars*2) / 2;
  var remainingStars = 5 - nearestHalfStar;

  var starTypes = [];

  while (nearestHalfStar > 0){
    if (nearestHalfStar - 1 < 0){
      starTypes.push('half-star');
    } else {
      starTypes.push('star');
    }

    nearestHalfStar -= 1; 
  }

  while (remainingStars > 0){
    if (remainingStars - 1 < 0){
      remainingStars = 0;
      continue;
    } else {
      starTypes.push('grey-star');
    }

    remainingStars -= 1;
  }

  return starTypes;
};
const starRating = (rating) => {
  return Math.round((rating.food + rating.service + rating.ambience + rating.value) / 4);
};

const Utilities = {
  roundRating: roundRating,
  generateStars: generateStars,
  starRating: starRating
};

export default Utilities;