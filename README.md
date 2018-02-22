# Review Service and Component

[![CircleCI](https://circleci.com/gh/fullstack-flapjacks/review-service/tree/master.svg?style=svg)](https://circleci.com/gh/fullstack-flapjacks/review-service/tree/master)

> Displays and paginates reviews.

## Related Projects

  - https://github.com/fullstack-flapjacks/Menu-Module
  - https://github.com/fullstack-flapjacks/suggested-restaurants
  - https://github.com/fullstack-flapjacks/reservations
  - https://github.com/fullstack-flapjacks/About_Map_Info-module

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)

## Usage


### Running the Server

`npm run start` will start the node server on 4004.

### Integration

This serves the component without CSS or surrounding HTML.

```html
<script src="localhost:4004/component"></script>
```

This will serve a full page with some styles.

```html
<script src="localhost:4004/page"></script>
```

## Requirements

An `nvmrc` file is included if using [nvm](https://github.com/creationix/nvm).

- Node 9.5.0

```json
{
  "name": "Review-Service",
  "version": "0.0.1",
  "description": "The review service and component for Fullstack Flapjack's OpenTable restaurant page clone.",
  "author": "Josh Southern",
  "license": "NA",
  "engines": {
    "node": "9.5.0"
  },
  "scripts": {
    "lint": "./node_modules/.bin/eslint",
    "test": "./node_modules/.bin/jest",
    "build": "./node_modules/.bin/webpack --config ./webpack.config.js --context ./client && ./node_modules/.bin/webpack --config ./server/webpack.config.js --context ./server",
    "start": "./node_modules/.bin/node ./server/server.js"
  },
  "dependencies": {
    "babel-core": "^6.26.0",
    "crossroads": "^0.12.2",
    "express": "^4.16.2",
    "faker": "^4.1.0",
    "hasher": "^1.2.0",
    "mongodb": "^3.0.2",
    "node": "^9.5.0",
    "prop-types": "^15.6.0",
    "react": "^16.2.0",
    "react-dom": "^16.2.0",
    "webpack": "^3.11.0"
  },
  "devDependencies": {
    "babel-loader": "^7.1.2",
    "babel-preset-env": "^1.6.1",
    "babel-preset-react": "^6.24.1",
    "css-loader": "^0.28.9",
    "eslint": "^4.18.1",
    "eslint-config-airbnb": "^16.1.0",
    "eslint-config-hackreactor": "git://github.com/reactorcore/eslint-config-hackreactor",
    "eslint-plugin-import": "^2.8.0",
    "eslint-plugin-jsx-a11y": "^6.0.3",
    "eslint-plugin-react": "^7.7.0",
    "extract-text-webpack-plugin": "^3.0.2",
    "jest": "^22.4.0",
    "node-sass": "^4.7.2",
    "puppeteer": "^1.1.0",
    "sass-loader": "^6.0.6",
    "style-loader": "^0.20.2",
    "webpack-node-externals": "^1.6.0"
  }
}
```

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install
```

### Building

`npm run build` will run webpack on the cient and server side.
