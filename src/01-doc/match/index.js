const parseSyntax = require('./syntax');

// all the real match logic is in ./phrase/match
// here, we simply parse the expression
const matchAll = function(doc, reg) {
  //parse-up the input expression
  let regs = parseSyntax(reg);
  //try expression on each phrase
  let matches = doc.list.reduce((arr, p) => {
    return arr.concat(p.match(regs));
  }, []);
  console.log(matches);
  return matches;
};

const matchMethods = function(Doc) {
  const methods = {
    //return a new Doc, with us as a parent
    match : function(reg) {
      let matches = matchAll(this, reg);
      return new Doc(matches, this, this.world);
    },
    matchOne: function(reg) {
      let regs = parseSyntax(reg);
      let found = doc.list.find((p) => p.match(regs).length > 0);
      return new Doc([found], this, this.world);
    },
    split : function(reg) {
      let regs = parseSyntax(reg);
      let matches = [];
      this.list.forEach((p) => {
        let found = p.match(regs);
        //no match, keep it going
        if (found.length === 0) {
          matches.push(p);
        }
        //support multiple-matches per phrase
        let list = p.splitOn(found[0]);
        matches = matches.concat(list);
      });
      return new Doc(matches, this, this.world);
    },
    has : function(reg) {
      let regs = parseSyntax(reg);
      let found = this.list.find((p) => p.match(regs).length > 0);
      return found !== undefined;
    }
  };
  //aliases
  methods.splitOn = methods.split;
  Object.keys(methods).forEach((k) => {
    Doc.prototype[k] = methods[k];
  });
  return Doc;
};

module.exports = matchMethods;
