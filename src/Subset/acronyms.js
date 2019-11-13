const addMethod = function(Doc) {
  /**  */
  class Acronyms extends Doc {
    stripPeriods() {
      this.termList().forEach(t => {
        let str = t.text.replace(/\./, '')
        t.set(str)
      })
      return this
    }
    addPeriods() {
      this.termList().forEach(t => {
        let str = t.text.replace(/\./, '')
        str = str.split('').join('.')
        t.set(str)
      })
      return this
    }
  }
  Acronyms.prototype.unwrap = Acronyms.prototype.stripPeriods
  Acronyms.prototype.strip = Acronyms.prototype.stripPeriods

  Doc.prototype.acronyms = function(n) {
    let match = this.match('#Acronym')
    if (typeof n === 'number') {
      match = match.get(n)
    }
    return new Acronyms(match.list, this, this.world)
  }
  return Doc
}
module.exports = addMethod
