const doesMatch = require('./_doesMatch')
const isAcronym = require('../normalize/isAcronym')

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

/** cache the root property of the term */
exports.setRoot = function(world) {
  let transform = world.transforms
  let str = this.implicit || this.clean
  if (this.tags.Plural) {
    str = transform.toSingular(str)
  }
  if (this.tags.Verb && !this.tags.Negative && !this.tags.Infinitive) {
    let tense = null
    if (this.tags.PastTense) {
      tense = 'PastTense'
    } else if (this.tags.Gerund) {
      tense = 'Gerund'
    } else if (this.tags.PresentTense) {
      tense = 'PresentTense'
    } else if (this.tags.Participle) {
      tense = 'Participle'
    } else if (this.tags.Actor) {
      tense = 'Actor'
    }
    str = transform.toInfinitive(str, world, tense)
  }
  this.root = str
}
