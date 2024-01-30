### Nasdaq Stock Api
___
*   **GET**  

    with form data containing a Nasdaq _stock_ ticker e.g.

    `/api/stock-prices?stock=goog` returns `{"stockData":{"stock":"GOOG","price":"1081.22","likes":0}}`

*   Pass along field _like_ as **true** to have your like added to the stock(s). Only 1 like per ip should be accepted.
 `/api/stock-prices?stock=goog&like=true`
 returns
 `{"stockData":{"stock":"GOOG","price":"1081.22","likes":1}}`

*   Pass along more then 1 stock, the return will be an array with both stock's info but instead of _likes_, it will display _rel_likes_(the difference between the likes on both) on both.
 `/api/stock-prices?stock=goog&stock=msft` returns `{"stockData":[{"stock":"GOOG","price":"1081.22","rel_likes":0},{"stock":"MSFT","price":"106.16","rel_likes":0}]}`

### Example usage:

`/api/stock-prices?stock=goog`  
`/api/stock-prices?stock=goog&like=true`  
`/api/stock-prices?stock=goog&stock=msft`  
`/api/stock-prices?stock=goog&stock=msft&like=true`  

### Example return:

`{"stockData":{"stock":"GOOG","price":"1081.22","likes":1}}`  
`{"stockData":[{"stock":"GOOG","price":"1081.22","rel_likes":0},{"stock":"MSFT","price":"106.16","rel_likes":0}]}`

* * *
For more information visit: [_https://nasdaq-stock-api.glitch.me/_](https://nasdaq-stock-api.glitch.me/)