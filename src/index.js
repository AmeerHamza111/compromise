/* global define */
const build = require('./01-tokenizer')
const pkg = require('../package.json')
const World = require('./World')
const Doc = require('./Doc/Doc')

//blast-out our word-lists, just once
let world = new World()

/** parse and tag text into a compromise object  */
const nlp = function(text = '') {
  let list = build.fromText(text)
  let doc = new Doc(list, null, world)
  doc.tagger()
  return doc
}

/** uncompress and apply a user-submitted lexicon */
nlp.plugin = function(plugin) {
  world.plugin(plugin)
}
nlp.extend = function(fn) {
  fn(Doc)
}

/** make a deep-copy of the library state */
nlp.clone = function() {
  world = world.clone()
  return this
}

/** re-generate a Doc object from .json() results */
nlp.fromJSON = function(json) {
  let list = build.fromJSON(json)
  return new Doc(list, null, world)
}

/** log our decision-making for debugging */
nlp.verbose = function(bool = true) {
  world.verbose(bool)
}

/** current version of the library */
nlp.version = pkg.version

//and then all the exports..
if (typeof self !== 'undefined') {
  self.nlp = nlp // Web Worker
} else if (typeof window !== 'undefined') {
  window.nlp = nlp // Browser
} else if (typeof global !== 'undefined') {
  global.nlp = nlp // NodeJS
}
//don't forget amd!
if (typeof define === 'function' && define.amd) {
  define(nlp)
}
if (typeof module !== 'undefined') {
  module.exports = nlp
}
