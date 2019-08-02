const debug = require('./_debug')
const jsonDefaults = { text: true, trim: true, terms: { text: true, tags: true, whitespace: true, implicit: true } }

/** return the document as text */
exports.text = function(options = {}) {
  if (typeof options === 'string') {
    if (options === 'normal') {
      options = {
        punctuation: true,
        whitespace: true,
        unicode: true,
      }
    }
    options = {}
  }
  return this.list.reduce((str, p) => {
    return str + p.text(options)
  }, '')
}

/** pull out desired metadata from the document */
exports.json = function(options = {}) {
  //support json(3) format
  if (typeof options === 'number') {
    return this.list[options].json(jsonDefaults)
  }
  options = Object.assign({}, jsonDefaults, options)
  return this.list.map(p => {
    return p.json(options)
  })
}

/** pretty-print the current document and its tags */
exports.debug = function() {
  debug(this)
  return this
}

/** some named output formats */
exports.out = function(method) {
  if (method === 'text') {
    return this.text()
  }
  if (method === 'normal') {
    return this.text('normal')
  }
  if (method === 'json') {
    return this.json()
  }
  if (method === 'array') {
    return this.json({ text: true, terms: false }).map(obj => obj.text)
  }
  if (method === 'terms') {
    let list = []
    this.json({ text: false, terms: { text: true } }).forEach(obj => {
      let terms = obj.terms.map(t => t.text)
      terms = terms.filter(t => t)
      list = list.concat(terms)
    })
    return list
  }
  if (method === 'debug') {
    debug(this)
    return this
  }
  return this.text()
}

/** normalized text -  out('normal') */
exports.normal = function() {
  return this.out('normal')
}

//aliases
exports.data = exports.json
