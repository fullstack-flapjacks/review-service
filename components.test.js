// React
import React from 'react';

// Enzyme
import { mount } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

// My code
import Reviews from './components/Reviews.js';
import request from 'supertest';
import { app } from './server/server.js';

test('uses supertest', async () => {
  const response = await request(app).get('/summary');
  expect(response.statusCode).toBe(200);
});

test('updates reviews with newest reviews', async () => {
  const response = await request(app).get('/newest/5a9455fc03a13c457820e762/1/25/').set('Accept', 'application/json');
  expect(response.statusCode).toBe(200);

  const reviews = response.body.json.reviews;
  const totalReviews = response.body.json.totalReviews;
  const wrapper = mount(<Reviews test />);
  wrapper.setState({ reviews: reviews, totalReviews: totalReviews });
  expect(totalReviews).toBe(50);
  const children = wrapper.find('.individual-reviews').children();
  expect(children.length).toBe(25);
});

test('updates reviews with highest rated reviews', async () => {
  const response = await request(app).get('/highest/5a9455fc03a13c457820e762/1/25/').set('Accept', 'application/json');
  expect(response.statusCode).toBe(200);

  const reviews = response.body.json.reviews;
  const totalReviews = response.body.json.totalReviews;
  const wrapper = mount(<Reviews test />);
  wrapper.setState({ reviews: reviews, totalReviews: totalReviews });
  expect(totalReviews).toBe(50);
  expect(reviews[0].averageRating).toBe(5);
  const children = wrapper.find('.individual-reviews').children();
  const firstChild = wrapper.find('.star-rating').first();
  // console.log(firstChild);
  expect(children.length).toBe(25);
  expect(firstChild.children().length).toBe(5);
});

// it('updates reviews with highest rated reviews', () => {
//   axios('http://localhost:4004/newest/5a9455fc03a13c457820e762/1/25/')
//     .then((response) => {
//     })
//     .catch((err) => {
//       throw err;
//     });
// });

// it('updates reviews with lowest rated reviews', () => {
//   axios('http://localhost:4004/newest/5a9455fc03a13c457820e762/1/25/')
//     .then((response) => {
//     })
//     .catch((err) => {
//       throw err;
//     });
// });