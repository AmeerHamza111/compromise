var nlp = require('./src/index')
nlp.verbose(true)
// nlp.extend(require('./plugins/numbers/src'))

let doc = nlp('china pulled out of ').debug()

// nlp('i will walk')
//   .verbs()
//   .toPastTense()
//   .debug()

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

// console.log(doc.world.lexicon['eats'])
console.log(doc.world.hasCompound['pulled'])
// -----
