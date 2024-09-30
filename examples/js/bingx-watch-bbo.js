import ccxt from '../../js/ccxt.js';
// AUTO-TRANSPILE //
async function example() {
    const ex = new ccxt.pro.bingx({options: {
        defaultType: 'swap',
    }});
    const symbols = ['BTC/USDT:USDT'];
    async function loop(symbol) {
        console.log(`Starting ${symbol}`);
        while (true) {
            const bbo = await ex.watchBbo(symbol);
            console.log(bbo);
        }
    }
    await Promise.all(symbols.map(loop));
}
await example();
