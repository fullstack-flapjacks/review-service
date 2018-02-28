import React, { Component } from 'react';
import moment from 'moment';
import * as _ from 'ramda';
import axios from 'axios';
import Utilities from './Utilities.js';
import Stars from './Stars.js';
import { SortDropdown, FilterCheckbox, FilterCheckboxes } from './FiltersAndSorting.js';
import Pages from './Pages.js';
import Stats from './Stats.js';

const Summary = ({ user, review, rating }) => (
  <div className="review-summary">
    <div className="star-rating">
    {_.range(0, rating).map((_, idx) => {
      return <div key={idx} className="star"></div>;
    })}
    </div>
    <div className="dinedOn">{ moment(review.dinedOn).fromNow() }</div>
    <div className="username">{ user.name } ({ review.location })</div>
  </div>
);

const Body = ({ readMore, text }) => {
  if (readMore === true){
    return <div className="review-body">{ text }</div>;
  } else {
    const limitedText = text.slice(0, 128) + '...';
    return <div className="review-body">{ limitedText }</div>;
  }
}

const Footer = props => (
  <div className="review-footer">
    <a>+ Read More</a>
  </div>
);

class Review extends Component {
  constructor(props){
    super(props);
    this.onReadMore = this.onReadMore.bind(this);

    this.state = {
      readMore: false
    };
  }

  onReadMore(event){
    this.setState({ readMore: !this.state.readMore });
  }

  render(){
    const review = this.props.model;
    const user = this.props.model.user;

    return <div className="review">
      <Summary 
        rating={Utilities.starRating(review.rating)} 
        review={review} 
        user={user} />
      <Body readMore={this.state.readMore} text={review.text} />
      <Footer readMore={this.state.readMore} />
      <div onClick={this.onReadMore}>Click me to test</div>
    </div>    
  }
};

class Reviews extends Component {
  constructor(props){
    super(props);

    this.state = {
      sortByValue: 'newest',
      filters: {},
      filterWords: ['quo', 'fugiat', 'officia'],
      reviews: [],
      stats: {},
      page: 1,
      pageLength: 25,
      totalReviews: 0
    };

    this.onSortByChange = this.onSortByChange.bind(this);
    this.onFilterCheck = this.onFilterCheck.bind(this);
    this.generateGetURL = this.generateGetURL.bind(this);
    this.makeSearchString = this.makeSearchString.bind(this);
    this.loadPage = this.loadPage.bind(this);
    this.getAndUpdateReviews = this.getAndUpdateReviews.bind(this);
  }

  componentDidMount(){
    if (!this.props.test){
      const getStats = axios('/summary');

      getStats.then((response) => {;
        const stats   = response.data.json.stats;
        const totalReviews = response.data.json.totalReviews;

        this.setState({ stats: stats, rid: stats.restaurant, totalReviews: totalReviews }, 
          () => {
            this.getAndUpdateReviews(this.generateGetURL())
          });
      });
    }
  }

  loadPage(page){
    if (!this.props.test){
      return (event) => {
        const currentPage = page;
        const sortBy = this.state.sortByValue;
        const getPage = axios(this.generateGetURL(sortBy, this.state.filters, currentPage));
        getPage.then((response) => {
          const reviews = response.data.json.reviews;

          this.setState({ reviews: reviews, page: currentPage });
        });        
      }      
    }
  }

  makeSearchString(filters){
    const activeFilters = _.filter((filter) => {
      return filter === true;
    }, filters);

    const filterWords = Object.keys(activeFilters);

    if (!filterWords || filterWords.length === 0){ return ""; }
    return filterWords.join(',');
  }

  generateGetURL(sortBy = 'newest', filters = {}, page = 1){
    const words = this.makeSearchString(filters);
    const url = `/${sortBy}/${this.state.rid}/${page}/${this.state.pageLength}/${words}`;

    return url;
  }

  getAndUpdateReviews(url){
    if (!this.props.test){
      const getReviews = axios(url);
      getReviews.then((response) => {
        const reviews = response.data.json.reviews;
        const totalReviews = response.data.json.totalReviews;
        this.setState({ reviews: reviews, totalReviews: totalReviews });
      });      
    }
  }

  onSortByChange(event){
    const sortBy = event.target.value;
    this.setState({ sortByValue: sortBy });

    this.getAndUpdateReviews(this.generateGetURL(sortBy, this.state.filters));
  }

  onFilterCheck(event){
    const target = event.target;
    const name = target.name;
    const value = (target.type === 'checkbox') ? target.checked: target.value;

    const updatedFilters = {
      ...this.state.filters,
      [name]: value
    };

    this.setState({
      filters: updatedFilters
    });

    const sortBy = this.state.sortByValue;
    this.getAndUpdateReviews(this.generateGetURL(sortBy, updatedFilters));
  }

  render(){
    const stats   = this.state.stats;
    const reviews = this.state.reviews;
    const stars   = (stats.averageRating !== undefined) ? Utilities.starRating(stats.averageRating): 0; 


    return <div id="reviews" className="reviews">
      {(stats.averageRating) ? <Stats stats={stats} />: undefined }
      <div className="sorting-filters">
        <h2>Sort By</h2>
        <SortDropdown value={this.state.sortByValue} handleChange={this.onSortByChange} />
        <h2>Filters</h2>
        <FilterCheckboxes onCheck={this.onFilterCheck} words={this.state.filterWords} checks={this.state.filters} />
      </div>
      <div className="individual-reviews">
        {(reviews) ? reviews.map((review, idx) => {
          return <Review key={idx} model={review} />;
        }): undefined}
      </div>
      <div className="reviews-footer">
        <Pages 
          totalReviews={this.state.totalReviews} 
          pageLength={this.state.pageLength} 
          loadPage={this.loadPage} 
          currentPage={this.state.currentPage} />
      </div> 
    </div>;
  }
}

export default Reviews;