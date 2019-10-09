const test = require('tape')
const nlp = require('./_lib')

test('tokenize() runs without pos-tagging', function(t) {
  const str = 'Miss Hoover, I glued my head to my shoulder.'
  const r = nlp.tokenize(str)
  t.equal(r.out('text'), str, 'tokenize output is same')

  t.equal(r.list.length, 1, 'sentence-parser-working')

  const found = r.match('#Noun').found
  t.equal(found, false, 'no sneaky-tagging')

  t.end()
})

test('em-dash, en-dash', function(t) {
  // '-':  //dash
  // '–':  //en-dash
  // '—':  //em-dash
  let doc = nlp('fun-time')
  t.equal(doc.terms().length, 2, 'dash')
  doc = nlp('fun–time')
  t.equal(doc.terms().length, 2, 'en-dash')
  doc = nlp('fun—time')
  t.equal(doc.terms().length, 2, 'em-dash')

  //not a full word, either
  doc = nlp('fun - time')
  t.equal(doc.terms().length, 2, 'dash-word')
  doc = nlp('fun – time')
  t.equal(doc.terms().length, 2, 'en-dash-word')
  doc = nlp('fun — time')
  t.equal(doc.terms().length, 2, 'em-dash-word')

  //numeric forms are split, but contractions too
  doc = nlp('20-20')
  t.equal(doc.terms().length, 3, 'dash-num')
  doc = nlp('20–20')
  t.equal(doc.terms().length, 3, 'en-dash-num')
  doc = nlp('20—20')
  t.equal(doc.terms().length, 3, 'em-dash-num')
  t.end()
})
