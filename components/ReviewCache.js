// Review page caching

import axios from 'axios';

class PageCache {
  constructor(restaurant, page_length, url_mixin){
    this.restaurant = restaurant;
    this.cache = {};
    this.page_length = page_length;
  }

  generateCacheAddress(page){
    // inclusive, exclusive
    return `(${page*this.page_length},${this.page_length*(page + 1)})`;
  }

  getPage(page){
    if (this.cache[this.generateCacheAddress(page)] !== undefined){
      return this.cache[this.generateCacheAddress(page)];
    } else {
      const get = fetchPage(page);
      get.then((response) => {
        if (response.status === 200){
          return Promise.resolve(response.data);
        } else {
          return Promise.resolve(null);
        }
      }).then((results) => {
        if (results !== null){
          this.cache[this.generateCacheAddress(page)] = results;
        }
      });
    }
  }

  fetchPage(page){
    const paginatedURL = this.url_mixin(`/reviews/${this.restaurant}/${page*this.page_length}/${(page + 1)*this.page_length}`);
    return axios.get(paginatedURL);
  }
}