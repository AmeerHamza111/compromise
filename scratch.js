var nlp = require('./src/index')
nlp.verbose(true)
// nlp.extend(require('./plugins/values/src'))

//TODAY: finish tagger:
// then rename values() to numbers()

let doc = nlp('Asdf  lkjsdf Tëlske').debug()

// console.log(doc.world.lexicon.is)
