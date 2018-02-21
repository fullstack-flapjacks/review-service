import React from 'react';
import PropTypes from 'prop-types';
import Reviews from './components/Reviews';

const Page = props => (
  <html lang="en">
    <head>
      <title>{props.title}</title>
      <link rel="stylesheet" href="./css/main.css" />
    </head>
    <body>
      <Reviews />
    </body>
  </html>
);

Page.propTypes = {
  title: PropTypes.string,
};

Page.defaultProps = {
  title: 'My App',
};

export default Page;
