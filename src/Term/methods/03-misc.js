const doesMatch = require('./_doesMatch')
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

/** does this term look like an acryonym? */
exports.isAcronym = function() {
  return isAcronym(this.text)
}

/** is this term implied by a contraction? */
exports.isImplicit = function() {
  return this.text === '' && this.implicit
}

/** does the term have at least one good tag? */
exports.isKnown = function() {
  return Object.keys(this.tags).some(t => boring[t] !== true)
}
