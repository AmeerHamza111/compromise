var nlp = require('./src/index')
// nlp.verbose(true)
// nlp.extend(require('./plugins/values/src'))

// ---Contraction--
// match.insertAt(match, str)
// phrase.insertAt(index, str)
var m = nlp(`she wouldn't go to the store`).debug()

// nlp(`she would have like to go`)
//   .insertAfter(`would`, 'not')
//   .debug()
