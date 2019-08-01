const doesMatch = require('./_match')
const out = require('./04-out')
const isAcronym = require('../clean/isAcronym')

// these tags aren't juicy-enough
const boring = {
  TitleCase: true,
  UpperCase: true,
  CamelCase: true,
  Hyphenated: true,
  StartBracket: true,
  EndBracket: true,
  Comma: true,
  ClauseEnd: true,
}

/** check a match object against this term */
exports.doesMatch = function(reg) {
  return doesMatch(this, reg)
}

/** return term meta-data in a given format */
exports.out = function(reg) {
  return out(this, reg)
}

/** does this term look like an acryonym? */
exports.isAcronym = function() {
  return isAcronym(this.text)
}

/** does the term have at least one good tag? */
exports.isKnown = function() {
  return Object.keys(this.tags).some(t => boring[t] !== true)
}
