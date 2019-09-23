var test = require('tape')
var nlp = require('./_lib')
var api = require('../api')

const skip = {
  debug: true,
}

test('document methods exist', function(t) {
  Object.keys(api.doc).forEach(k => {
    if (skip[k] === true) {
      return
    }
    let doc = nlp(`one two three`)
    if (api.doc[k].getter === true) {
      t.doesNotThrow(() => doc[k], k)
    } else {
      t.doesNotThrow(() => doc[k](), k)
    }
  })
  t.end()
})

test('document methods eval', function(t) {
  Object.keys(api.doc).forEach(k => {
    if (skip[k] === true) {
      return
    }
    let code = `(function(){
      ${api.doc[k].example}
    })()`
    eval(code)
    t.ok(true, 'eval ' + k)
  })
  t.end()
})
