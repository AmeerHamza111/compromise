const hasPlural = require('./plural/hasPlural')
const getArticle = require('./getArticle')
const isPlural = require('./plural/isPlural')
const toPossessive = require('./toPossessive')
const parse = require('./parse')

const methods = {
  /** overload the original json with noun information */
  json: function(options) {
    options = options || { text: true, normal: true, trim: true, terms: true }
    let res = []
    this.forEach(doc => {
      let json = doc.json(options)[0]
      json.article = getArticle(doc)
      res.push(json)
    })
    return res
  },

  isPlural: function() {
    return this.if('#Plural') //assume tagger has run?
  },
  hasPlural: function() {
    return this.filter(d => hasPlural(d))
  },
  toPlural: function() {
    let toPlural = this.world.transforms.toPlural
    this.forEach(doc => {
      if (doc.has('#Plural') || hasPlural(doc) === false) {
        return
      }
      // double-check it isn't an un-tagged plural
      let main = parse(doc).main
      let str = main.text()
      if (!main.has('#Singular') && isPlural(str) === true) {
        return
      }
      str = toPlural(str, this.world)
      main.replace(str).tag('#Plural')
    })
    return this
  },
  toSingular: function() {
    let toSingular = this.world.transforms.toSingular
    this.forEach(doc => {
      if (doc.has('#Singular') || hasPlural(doc) === false) {
        return
      }
      // double-check it isn't an un-tagged plural
      let main = parse(doc).main
      let str = main.text()
      if (!main.has('#Plural') && isPlural(str) !== true) {
        return
      }
      str = toSingular(str, this.world)
      main.replace(str).tag('#Singular')
    })
    return this
  },
  toPossessive: function() {
    this.forEach(d => {
      toPossessive(d)
    })
    return this
  },
}
module.exports = methods
