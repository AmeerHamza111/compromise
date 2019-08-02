var nlp = require('./src/index')
// nlp.verbose(true)
// nlp.extend(require('./plugins/verbs/src'))

// let doc = nlp(`i am so, much better and faster`)

// doc.match('(rich|!@hasComma)').debug()

let doc = nlp(`Didn't he?`)

// console.log(doc.json({ terms: { text: true, clean: true } })[0])
doc.debug()
// doc.contractions().expand()

// console.log(JSON.stringify(doc.json(), null, 2))
// doc.normalize({ contractions: true })

console.log('|' + doc.text() + '|')

/* 
 'text' -
 'normal' - case, whitespace, unicode
 'clean' - += (non-sentence) punctuation
 'simple' - += contractions
 'reduced' - += no adverbs, emoji, parentheses, quotations
 'root' - += infinitive verbs, singular nouns
*/

// console.log(
//   doc.text({
//     case: true,
//     whitespace: true,
//     unicode: true,
//   })
// )

// doc.debug()
// console.log(doc.conjugations())

//----------
// console.time('one')
// let doc = nlp('hello world')
// console.log(doc.has('#Klkj'))
// console.timeEnd('one')

// console.time('two')
// let doc2 = nlp('i am the very model of a modern major seven general. I am animal vegetable and mineral.')
// console.timeEnd('two')

// console.time('three')
// let doc3 = nlp('one and spensdfcer and two three fosdfur five. tewo and spenssdfcer and fiffve and six')
// console.timeEnd('three')

// const corpus = require('./stress/node_modules/nlp-corpus')
// let txt = corpus.sotu.array()[8]
// console.time('sotu')
// let main = nlp(txt)
// console.timeEnd('sotu')
// -----

// nlp('drink Salty Dogs').debug()

// console.log(doc.world.lexicon['was'])
// console.log(doc.world.hasCompound['pulled'])
// -----
