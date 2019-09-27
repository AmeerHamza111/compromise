const failFast = require('./02-failFast')
const tryMatch = require('./03-tryMatch')
const syntax = require('../../Doc/methods/match/syntax')

/**  returns a simple array of arrays */
const matchAll = function(p, regs, matchOne = false) {
  //if we forgot to parse it..
  if (typeof regs === 'string') {
    regs = syntax(regs)
  }

  let terms = p.terms()
  //try to dismiss it, at-once
  if (failFast(p, terms, regs) === true) {
    return []
  }
  //any match needs to be this long, at least
  const minLength = regs.filter(r => r.optional !== true).length
  let matches = []

  //optimisation for '^' start logic
  if (regs[0].start === true) {
    let match = tryMatch(terms, regs)
    if (match !== false && match.length > 0) {
      matches.push(match)
    }
    return matches
  }
  //try starting, from every term
  for (let i = 0; i < terms.length; i += 1) {
    // slice may be too short
    if (i + minLength > terms.length) {
      break
    }
    //try it!
    let match = tryMatch(terms.slice(i), regs)
    if (match !== false && match.length > 0) {
      //zoom forward!
      i += match.length - 1
      //[capture-groups] return some null responses
      match = match.filter(m => m)
      matches.push(match)
      //ok, maybe that's enough?
      if (matchOne === true) {
        return matches
      }
    }
  }
  return matches
}
module.exports = matchAll
