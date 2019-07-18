const hasPrefix = /^(re|un)-?[a-z\u00C0-\u00FF]/
const prefix = /^(re|un)-?/

/** check 'rewatch' in lexicon as 'watch' */
const checkPrefix = function(terms, world) {
  let lex = world.lexicon
  terms.forEach(term => {
    // skip if we have a good tag already
    if (term.isKnown() === true) {
      return
    }
    //does it start with 'un|re'
    if (hasPrefix.test(term.normal) === true) {
      // look for the root word in the lexicon:
      let stem = term.normal.replace(prefix, '')
      if (lex[stem] !== undefined && lex.hasOwnProperty(stem) === true) {
        term.tag(lex[stem], 'stem-' + stem, world)
      }
    }
  })
}
module.exports = checkPrefix
