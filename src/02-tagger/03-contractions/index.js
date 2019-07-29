const checkNegative = require('./01-negative')
const checkApostrophe = require('./02-simple')
const checkIrregulars = require('./03-irregulars')
const checkPossessive = require('./04-possessive')
const checkPerfect = require('./05-perfectTense')
const build = require('../../01-tokenizer')
const checkLexicon = require('../01-init/01-lexicon')

const createPhrase = function(found, doc) {
  //create phrase from ['would', 'not']
  let phrase = build.fromText(found.join(' '), doc.pool())[0]
  //tag it
  let terms = phrase.terms()
  checkLexicon(terms, doc.world)
  //make these terms implicit
  terms.forEach((t, i) => {
    t.implicit = t.text
    t.text = ''
    // remove whitespace for implicit terms
    if (i > 0) {
      t.preText = ''
    }
  })
  return phrase
}

const contractions = function(doc) {
  let world = doc.world
  doc.list.forEach(p => {
    let terms = p.terms()
    for (let i = 0; i < terms.length; i += 1) {
      let term = terms[i]
      let found = checkNegative(term)
      found = found || checkApostrophe(term)
      found = found || checkIrregulars(term, p)
      found = found || checkPossessive(term, p, world)
      found = found || checkPerfect(term, p)
      //add them in
      if (found !== null) {
        let newPhrase = createPhrase(found, doc)
        //set text as contraction
        newPhrase.terms(0).text = term.text
        //grab sub-phrase to remove
        let match = p.buildFrom(term.id, 1, doc.pool())
        match.replace(newPhrase, doc)
      }
    }
  })
  return doc
}
module.exports = contractions
