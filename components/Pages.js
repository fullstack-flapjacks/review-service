import React, { Component } from 'react';
import * as _ from 'ramda';

const Page = ({ page, currentPage, loadPage }) => {
  const pageClassName = (page === currentPage) ? "page-label bold": "page-label";

  return <div 
    key={page} onClick={loadPage} 
    className={pageClassName}>
      {page}
    </div>;
}

class Pages extends Component {
  constructor(props){
    super(props);
  }

  render(){
    const props = this.props;
    const totalReviews = props.totalReviews;
    const pageLength = props.pageLength;
    const currentPage = props.currentPage;
    const loadPage = props.loadPage;

    const pages = Math.ceil(totalReviews / pageLength);

    return <div className="pages">
      {_.range(1, pages + 1).map((page) => {
        return <Page key={page} page={page} currentPage={currentPage} loadPage={loadPage(page)} />
      })}
    </div>;
  }
}

export default Pages;