const test = require('tape')
const nlp = require('./_lib')

// do an elaborate comparison between json objects
const isEqual = function(a, b, t) {
  let jsonA = a.json()
  let jsonB = b.json()
  t.equal(a.length, b.length, 'same length')
  t.equal(a.text(), b.text(), 'same text')
  jsonA.forEach((o, i) => {
    t.equal(o.text, jsonB[i].text, o.text)
    t.equal(o.terms.length, jsonB[i].terms.length, 'terms-length ' + i)
    o.terms.forEach(term => {
      term.tags.forEach(tag => {
        let p = b.eq(i)
        t.equal(p.has('#' + tag), true, p.text() + ' has ' + tag)
      })
    })
  })
}

test('import-export basic', function(t) {
  let a = nlp('it was cold. John K. Smith  was  verrrrry  cold ! ')
  let b = nlp.import(a.export())
  isEqual(a, b, t)
  t.end()
})

test('import-export-empty', function(t) {
  let a = nlp('')
  let b = nlp.import(a.export())
  isEqual(a, b, t)

  t.end()
})

test('import-export-garbage', function(t) {
  let a = nlp('[]. oh yeah. function the null prototype.   - \n "two| (time()7 77')
  let b = nlp.import(a.export())
  isEqual(a, b, t)

  t.end()
})

test('export-unknown tag', function(t) {
  let a = nlp('cookie monster was a boomer. ok boomer', { boomer: 'Generation' })
  a.match('. monster').tag('Character')
  a.match('ok boomer').tag('Diss')
  let json = a.export()
  let b = nlp.import(json)
  isEqual(a, b, t)
  t.end()
})
