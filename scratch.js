var nlp = require('./src/index')
// nlp.verbose(true);

//TODO:
// selections:
//     copy+paste more of them
// tagger:
//    neighbour-fallback
//    more inference
//
// --expose-subclass prototypes

var str = 'so spencer and the Kevin the end'
// var str = 'the FBI';
var doc = nlp(str)
doc.splitBefore('#Person').debug()

// doc.splitAfter('spencer').debug();
// doc.splitBefore('spencer').debug();
// doc.clauses().debug();

// let doc = nlp('and seven years ago')
// console.log(doc.text())
