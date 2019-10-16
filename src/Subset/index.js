const selections = [
  require('./Acronyms'),
  require('./Adjectives'),
  require('./Contractions'),
  require('./Parentheses'),
  require('./Possessives'),
  require('./Lists'),
]

const extend = function(Doc) {
  selections.forEach(addFn => addFn(Doc))
  return Doc
}
module.exports = extend
