const matchMethods = require('./match');
const tagger = require('../tagger');

class Doc {
  constructor(list, from, world) {
    this.list = list;
    //quiet these properties in console.logs
    Object.defineProperty(this, 'from', {
      enumerable: false,
      value: from
    });
    //try this..
    if (world === undefined && from !== undefined) {
      world = from.world;
    }
    //'world' getter
    Object.defineProperty(this, 'world', {
      enumerable: false,
      value: world
    });
    //'found' getter
    Object.defineProperty(this, 'found', {
      get: () => this.list.length > 0
    });
  }

  tagger() {
    return tagger(this);
  }

  //pool is stored on phrase objects
  pool() {
    if (this.list.length > 0) {
      return this.list[0].pool;
    }
    return this.all().list[0].pool;
  }
  //go up one
  parent() {
    if (this.from) {
      return this.from;
    }
    return this;
  }
  //return a list of all parents
  parents() {
    let arr = [];
    const addParent = function(doc) {
      if (doc.from) {
        arr.push(doc.from);
        addParent(doc.from);
      }
    };
    addParent(this);
    return arr.reverse();
  }
  //return first document
  all() {
    return this.parents()[0];
  }
}

Doc = matchMethods(Doc);

const methods = [
  require('./easy'),
  require('./hard'),
  require('./utilities'),
  require('./out')
];
methods.forEach(obj => Object.assign(Doc.prototype, obj));

//fancy match statements
const quick = require('./selections/quick');
Object.keys(quick).forEach((k) => {
  Doc.prototype[k] = function() {
    let matches = quick[k](this);
    return new Doc(matches.list, this, this.world);
  };
});

//ones with subclasses
const selections = require('./selections');
Object.keys(selections).forEach((k) => {
  const Sub = selections[k].subclass(Doc);
  Doc.prototype[k] = function() {
    let matches = selections[k].find(this);
    return new Sub(matches.list, this, this.world);
  };
});

module.exports = Doc;
