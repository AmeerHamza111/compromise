const addMethod = function(Doc) {
  /** split into approximate sub-sentence phrases */
  Doc.prototype.clauses = function(n) {
    // an awkward way to disambiguate a comma use
    let commas = this.if('@hasComma')
      .notIf('@hasComma @hasComma') //fun, cool...
      .notIf('@hasComma . .? (and|or) .') //cool, and fun
      .notIf('(#City && @hasComma) #Country') //'toronto, canada'
      .notIf('(#Date && @hasComma) #Year') //'july 6, 1992'
      .notIf('@hasComma (too|also)$') //at end of sentence
      .match('@hasComma')
    let found = this.splitAfter(commas)

    let quotes = found.quotations()
    found = found.splitOn(quotes)

    let parentheses = found.parentheses()
    found = found.splitOn(parentheses)

    // it is cool and it is ..
    let conjunctions = found.if('#Copula #Adjective #Conjunction (#Pronoun|#Determiner) #Verb').match('#Conjunction')
    found = found.splitBefore(conjunctions)

    // if it is this then that
    let condition = found.if('if .{2,9} then .').match('then')
    found = found.splitBefore(condition)

    // misc clause partitions
    found = found.splitBefore('as well as .')
    found = found.splitBefore('such as .')
    found = found.splitBefore('in addition to .')

    if (typeof n === 'number') {
      found = found.get(n)
    }
    return new Doc(found.list, this, this.world)
  }
  return Doc
}
module.exports = addMethod
