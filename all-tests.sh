#!/bin/bash
./node_modules/.bin/node ./server/db-models/test-seed.js
npm run stats_test
./node_modules/.bin/jest --ci --testResultsProcessor='jest-junit'
npm run clear_test
