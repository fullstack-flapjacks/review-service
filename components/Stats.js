import React, { Component } from 'react';
import Utilities from './Utilities.js';
import Stars from './Stars.js';

const Stats = ({ stats }) => (
  <div className="stats">
    <h1>What {stats.totalRatings} People Are Saying</h1>
    <div className="overall">
      <h3>Overall ratings and reviews</h3>
      <p>Reviews can only be made by diners who have eaten at this restaurant</p>
      <div className="breakdown">
        <span className="rating food">{ Utilities.roundRating(stats.averageRating.food) }</span><br />
        <span className="rating service">{ Utilities.roundRating(stats.averageRating.service) }</span><br />
        <span className="rating ambience">{ Utilities.roundRating(stats.averageRating.ambience) }</span><br />
        <span className="rating value">{ Utilities.roundRating(stats.averageRating.value) }</span>
      </div>
      <Stars stars={Utilities.starRating(stats.averageRating)} /> 
    </div>
  </div>
);

export default Stats;