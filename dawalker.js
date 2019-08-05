const DaywalkerStoreQuery = require('./daywalker-store-query');
class Daywalker extends DaywalkerStoreQuery {
  constructor(w = window) {
    if (w.Daywalker == null) {
      console.error('Daywalker script was not found! Did you include it in your entrypoint?');
      console.log('See: https://github.com/JaySunSyn/cypress-daywalker#3-add-the-daywalker-script');
    }
    const store = w.Daywalker.store;
    super(store, w);
  }
}

module.exports = Daywalker;
