import axios from 'axios';
import * as _ from 'ramda';

class ReviewCache {
  constructor(rid = 0, pageLength = 25, totalReviews = 0, currentPage = 1){
    this.rid = rid;
    this.cache = {};
    this.pageLength = pageLength;
    this.currentPage = currentPage;
    this.lastPage = Math.ceil(totalReviews / pageLength);
    this.sortBy = ['newest', 'highest', 'lowest'];
  }

  prefetchInit(){
    return this.prefetchSortPages(0).then((res) => {
      if (res.results[0].reviews.length === this.pageLength){
        return this.prefetchSortPages(1);
      } else {
        return Promise.resolve({ ok: true, results: results });
      }
    });
  }

  setOptions(rid = 0, pageLength = 25, totalReviews = 0, currentPage = 1){
    this.rid = rid;
    this.pageLength = pageLength;
    this.currentPage = currentPage;
    this.lastPage = Math.ceil(totalReviews / pageLength);    
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
    const url = `/${sortBy}/${this.rid}/${page}/${this.pageLength}/${words}`;

    return url;
  }

  prefetchSortPages(page, filters = {}){
    if (page + 1 <= this.lastPage && this.cache[this.generateGetURL('newest', filters, page + 1)] === undefined){

      const getNextNewest  = this.add(this.generateGetURL('newest', filters, page + 1));
      const getNextHighest = this.add(this.generateGetURL('highest', filters, page + 1));
      const getNextLowest  = this.add(this.generateGetURL('lowest', filters, page + 1));

      return Promise.all([getNextLowest, getNextHighest, getNextNewest]).then((results) => {
        console.log('Done prefetching sort pages');
        return Promise.resolve({ ok: true, results: results });
      }).catch((err) => {
        console.log('Could not prefetch page.', err);
      });
    } else {
      return Promise.resolve(false);
    }
  }

  preloadImages(json){
    _.forEach((review) => {
      this.preloadImage(review.user.avatar);
    }, json.reviews)
  }

  preloadImage(url){
    let image = new Image();
    image.src = url; // like magic
  }

  add(url){
    if (this.cache[url] === undefined){
      const getReviews = axios.get(url);
      return getReviews.then((response) => {
        const data = response.data;

        if (data.status === 'ok'){
          this.cache[url] = data.json;
          this.preloadImages(data.json);
          return Promise.resolve(this.cache[url]);
        } else {
          throw { error: 'bad_request' };
        }
      }).catch((err) => {
        console.log("Couldn't fetch URL:", url);
      });
    } else {
      return Promise.resolve(this.cache[url]);
    }
  }

  fetch(url){
    return this.add(url);
  }
}

export default ReviewCache;