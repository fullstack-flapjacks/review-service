const express = require('express');
const app = express();

const reactApp = require('./reactApp.bundle');
const reactDOMServer = require('react-dom/server');

// console.log(reactApp);

app.use(express.static('../public'));

app.get('/home', (req, res) => {
  // console.log('html string', reactDOMServer.renderToString(reactApp.default()));
  res.send(reactDOMServer.renderToString(reactApp.default()));
})

app.listen(3000);