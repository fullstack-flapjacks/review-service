import React, { Component } from 'react';
import moment from 'moment';
import * as _ from 'ramda';
import axios from 'axios';


const Summary = (props) => (
  <div className="review-summary">

    <div className="star-rating">
    {_.range(0, props.rating).map((_, idx) => {
      return <div key={idx} className="star"></div>;
    })}
    </div>
    <div className="dinedOn">{ moment(props.review.dinedOn).fromNow() }</div>

    <div className="username">{ props.user.name } ({ props.review.location })</div>
  </div>
)

class Pages extends Component {
  constructor(props){
    super(props);
  }

  render(){
    const props = this.props;
    const totalReviews = props.totalReviews;
    const page_length = props.pageLength;

    const pages = Math.ceil(totalReviews / page_length);

    return <div className="pages">
      {_.range(1, pages + 1).map((page) => {
        return <div key={page} onClick={this.props.loadPage(page)} className={(page === props.currentPage) ? "page-label bold": "page-label"}>{page}</div>;
      })}
    </div>;
  }
}

const Body = props => <div className="review-body">{ props.text }</div>
const Footer = props => (
  <div className="review-footer">
    <a>+ Read More</a>
  </div>
);

class Review extends Component {
  constructor(props){
    super(props);
    this.starRating = this.starRating.bind(this);
    this.onReadMore = this.onReadMore.bind(this);

    this.state = {
      readMore: false
    };
  }

  onReadMore(event){
    console.log(event);
    this.setState({ readMore: !this.state.readMore });
  }

  starRating(rating){
    return Math.round((rating.food + rating.service + rating.ambience + rating.value) / 4);
  }

  render(){
    const review = this.props.model;
    const user = this.props.model.user;

    return <div className="review">
      <Summary 
        rating={this.starRating(review.rating)} 
        review={review} 
        user={user} />
      <Body readMore={this.state.readMore} text={review.text} />
      <Footer readMore={this.state.readMore} />
      <div onClick={this.onReadMore}>Click me to test</div>
    </div>    
  }
};

const roundRating = (rating) => (Math.round(rating*10)/10).toFixed(1);

const SortDropdown = ({ value, handleChange }) => (
  <select value={value} onChange={handleChange}>
    <option value="newest">Newest</option>
    <option value="highest">Highest Rated</option>
    <option value="lowest">Lowest Rated</option>
  </select>
);

const FilterCheckbox = ({ word, onCheck, checked }) => (
  <div className="filter">
    <label>{word}</label>
    <input type="checkbox" name={word} checked={checked} onChange={onCheck} />
  </div>
);

const FilterCheckboxes = ({ words, onCheck, checks }) => (
  <div className="filters">
    {words.map((word, idx) => <FilterCheckbox key={idx} word={word} onCheck={onCheck} checked={checks[word]} />)}
  </div>
);

class Reviews extends Component {
  constructor(props){
    super(props);

    this.state = {
      sortByValue: 'newest',
      filters: {},
      filterWords: ['quo', 'fugiat', 'officia'],
      reviews: [],
      stats: {},
      page: 1, // default page
      page_length: 25,
      totalReviews: 0 // default length
    };

    this.onSortByChange = this.onSortByChange.bind(this);
    this.onFilterCheck = this.onFilterCheck.bind(this);
    this.generateGetURL = this.generateGetURL.bind(this);
    this.makeSearchString = this.makeSearchString.bind(this);
    this.loadPage = this.loadPage.bind(this);
  }

  componentDidMount(){
    const get = axios('/home');
    get.then((response) => {
      const reviews = response.data.json.reviews;
      const stats   = response.data.json.stats;
      const totalReviews = response.data.json.totalReviews;

      this.setState({ reviews: reviews, stats: stats, rid: stats.restaurant, totalReviews: totalReviews });
    });
  }

  loadPage(page){
    return (event) => {
      const currentPage = page;
      this.setState({ page: currentPage }, () => {
        const sortBy = this.state.sortByValue;
        const getPage = axios(this.generateGetURL(sortBy, this.state.filters, this.state.page));
        getPage.then((response) => {
          const reviews = response.data.json.reviews;

          this.setState({ reviews: reviews });
        });        
      });
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

  generateGetURL(sortBy, filters, page = 1){
    const words = this.makeSearchString(filters);
    const url = `/${sortBy}/${this.state.rid}/${page}/${this.state.page_length}/${words}`;

    return url;
  }

  onSortByChange(event){
    const sortBy = event.target.value;
    this.setState({ sortByValue: event.target.sortBy });

    const getReviews = axios(this.generateGetURL(sortBy, this.state.filters));
    getReviews.then((response) => {
      const reviews = response.data.json.reviews;
      const totalReviews = response.data.json.totalReviews;
      this.setState({ reviews: reviews, totalReviews: totalReviews });
    });
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
    const getReviews = axios(this.generateGetURL(sortBy, updatedFilters));
    getReviews.then((response) => {
      const reviews = response.data.json.reviews;
      const totalReviews = response.data.json.totalReviews;
      this.setState({ reviews: reviews, totalReviews: totalReviews, page: 1 });
    });
  }

  render(){
    const stats   = this.state.stats;
    const reviews = this.state.reviews;

    return <div id="reviews" className="reviews">
    {(stats.averageRating) ? <div className="stats">
        <h1>What {stats.totalRatings} People Are Saying</h1>
        <div>
          <h3>Overall ratings and reviews</h3>
          <p>Reviews can only be made by diners who have eaten at this restaurant</p>
          <div className="breakdown">
            <span className="rating food">{ roundRating(stats.averageRating.food) }</span><br />
            <span className="rating service">{ roundRating(stats.averageRating.service) }</span><br />
            <span className="rating ambience">{ roundRating(stats.averageRating.ambience) }</span><br />
            <span className="rating value">{ roundRating(stats.averageRating.value) }</span>
          </div> 
        </div>
      </div>: undefined }
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
        <Pages totalReviews={this.state.totalReviews} pageLength={this.state.page_length} loadPage={this.loadPage} />
      </div> 
    </div>;
  }
}

export default Reviews;