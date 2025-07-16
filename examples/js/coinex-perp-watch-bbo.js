import ccxt from '../../js/ccxt.js';
// AUTO-TRANSPILE //
async function example() {
    const ex = new ccxt.pro.coinex({
        'defaultType': 'swap',
    });
    let statsBySymbol = {};
    const symbols = ['1INCH/USDT', 'AAVE/USDT', 'ADA/USDT', 'FLOKI/USDT', 'DOGE/USDT', 'DEGEN/USDT'];
    async function loop(symbol) {
        console.log(`Starting ${symbol}`);
        while (true) {
            const bbo = await ex.watchBbo(symbol);
            // console.log (bbo);
            const s = statsBySymbol[symbol] ?? { 'count': 0 };
            s.count++;
            statsBySymbol[symbol] = s;
        }
    }
    setInterval(() => {
        console.log(statsBySymbol);
        statsBySymbol = {};
    }, 10000);
    await Promise.all(symbols.map(loop));
}
await example();
