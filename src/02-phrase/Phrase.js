const methods = require('./methods')
const matchMethods = require('./match')

class Phrase {
  constructor(id, length, pool) {
    this.start = id
    this.length = length
    Object.defineProperty(this, 'pool', {
      enumerable: false,
      writable: true,
      value: pool,
    })
  }
}

/** create a new Phrase object from an id and length */
Phrase.prototype.buildFrom = function(id, length) {
  return new Phrase(id, length, this.pool)
}

//apply methods
Object.assign(Phrase.prototype, matchMethods)
Object.assign(Phrase.prototype, methods)

//apply aliases
const aliases = {
  term: 'terms',
}
Object.keys(aliases).forEach(k => (Phrase.prototype[k] = Phrase.prototype[aliases[k]]))

module.exports = Phrase
