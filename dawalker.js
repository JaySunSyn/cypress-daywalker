const DaywalkerStoreQuery = require('./daywalker-store-query');
class Daywalker extends DaywalkerStoreQuery {
  constructor(w = window) {
    const store = w.Daywalker.store;
    super(store, w);
  }
}

module.exports = Daywalker;
