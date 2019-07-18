const hasPerfect = /[a-z\u00C0-\u00FF]'d$/

/** split `i'd` into 'i had', or 'i would' */
const checkPerfect = function(term, phrase) {
  if (hasPerfect.test(term.normal)) {
    let root = term.normal.replace(/'d$/, '')
    //look at the next few words
    let terms = phrase.terms()
    let index = terms.indexOf(term)
    let after = terms.slice(index + 1, index + 4)
    //is it before a past-tense verb? - 'i'd walked'
    for (let i = 0; i < after.length; i++) {
      let t = after[i]
      if (t.tags.Verb) {
        if (t.tags.PastTense) {
          return [root, 'had']
        }
        return [root, 'would']
      }
    }
    //otherwise, 'i'd walk'
    return [root, 'would']
  }
  return null
}
module.exports = checkPerfect
