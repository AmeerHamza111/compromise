var nlp = require('./src/index')
// var nlp = require('/Users/spencer/Desktop/compromise/src/index.js')
const corpus = require('nlp-corpus')
// nlp.verbose(true)
// nlp.extend(require('./plugins/verbs/src'))
// nlp.extend(require('./plugins/entities/src'))
// let arr = corpus.sotu.array().slice(0, 1)
let arr = corpus.sotu.array().slice(0, 10)

// console.time('parse')
// arr.forEach(txt => {
//   let doc = nlp(txt)
// })
// console.timeEnd('parse')

let doc = nlp('i am standing on my two feet')
  .match('feet$')
  .debug()
//   .match('(in toronto|nope nope)')
//   .debug()
// doc.match('(hello|foo|dog) #Person').debug()
// doc.debug()

// let obj = {}
// process.tagged.forEach(tag => {
//   obj[tag] = obj[tag] || 0
//   obj[tag] += 1
// })
// let arr = Object.keys(obj)
//   .map(k => [k, obj[k]])
//   .sort((a, b) => {
//     if (a[1] > b[1]) {
//       return -1
//     }
//     return 1
//   })
// // console.log(JSON.stringify(arr, null, 2))
// arr.forEach(a => {
//   console.log(a[0] + ' \t ' + a[1])
// })
