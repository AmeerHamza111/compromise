var nlp = require('./src/index');
// nlp.verbose('tagger');

// var doc = nlp('in north africa, eastern asia, guatemala, europe, north america, and japan');
// doc.places().debug();

let doc = nlp('foo bar');
let rel = doc.match('asdf');
doc.delete(rel);
//:boom:
