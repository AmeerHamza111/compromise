const test = require('tape')
const nlp = require('./_lib')

test('sortAlpha:', function(t) {
  const str = 'John xoo, John fredman, John davis, John fredman,'
  let r = nlp(str)
  r = r.split('@hasComma')
  r.sort('alpha')
  const want = ['John davis,', 'John fredman,', 'John fredman,', 'John xoo,']
  t.deepEqual(r.out('array'), want, 'sort-alpha')
  t.end()
})

test('sortSequential:', function(t) {
  const str = 'John xoo, John fredman, John davis'
  let r = nlp(str)
  r = r.split('@hasComma')
  r.sort('alphabetical')
  r.sort('seq')
  const want = ['John xoo,', 'John fredman,', 'John davis']
  t.deepEqual(r.out('array'), want, 'sort-chron')
  t.end()
})

test('reverse:', function(t) {
  const str = 'John xoo, John fredman, John davis'
  let r = nlp(str)
  r = r.split('@hasComma')
  r.sort('alphabetical')
  r = r.reverse()
  const want = ['John xoo,', 'John fredman,', 'John davis']
  t.deepEqual(r.out('array'), want, 'alpha-reverse')
  t.end()
})

test('length:', function(t) {
  const str = 'Amy, John Fredman, Dr. Bill, Alexis Smithsonian'
  let r = nlp(str)
  r = r.split('@hasComma')
  r.sort('length')
  r = r.reverse()
  const want = ['Amy,', 'Dr. Bill,', 'John Fredman,', 'Alexis Smithsonian']
  t.deepEqual(r.out('array'), want, 'sort length')
  t.end()
})

test('wordCount:', function(t) {
  const str = 'John Fredman, Amy, Dr. Bill G. Gates'
  let r = nlp(str)
  r = r.split('@hasComma')
  r.sort('wordCount')
  r.reverse()
  const want = ['Dr. Bill G. Gates', 'John Fredman,', 'Amy,']
  t.deepEqual(r.out('array'), want, 'sort-wordcount')
  t.end()
})

test('unique:', function(t) {
  const str = 'John xoo, John fredman, john xoo, John davis'
  let r = nlp(str)
  r = r.split('@hasComma')
  r = r.unique()
  const want = ['John xoo,', 'John fredman,', 'John davis']
  t.deepEqual(r.out('array'), want, 'sort-unique')
  t.end()
})

test('custom-sort:', function(t) {
  let doc = nlp('Eeny, meeny, miny, moe')
  let terms = doc.terms()
  terms.sort((a, b) => {
    if (a.text('normal').length > b.text('normal').length) {
      return -1
    }
    return 1
  })
  let arr = terms.map(d => d.text('normal'))
  t.deepEqual(arr, ['meeny, ', 'miny, ', 'eeny, ', 'moe'], 'custom sort output')
  t.end()
})

// test('frequency:', function(t) {
//   const str = 'John xoo, John fredman, john xoo, John davis'
//   let r = nlp(str)
//   r = r.split('@hasComma')
//   const a = r.out('frequency')
//   t.equal(a[0].normal, 'john xoo', 'topk is sorted')
//   t.equal(a[0].count, 2, 'topk finds two')
//   t.end()
// })
