import { Bench } from 'tinybench';
import ccxt, { MarketInterface } from '../../js/ccxt.js';

(async () => {

  const bench = new Bench({ time: 3000 });

  const exchange = new ccxt.pro.bybit({
    enableRateLimit: false,
    options: {
      defaultType: 'swap',
    },
  });

  await exchange.loadMarkets();
  const markets = Object.values(exchange.markets).filter(m => m.type === 'swap' && m.quote === 'USDT');
  const marketIds = markets.map(market => market.id).slice(0, 300);


  // {
  let msg = {};
  let market!: MarketInterface;
  let loggedWarning = false;
  const client = exchange.client('wss://example.com');

  const initFn = () => {
    market = markets[Math.floor(Math.random() * markets.length)];
    const marketId = market.id;
    msg = {
      "topic": `tickers.${marketId}`,
      "type": "snapshot",
      "data": {
        "symbol": `${marketId}`,
        "tickDirection": "PlusTick",
        "price24hPcnt": "0.017103",
        "lastPrice": "17216.00",
        "prevPrice24h": "16926.50",
        "highPrice24h": "17281.50",
        "lowPrice24h": "16915.00",
        "prevPrice1h": "17238.00",
        "markPrice": "17217.33",
        "indexPrice": "17227.36",
        "openInterest": "68744.761",
        "openInterestValue": "1183601235.91",
        "turnover24h": "1570383121.943499",
        "volume24h": "91705.276",
        "nextFundingTime": "1673280000000",
        "fundingRate": "-0.000212",
        "bid1Price": "17215.50",
        "bid1Size": "84.489",
        "ask1Price": "17216.00",
        "ask1Size": "83.020"
      },
      "cs": 24987956059,
      "ts": 1673272861686
    }
  }

  const initFnDelta = () => {
    market = markets[Math.floor(Math.random() * markets.length)];
    const marketId = market.id;
    msg = {
      "topic": `tickers.${marketId}`,
      "type": "delta",
      "data": {
        "symbol": `${marketId}`,
        "bid1Price": "17215.50",
        "bid1Size": "84.489",
        "ask1Price": "17216.00",
        "ask1Size": "83.020"
      },
      "cs": 24987956059,
      "ts": 1673272861686
    }
  }

  const benchFn = () => {
    exchange.handleTicker(client, msg);
  }

  bench.add('handleTicker snapshot', benchFn, { beforeEach: initFn });
  bench.add('handleTicker delta', benchFn, { beforeEach: initFnDelta });

  await bench.warmup(); // make results more reliable, ref: https://github.com/tinylibs/tinybench/pull/50
  await bench.run();

  console.table(bench.table());

})()
