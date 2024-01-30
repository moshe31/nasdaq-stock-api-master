const MongoClient = require('mongodb');
const apiURL = 'https://api.iextrading.com/1.0/stock/';
const https = require('https');

const CONNECTION_STRING = process.env.DB;
var arr = [];

function getPrices(stocks, done) {
    for (let i = 0; i < stocks.length; i++) {
        https.get(apiURL + stocks[i] + '/price', (resp) => {
            let stockPrice = '';
            resp.on('data', (chunks) => { stockPrice += chunks });
            resp.on('end', () => {
                if (stockPrice == 'Unknown symbol') {
                    return done(stockPrice, null);
                } else {
                    return done(null, { stock: stocks[i], price: stockPrice });
                }
            });
        }).on('error', (err) => {
            return done(err, null)
        });
    }
}

function handleDB(stockItem, like, ip, done) {
    MongoClient.connect(CONNECTION_STRING, (err, db) => {
        if (like) {
            db.collection('stocks').findOne({ stock: stockItem.stock }, (err, data) => {
                //if no doc exits
                if (data == null) {
                    db.collection('stocks').insertOne({ stock: stockItem.stock, ip: [ip] }, (err, data) => {
                        return done(null, {
                            stock: stockItem.stock.toUpperCase(),
                            price: stockItem.price,
                            likes: 1
                        });
                    })
                } else if (data.ip.includes(ip) !== true) {

                    db.collection('stocks').findAndModify({ stock: stockItem.stock }, {},
                        { $push: { ip: ip } },
                        { new: true }, (err, data) => {
                            if (err) return done('could not get the stock', null);
                            return done(null, {
                                stock: stockItem.stock.toUpperCase(),
                                price: stockItem.price,
                                likes: data.value.ip.length
                            });
                        })
                } else {
                    return done(null, {
                        stock: stockItem.stock.toUpperCase(),
                        price: stockItem.price,
                        likes: data.ip.length
                    });
                }

            })

        } else {
            db.collection('stocks').findAndModify({ stock: stockItem.stock }, {},
                { $setOnInsert: { stock: stockItem.stock, ip: [] } },
                { new: true, upsert: true }, (err, data) => {
                    if (err) return done('could not get the stock', null);
                    return done(null, {
                        stock: stockItem.stock.toUpperCase(),
                        price: stockItem.price,
                        likes: data.value.ip.length
                    });
                })
        }
    })
}
function handleRes(data, multi, length, done) {
    if (multi) {
        arr.push(data);
        if (arr.length === length) {
            const newArr = arr.map((x) => {
                return {
                    stock: x.stock,
                    price: x.price,
                    rel_likes: x.likes - arr.reduce((y, z) => { return y + z.likes }, 0) + x.likes
                }
            })
            arr = [];
            return done(null, newArr);
        }
    } else {
        return done(null, data);
    }
}

function handleSingleStock(req, res) {
    getPrices([req.query.stock], (err, data) => {
        if (err) return res.send(err);
        //handle DB
        if (data) handleDB(data, req.query.like, req.ip, (err, DBdata) => {
            if (err) return res.send(err);
            //handle res
            if (DBdata) handleRes(DBdata, multi = false, req.query.stock.length, (err, resData) => {
                if (err) return res.send(err);
                return res.json({
                    stockData: resData
                });
            });
        });
    })
}

function handleMultiStock(req, res) {
    getPrices(req.query.stock, (err, data) => {
        if (err) return res.send(err);
        //handle DB
        if (data) handleDB(data, req.query.like, req.ip, (err, DBdata) => {
            if (err) return res.send(err);
            //handle res
            if (DBdata) handleRes(DBdata, multi = true, req.query.stock.length, (err, resData) => {
                if (err) return res.send(err);
                return res.json({
                    stockData: resData
                });
            });
        });
    })
}
module.exports = function (req, res) {
    if (Array.isArray(req.query.stock)) {
        handleMultiStock(req, res);
    } else {
        handleSingleStock(req, res);
    }
}