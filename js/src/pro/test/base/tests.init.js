import testWsOrderBook from "./test.OrderBook.js";
import testWsCache from "./test.Cache.js";
function testBaseWs() {
    testWsOrderBook();
    testWsCache();
    // todo : testWsClose ();
}
export default testBaseWs;
