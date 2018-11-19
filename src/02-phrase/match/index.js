const failFast = require('./01-failFast');
const tryMatch = require('./02-tryMatch');
const syntax = require('../../01-doc/match/syntax');


//returns a simple array of arrays
const matchAll = function(p, regs) {
  //if we forgot to parse it..
  if (typeof regs === 'string') {
    regs = syntax(regs);
  }
  let terms = p.terms();
  //try to dismiss it, at-once
  if (failFast(terms, regs) === true) {
    return [];
  }
  //any match needs to be this long, at least
  const minLength = regs.filter((r) => r.optional !== true).length;
  let matches = [];

  //optimisation for '^' start logic
  if (regs[0].start === true) {
    let match = tryMatch(terms, regs);
    if (match !== false && match.length > 0) {
      matches.push(match);
    }
    return matches;
  }
  //try starting, from every term
  for(let i = 0; i < terms.length; i += 1) {
    // slice may be too short
    if (i + minLength > terms.length) {
      break;
    }
    //try it!
    // console.log('- #' + i);
    let match = tryMatch(terms.slice(i), regs);
    if (match !== false && match.length > 0) {
      matches.push(match);
      i += match.length - 1; //zoom forward
    }
  }
  return matches;
};
module.exports = matchAll;
