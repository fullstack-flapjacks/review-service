import Utilities from './components/Utilities.js';

test('shold round ratings to the nearest 0.1 with fixed length', () => {
  expect(Utilities.roundRating(4.697)).toBe("4.7");
  expect(Utilities.roundRating(3.444)).toBe("3.4");
  expect(Utilities.roundRating(0)).toBe("0.0");
  expect(Utilities.roundRating(5)).toBe("5.0");
});

test('should generate star lists propertly', () => {
  expect(Utilities.generateStars(3.699)).toEqual(["star", "star", "star", "half-star", "grey-star"]);
  expect(Utilities.generateStars(3)).toEqual(["star", "star", "star", "grey-star", "grey-star"]);
  expect(Utilities.generateStars(0)).toEqual(["grey-star", "grey-star", "grey-star", "grey-star", "grey-star"]);
  expect(Utilities.generateStars(5)).toEqual(["star", "star", "star", "star", "star"]);
});

test('should round star ratings to the nearest whole number', () => {
  expect(Utilities.starRating({ food: 4.6555, service: 5, ambience: 4.7, value: 4.9 })).toBe(5);
  expect(Utilities.starRating({ food: 3, service: 3.2, ambience: 3.1, value: 3.3 })).toBe(3);
  expect(Utilities.starRating({ food: 1, service: 1.2, ambience: 1.211, value: 1.11199 })).toBe(1);
  expect(Utilities.starRating({ food: 5, service: 5, ambience: 5, value: 5 })).toBe(5);
  expect(Utilities.starRating({ food: 0, service: 0, ambience: 0, value: 0 })).toBe(0);
});

test('should return correct percentages given ratings', () => {
  expect(Utilities.ratingsPercentages({ 1: 10, 2: 10, 3: 10, 4: 10, 5: 10 }))
    .toEqual({
      1: 20,
      2: 20,
      3: 20,
      4: 20,
      5: 20
    });
});

test('should return correct dropdown text', () => {
  expect(Utilities.dropdownText('newest')).toBe('Newest');
  expect(Utilities.dropdownText('lowest')).toBe('Lowest rating');
  expect(Utilities.dropdownText('highest')).toBe('Highest rating');
});

test('should generate a 3 page window around a given page within the boundaries of the last page', () => {
  expect(Utilities.threePageWindow(3, 6)).toEqual([2, 3, 4]);
  expect(Utilities.threePageWindow(1, 6)).toEqual([1, 2, 3]);
  expect(Utilities.threePageWindow(5, 6)).toEqual([4, 5, 6]);
  expect(Utilities.threePageWindow(6, 6)).toEqual([4, 5, 6]);
  expect(Utilities.threePageWindow(1, 2)).toEqual([1, 2]);
  expect(Utilities.threePageWindow(1, 3)).toEqual([1, 2, 3]);
  expect(Utilities.threePageWindow(2, 3)).toEqual([1, 2, 3]);
});