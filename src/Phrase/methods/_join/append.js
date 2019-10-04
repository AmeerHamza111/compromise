//add whitespace to the start of the second bit
const addWhitespace = function(beforeTerms, newTerms) {
  // add any existing pre-whitespace to beginning
  newTerms[0].pre = beforeTerms[0].pre
  let lastTerm = beforeTerms[beforeTerms.length - 1]

  //add any existing punctuation to end of our new terms
  let newTerm = newTerms[newTerms.length - 1]
  newTerm.post = lastTerm.post
  // remove existing punctuation
  lastTerm.post = ''

  //before ←[space]  - after
  if (lastTerm.post === '') {
    lastTerm.post += ' '
  }
}

//insert this segment into the linked-list
const stitchIn = function(main, newPhrase) {
  // console.log(main.text(), newPhrase.text())
  let afterId = main.lastTerm().next
  //connect ours in (main → newPhrase)
  main.lastTerm().next = newPhrase.start
  //stich the end in  (newPhrase → after)
  newPhrase.lastTerm().next = afterId
  //do it backwards, too
  if (afterId) {
    // newPhrase ← after
    let afterTerm = main.pool.get(afterId)
    afterTerm.prev = newPhrase.lastTerm().id
  }
  // before ← newPhrase
  let beforeId = main.terms(0).id
  if (beforeId) {
    let newTerm = newPhrase.terms(0)
    newTerm.prev = beforeId
  }
  // main.length += newPhrase.length
}

const unique = function(list) {
  return list.filter((o, i) => {
    return list.indexOf(o) === i
  })
}

//append one phrase onto another
const appendPhrase = function(main, newPhrase, doc) {
  let beforeTerms = main.terms()
  //spruce-up the whitespace issues
  addWhitespace(beforeTerms, newPhrase.terms())
  //insert this segment into the linked-list
  stitchIn(main, newPhrase)

  // stretch!
  // make each effected phrase longer
  let toStretch = [main]
  let hasId = main.start
  let docs = [doc]
  docs = docs.concat(doc.parents()) // find them all!
  docs.forEach(parent => {
    // only the phrases that should change
    let shouldChange = parent.list.filter(p => {
      return p.hasId(hasId)
    })
    toStretch = toStretch.concat(shouldChange)
  })
  // don't double-count a phrase
  toStretch = unique(toStretch)
  toStretch.forEach(p => {
    p.length += newPhrase.length
  })
  return main
}
module.exports = appendPhrase
