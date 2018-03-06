import React, { Component } from 'react';
import moment from 'moment';
import * as _ from 'ramda';
import axios from 'axios';
import Utilities from './Utilities.js';
import Stars from './Stars.js';
import { SortDropdown, FilterCheckbox, FilterCheckboxes } from './FiltersAndSorting.js';
import Pages from './Pages.js';
import Stats from './Stats.js';
import ReviewCache from './ReviewCache.js';

const Cache = new ReviewCache();

const Summary = ({ user, review, rating }) => (
  <div className="review-summary">
    <div className="photo-summary">
      <img className="avatar" src={user.avatar} />
      <div className="user-stub">
        <div className="username">{ user.name } ({ review.location })</div>
        <Stars stars={rating} />
        <span className="dinedOn">Dined { moment(review.dinedOn).fromNow() }</span>
      </div>
    </div>
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

const Footer = ({ readMore, showReadMore }) => {
  const readMoreButton = (showReadMore) ? <a onClick={readMore}>- Read More</a>: <a onClick={readMore}>+ Read More</a>;

  return <div className="review-footer">
    <div className="read-more">{readMoreButton}</div>
    <div className="actions">
      <i className="flag"></i>
      <span className="report-text">Report</span>
      <i className="helpful"></i> 
      <span className="helpful-text">Helpful</span>
    </div>    

  </div>
};

const SearchSnippets = ({ getSnippet, searchWords }) => {
  const snippets = _.map(getSnippet, searchWords);
  const htmlSnippet = (snippet) => {
    return { __html: snippet };
  }

  return <div className="review-body">
    {snippets.map((snippet, idx) => {
      if (snippet !== null){
        console.log('Using this snippet', idx, htmlSnippet(snippet));
        return <div key={idx} className="snippet" dangerouslySetInnerHTML={htmlSnippet(snippet)}></div>;
      } else {
        return undefined;
      }
    })}
  </div>
}

class Review extends Component {
  constructor(props){
    super(props);
    this.onReadMore = this.onReadMore.bind(this);

    this.state = {
      readMore: false
    };

    this.getSearchSnippet = this.getSearchSnippet.bind(this);
  }

  onReadMore(event){
    this.setState({ readMore: !this.state.readMore });
  }

  getSearchSnippet(word){
    const review = this.props.model;
    const text = review.text;

    const found = text.toLowerCase().indexOf(word);

    if (found !== -1){
      let frontSnippet = text.slice(Math.max(0, found - 75), found);
      let backSnippet  = text.slice(Math.min(found + word.length, text.length));
      var frontEllipse = '&hellip;';
      var backEllipse  = '&hellip;';
      let Word = text.slice(found, found + word.length);

      if (Math.max(0, found - 75) === 0){
        frontEllipse = ''; 
      }

      if (Math.min(found + word.length, text.length) === text.length){
        backEllipse = '';
      }

      return frontEllipse + frontSnippet + '<span class="search-bold">' + Word + '</span>' + backSnippet + backEllipse;

    } else {
      return null;
    }
  }

  render(){
    const review = this.props.model;
    const user = this.props.model.user;
    const searchWords = this.props.searchWords;

    return <div className="review">
      <Summary 
        rating={Utilities.starRating(review.rating)} 
        review={review} 
        user={user} />
        {(searchWords.length > 0) ? 
          <SearchSnippets getSnippet={this.getSearchSnippet} searchWords={searchWords} /> : 
          <Body readMore={this.state.readMore} text={review.text} /> }
      
      <Footer readMore={this.onReadMore} showReadMore={this.state.readMore} />
    </div>    
  }
};

class Reviews extends Component {
  constructor(props){
    super(props);

    this.state = {
      sortByValue: 'newest',
      filters: {},
      filterWords: [],
      reviews: [],
      stats: {},
      page: 1,
      pageLength: 10,
      totalReviews: 0,
      mouseTracker: {},
      pollers: {}
    };

    this.onSortByChange = this.onSortByChange.bind(this);
    this.onFilterCheck = this.onFilterCheck.bind(this);
    this.generateGetURL = this.generateGetURL.bind(this);
    this.makeSearchString = this.makeSearchString.bind(this);
    this.loadPage = this.loadPage.bind(this);
    this.getAndUpdateReviews = this.getAndUpdateReviews.bind(this);
    this.mousein = this.mousein.bind(this);
    this.mouseout = this.mouseout.bind(this);
    this.pollMouseHover = this.pollMouseHover.bind(this);
    this.randomWord = this.randomWord.bind(this);
  }

  randomWord(string){
    const splitString = string.split(" ");
    const rawWord = splitString[Math.round(Math.random()*(splitString.length - 1))];
    return rawWord.replace(',', '').replace('.', '');
  }

  componentDidMount(){
    if (!this.props.test){
      const getStats = axios('/summary');

      getStats.then((response) => {;
        const stats   = response.data.json.stats;
        const totalReviews = response.data.json.totalReviews;

        this.setState({ stats: stats, rid: stats.restaurant, totalReviews: totalReviews });

        Cache.setOptions(stats.restaurant, this.state.pageLength, totalReviews, 1);
        Cache.prefetchInit().then((res) => {
          const ok = res.ok;
          const first = res.results[0].reviews[0];
          // console.log(res);
          const filterWords = _.uniq(_.range(0, 5).map(() => {
            return this.randomWord(first.text);
          }));

          this.setState({ filterWords: filterWords });
          // console.log('Prefetched initial pages', ok);
          this.getAndUpdateReviews(this.generateGetURL());
        });
      });
    }
  }

  loadPage(page){
    if (!this.props.test){
      return (event) => {
        const currentPage = page;
        const sortBy = this.state.sortByValue;
        const url = this.generateGetURL(sortBy, this.state.filters, currentPage);

        Cache.fetch(url).then((json) => {
          const reviews = json.reviews;
          const first = reviews[0];

          this.setState({ reviews: reviews, page: currentPage });          
        });

        Cache.prefetchSortPages(currentPage).then((_) => {
          console.log('Prefetch pages');
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

      Cache.fetch(url).then((json) => {
        const reviews = json.reviews;
        const totalReviews = json.totalReviews;
        this.setState({ reviews: reviews, totalReviews: totalReviews });
      });     
    }
  }

  onSortByChange(name){
    return () => {
      const sortBy = name;
      this.setState({ sortByValue: sortBy, page: 1 }, () => {
        this.getAndUpdateReviews(this.generateGetURL(sortBy, this.state.filters));
      });
    }
  }

  onFilterCheck(name){
    return (event) => {
      const updatedFilters = {
        ...this.state.filters,
        [name]: !this.state.filters[name]
      };

      this.setState({
        filters: updatedFilters
      }, () => {
        const sortBy = this.state.sortByValue;
        this.getAndUpdateReviews(this.generateGetURL(sortBy, updatedFilters));        
      });
    }
  }

  pollMouseHover(id, page, filterWord){
    const address = `${id}-${page}`;
    setTimeout(() => {
        console.log('setTimeout called');
        if (this.state.mouseTracker[address] === true){
          if (filterWord){
            var filters = {...this.state.filters, [filterWord]: true };
          } else {
            var filters = {...this.state.filters};
          }

          Cache.prefetchSortPages(page - 1, filters).then((res) => {
            console.log("Prefetching...", page, res);
          });
        }
      } , 200);
  }


  mousein(id, page, filterWord = false){
    return (event) => {
      const address = `${id}-${page}`;

      if (this.state.mouseTracker[address] === undefined){
        var mouseTrackerClone = _.clone(this.state.mouseTracker);
        mouseTrackerClone[address] = true;
        this.setState({
          mouseTracker: mouseTrackerClone
        });
        this.pollMouseHover(id, page, filterWord);
      }
    }
  }

  mouseout(id, page){
    return (event) => {
      const address = `${id}-${page}`;

      if (this.state.mouseTracker[address] === true){
        var mouseTrackerClone = _.clone(this.state.mouseTracker);
        mouseTrackerClone[address] = undefined;
        this.setState({
          mouseTracker: mouseTrackerClone
        });
      }
    }
  }

  render(){
    const stats   = this.state.stats;
    const reviews = this.state.reviews;
    const stars   = (stats.averageRating !== undefined) ? Utilities.starRating(stats.averageRating): 0;
    const activeFilters = (filters) => {
      const activeFilters = _.filter((filter) => {
        return filter === true;
      }, filters);

      const filterWords = Object.keys(activeFilters);

      return filterWords;
    } 


    return <div id="reviews" className="reviews">
      {(stats.averageRating) ? <Stats stats={stats} />: undefined }
      <div className="sorting-filters">
        <h2>Sort By</h2>
        <div className="dropdown-container">
          <SortDropdown value={this.state.sortByValue} handleChange={this.onSortByChange} />
        </div>
        <h2>Filters</h2>
        <div className="filter-container">
          <FilterCheckboxes 
            onCheck={this.onFilterCheck} 
            words={this.state.filterWords} 
            checks={this.state.filters}
            mousein={this.mousein}
            mouseout={this.mouseout} />
        </div>
      </div>
      <div className="individual-reviews">
        {(reviews) ? reviews.map((review, idx) => {
          console.log('searchWords', Object.keys(this.state.filters));
          return <Review key={idx} model={review} searchWords={activeFilters(this.state.filters)} />;
        }): undefined}
      </div>
      <div className="reviews-footer">
        <Pages 
          totalReviews={this.state.totalReviews} 
          pageLength={this.state.pageLength} 
          loadPage={this.loadPage} 
          currentPage={this.state.page}
          mousein={this.mousein}
          mouseout={this.mouseout} />
      </div> 
    </div>;
  }
}

export default Reviews;