var nlp = require('./src/index')
// nlp.verbose(true)
// nlp.extend(require('./plugins/values/src'))

//TODAY: finish tagger:
// then rename values() to numbers()

// var doc = nlp(`#Cool`).debug()
var doc = nlp(`589-3809`).debug()

// const lex = doc.world.lexicon
// console.log(lex.walk)
