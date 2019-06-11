const matchAll = require('./match');
const notMatch = require('./match/not');

class Phrase {
  constructor(id, length, pool) {
    this.start = id;
    this.length = length;
    Object.defineProperty(this, 'pool', {
      enumerable: false,
      writable: true,
      value: pool,
    });
  }
  terms(n) {
    let terms = [this.pool.get(this.start)];
    if (this.length === 0) {
      return [];
    }
    for (let i = 0; i < this.length - 1; i += 1) {
      let id = terms[terms.length - 1].next;
      if (id === null) {
        console.warn('linked-list broken');
        break;
      }
      let term = this.pool.get(id);
      terms.push(term);
    }
    if (n !== undefined) {
      return terms[n];
    }
    return terms;
  }
  lastTerm() {
    let terms = this.terms();
    return terms[terms.length - 1];
  }
  hasId(id) {
    let terms = this.terms();
    return terms.find(t => t.id === id) !== undefined;
  }
  out(options = {}) {
    let terms = this.terms();
    return terms.reduce((str, t, i) => {
      options.last = i === terms.length - 1;
      return str + t.out(options);
    }, '');
  }
  json(options = {}) {
    let out = {};
    out.text = this.text();
    out.normal = this.normal();
    if (options.terms !== false) {
      out.terms = this.terms().map(t => t.json(options));
    }
    return out;
  }
}
//  ¯\_(:/)_/¯
Phrase.prototype.clone = function() {
  //how do we clone part of the pool?
  let terms = this.terms();
  let newTerms = terms.map(t => t.clone());
  //connect these new ids up
  newTerms.forEach((t, i) => {
    //add it to the pool..
    this.pool.add(t);
    if (newTerms[i + 1]) {
      t.next = newTerms[i + 1].id;
    }
    if (newTerms[i - 1]) {
      t.prev = newTerms[i - 1].id;
    }
  });
  return new Phrase(newTerms[0].id, newTerms.length, this.pool);
};

Phrase.prototype.buildFrom = function(terms) {
  return new Phrase(terms[0].id, terms.length, this.pool);
};

Phrase.prototype.match = function(str) {
  let matches = matchAll(this, str);
  //make them phrase objects
  matches = matches.map(list => {
    return new Phrase(list[0].id, list.length, this.pool);
  });
  return matches;
};
Phrase.prototype.not = function(str) {
  let matches = notMatch(this, str);
  //make them phrase objects
  matches = matches.map(list => {
    return new Phrase(list[0].id, list.length, this.pool);
  });
  return matches;
};
//turn this phrase into 3
Phrase.prototype.splitOn = function(p) {
  let terms = this.terms();
  let result = [];
  let index = terms.findIndex(t => t.id === p.start);
  if (index === -1) {
    return result;
  }
  let start = terms.slice(0, index);
  let match = terms.slice(index, index + p.length);
  let end = terms.slice(index + p.length, terms.length);
  //make all three sections into phrase-objects
  if (start.length > 0) {
    result.push(new Phrase(start[0].id, start.length, this.pool));
  }
  if (match.length > 0) {
    result.push(new Phrase(match[0].id, match.length, this.pool));
  }
  if (end.length > 0) {
    result.push(new Phrase(end[0].id, end.length, this.pool));
  }
  return result;
};

const methods = [require('./hard')];
methods.forEach(obj => Object.assign(Phrase.prototype, obj));

const aliases = {
  term: 'terms',
};
Object.keys(aliases).forEach(k => (Phrase.prototype[k] = Phrase.prototype[aliases[k]]));

module.exports = Phrase;
