const makeId = require('./_id')
const parseTerm = require('./parse')
const methods = require('./methods')
const tagMethods = require('./tag')

class Term {
  constructor(text = '') {
    text = String(text)
    let obj = parseTerm(text)
    this.text = obj.text || ''
    this.normal = obj.normal || ''
    this.implicit = obj.implicit || null
    this.pre = obj.pre || ''
    this.post = obj.post || ''
    this.raw = text.trim()
    this.tags = {}
    this.prev = null
    this.next = null
    this.id = makeId(this.normal)
    this.isA = 'Term' // easier than .constructor...
  }
}

/** create a deep-copy of this term */
Term.prototype.clone = function() {
  let term = new Term(this.text)
  term.pre = this.pre
  term.post = this.post
  term.tags = Object.assign({}, term.tags)
  return term
}

Object.assign(Term.prototype, methods)
Object.assign(Term.prototype, tagMethods)

module.exports = Term
