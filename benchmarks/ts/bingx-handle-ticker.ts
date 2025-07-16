import { Bench } from 'tinybench';
import ccxt, { Market, MarketInterface } from '../../js/ccxt.js';
import { performance } from 'perf_hooks';
import { resolve } from 'path';

(async () => {

  const useTinyBench = ['1', 'true', 't'].includes(process.env['USE_TINYBENCH'] ?? '');
  const bench = new Bench({ time: 3000 });

  const exchange = new ccxt.pro.bingx({
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
      code: 0,
      dataType: `${marketId}@bookTicker`,
      data: {
        "e": "bookTicker",
        "u": 1727471514525,
        "E": 1706498923556,
        "T": 1706498883023,
        "s": "BTC-USDT",
        "b": (Math.random() * 60_000).toString(),  // Best bid price
        "B": (Math.random() * 10).toString(),    // Best bid quantity
        "a": (Math.random() * 60_000).toString(),  // Best ask price
        "A": (Math.random() * 10).toString(),     // Best ask quantity
      }
    }
  }

  const benchFn = () => {
    exchange.handleBookTicker(client, msg);
  }

  if (useTinyBench) {
    bench.add('handleBookTicker', benchFn, { beforeEach: initFn });
  } else {
    const CHUNKS = 100;
    const ITERS = 50_000;
    let durationMs = 0;
    for (let i = 0; i < CHUNKS; i++) {
      const pnow = performance.now();
      for (let c = 0; c < ITERS / CHUNKS; c++) {
        initFn();
        benchFn();
      }
      durationMs += performance.now() - pnow;
      // Sleep a bit to allow event loop to process stuff
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    console.log(`Test ended: ${(ITERS / (durationMs / 1000)).toFixed(2)} ops/sec`);
  }
  // }

  if (useTinyBench) {
    await bench.warmup(); // make results more reliable, ref: https://github.com/tinylibs/tinybench/pull/50
    await bench.run();

    console.table(bench.table());
  }

})()
