var nlp = require('./src/index')
// const corpus = require('nlp-corpus')
// nlp.verbose(true)
nlp.extend(require('./plugins/nouns/src'))
nlp.extend(require('./plugins/sentences/src'))

// let arr = corpus.sotu.array().slice(0, 10)
// console.time('parse')
// arr.forEach(txt => nlp(txt) })
// console.timeEnd('parse')

// let doc = nlp('ignore me. at the end')
// doc.match('end').replaceWith('some more words')
// doc.debug()

let doc = nlp('at the end time')
let m = doc.match('end')
m.forEach(p => {
  p.replaceWith('more words here')
})
// m.debug() //m is broken
doc.debug() // doc is not

// var doc = nlp('He is cool.')
// doc.forEach(d => {
//   d.prepend('so')
// })
// console.log(doc.out())
// console.log(doc.list[0])
