var nlp = require('./src/index')
// nlp.verbose(true)
// nlp.extend(require('./plugins/verbs/src'))
// nlp.extend(require('./plugins/entities/src'))

// let doc = nlp('june and today cool')
// doc.match('(#Place .{2,3})').debug()
// let doc = nlp('toronto and montreal and Sydney and Paris.')
// doc.cache()
// doc.match('#Person').debug()
// doc.match('(toronto and | foobar joe | and paris)').debug()

// var r = nlp('lkjsdf lkjsdf')
// r.tag('#Foo')
// r.match('#Foo').debug()
let doc = nlp('the shit keeps piling up')
doc.match('the #Noun').debug()

// r.match('^.').tag('#Date')
// r.cache()
// r.debug()
// r.match(`#Date+ [#Cardinal]`).debug()
// r.match(`(summer|winter|spring) (in|of)? #Cardinal`).debug()

// r.match('two three')
//   .tag('#Two #Three #Four')
//   .debug()

// t.equal(r.match('#Two').out('normal'), 'two', 'two-is-two')
