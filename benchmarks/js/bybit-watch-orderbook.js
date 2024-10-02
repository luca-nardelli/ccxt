import { Bench } from 'tinybench';
import ccxt from '../../js/ccxt.js';
import { performance } from 'perf_hooks';
(async () => {
    const useTinyBench = ['1', 'true', 't'].includes(process.env['USE_TINYBENCH'] ?? '');
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
    let market;
    let loggedWarning = false;
    const client = exchange.client('wss://example.com');
    const initFn = () => {
        market = markets[Math.floor(Math.random() * markets.length)];
        const marketId = market.id;
        msg = {
            topic: `orderbook.1.${marketId}`,
            type: 'delta',
            ts: new Date().getTime(),
            data: {
                s: marketId,
                // [price, qty]
                b: [
                    [Math.random() * 60000, Math.random() * 10],
                ],
                a: [
                    [Math.random() * 60000, Math.random() * 10],
                ],
            }
        };
    };
    const benchFn = () => {
        exchange.handleOrderBook(client, msg);
        const ob = exchange.orderbooks[market.symbol];
        ob.limit();
        // Ensure that we don't have more than 1 depth
        if (!loggedWarning && (ob.asks.length > 1 || ob.bids.length > 1)) {
            loggedWarning = true;
            console.warn('Orderbook depth is too large, expected 1');
        }
    };
    if (useTinyBench) {
        bench.add('handleOrderBook delta limit=1', benchFn, { beforeEach: initFn });
    }
    else {
        const CHUNKS = 100;
        const ITERS = 50000;
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
})();
