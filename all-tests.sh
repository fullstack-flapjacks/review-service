#!/bin/bash
npm run seed_test
npm run stats_test
./node_modules/.bin/jest --ci --testResultsProcessor='jest-junit'
npm run clear_test
