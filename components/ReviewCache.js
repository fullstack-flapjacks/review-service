import axios from 'axios';
import * as _ from 'ramda';
import { preloadImages } from './CacheUtil.js';
import config from './config.client.js';
const ROOT_PATH = config.TEST.HOST + ':' + config.TEST.PORT;

// Specific Review Cache Manager

class ReviewCache {
  constructor(worker){
    this.worker = worker;
    this.promises = {};

    this.worker.addEventListener('message', (event) => {
      const e = event.data;
      const data = e.data;
      const url = e.url;
      const resolve = this.promises[url][0];
      // this.promises[url] = undefined; // clear promise after fulfillment
      resolve(data);
    });
  }

  makeSearchString(filters){
    const activeFilters = _.filter((filter) => {
      return filter === true;
    }, filters);

    const filterWords = Object.keys(activeFilters);

    if (!filterWords || filterWords.length === 0){ return ""; }
    return filterWords.join(',');
  }

  generateGetURL(rid, sortBy, page, pageLength, filters = {}){
    const words = this.makeSearchString(filters);
    const url = ROOT_PATH + `/${sortBy}/${rid}/${page}/${pageLength}/${words}`;

    return url;
  }

  prefetchSortPages(rid, page, pageLength, filters = {}){
    const newestURL = this.generateGetURL(rid, 'newest', page, pageLength, filters);
    const lowestURL = this.generateGetURL(rid, 'lowest', page, pageLength, filters);
    const highestURL = this.generateGetURL(rid, 'highest', page, pageLength, filters);

    Promise.all([
      this.fetch(newestURL),
      this.fetch(lowestURL),
      this.fetch(highestURL)
    ]).then((_) => {
      console.log('Finished prefetching');
    });
  }

  registerPromise(url, resolve, reject){
    this.promises[url] = [resolve, reject];
  }

  wait(url){
    return new Promise((resolve, reject) => {
      this.registerPromise(url, resolve, reject);
    });
  }

  fetch(url){
    this.worker.postMessage({ action: 'fetch', url: url });
    return this.wait(url).then((data) => {
      const cached = data.cached;
      const json = data.json;
      const reviews = json.reviews;
      if (cached === false){
        const images = _.map((review) => review.user.avatar, reviews);
        preloadImages(images);
      }

      return Promise.resolve(data.json);
    });
  }
}

// class ReviewCache {
//   constructor(rid = 0, pageLength = 25, totalReviews = 0, currentPage = 1){
//     this.rid = rid;
//     this.cache = {};
//     this.pageLength = pageLength;
//     this.currentPage = currentPage;
//     this.lastPage = Math.ceil(totalReviews / pageLength);
//     this.sortBy = ['newest', 'highest', 'lowest'];
//   }

//   prefetchInit(){
//     return this.prefetchSortPages(0).then((res) => {
//       if (res.results[0].reviews.length === this.pageLength){
//         return this.prefetchSortPages(1);
//       } else {
//         return Promise.resolve({ ok: true, results: res.results });
//       }
//     });
//   }

//   setOptions(rid = 0, pageLength = 25, totalReviews = 0, currentPage = 1){
//     this.rid = rid;
//     this.pageLength = pageLength;
//     this.currentPage = currentPage;
//     this.lastPage = Math.ceil(totalReviews / pageLength);    
//   }

//   makeSearchString(filters){
//     const activeFilters = _.filter((filter) => {
//       return filter === true;
//     }, filters);

//     const filterWords = Object.keys(activeFilters);

//     if (!filterWords || filterWords.length === 0){ return ""; }
//     return filterWords.join(',');
//   }

//   generateGetURL(sortBy = 'newest', filters = {}, page = 1){
//     const words = this.makeSearchString(filters);
//     const url = `/${sortBy}/${this.rid}/${page}/${this.pageLength}/${words}`;

//     return url;
//   }

//   prefetchSortPages(page, filters = {}){
//     if (page + 1 <= this.lastPage && this.cache[this.generateGetURL('newest', filters, page + 1)] === undefined){

//       const getNextNewest  = this.add(this.generateGetURL('newest', filters, page + 1));
//       const getNextHighest = this.add(this.generateGetURL('highest', filters, page + 1));
//       const getNextLowest  = this.add(this.generateGetURL('lowest', filters, page + 1));

//       return Promise.all([getNextLowest, getNextHighest, getNextNewest]).then((results) => {
//         console.log('Done prefetching sort pages');
//         return Promise.resolve({ ok: true, results: results });
//       }).catch((err) => {
//         console.log('Could not prefetch page.', err);
//       });
//     } else {
//       return Promise.resolve(false);
//     }
//   }

//   preloadImages(json){
//     _.forEach((review) => {
//       this.preloadImage(review.user.avatar);
//     }, json.reviews)
//   }

//   preloadImage(url){
//     let image = new Image();
//     image.src = url; // like magic
//   }

//   add(url){
//     if (this.cache[url] === undefined){
//       const getReviews = axios.get(url);
//       return getReviews.then((response) => {
//         const data = response.data;

//         if (data.status === 'ok'){
//           this.cache[url] = data.json;
//           this.preloadImages(data.json);
//           return Promise.resolve(this.cache[url]);
//         } else {
//           throw { error: 'bad_request' };
//         }
//       }).catch((err) => {
//         console.log("Couldn't fetch URL:", url);
//       });
//     } else {
//       return Promise.resolve(this.cache[url]);
//     }
//   }

//   fetch(url){
//     return this.add(url);
//   }
// }

export default ReviewCache;