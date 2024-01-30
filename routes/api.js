/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const stockHandler = require('../controller/stockHandler');

module.exports = function (app) {
  
  app.route('/api/stock-prices')
    .get(function (req, res){
        stockHandler(req, res);
    });
    
};
