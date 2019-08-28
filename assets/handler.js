'use strict';

var fs = require('fs');

var responseContent = fs.readFileSync('index.html', 'utf8');

module.exports.redirect = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html'
    },
    body: responseContent,
  };

  callback(null, response);
};