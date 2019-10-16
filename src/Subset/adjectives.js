const addMethod = function(Doc) {
  /** simple transformations of adjectives*/
  class Adjectives extends Doc {
    conjugate(n) {
      let transform = this.world.transforms.adjectives
      let arr = []
      this.forEach(doc => {
        let obj = transform(doc.text('reduced'))
        arr.push(obj)
      })
      //support nth result
      if (typeof n === 'number') {
        return arr[n]
      }
      return arr
    }

    toSuperlative() {
      let transform = this.world.transforms.adjectives
      this.forEach(doc => {
        let obj = transform(doc.text('reduced'))
        doc.replaceWith(obj.Superlative)
      })
      return this
    }
    toComparative() {
      let transform = this.world.transforms.adjectives
      this.forEach(doc => {
        let obj = transform(doc.text('reduced'))
        doc.replaceWith(obj.Comparative)
      })
      return this
    }
    toAdverb() {
      let transform = this.world.transforms.adjectives
      this.forEach(doc => {
        let obj = transform(doc.text('reduced'))
        doc.replaceWith(obj.Adverb)
      })
      return this
    }
    toVerb() {
      let transform = this.world.transforms.adjectives
      this.forEach(doc => {
        let obj = transform(doc.text('reduced'))
        doc.replaceWith(obj.Verb)
      })
      return this
    }
    toNoun() {
      let transform = this.world.transforms.adjectives
      this.forEach(doc => {
        let obj = transform(doc.text('reduced'))
        doc.replaceWith(obj.Noun)
      })
      return this
    }
  }

  // simple lookup
  Doc.prototype.adjectives = function(n) {
    let list = this.match('#Adjective').list
    //support nth result
    if (typeof n === 'number') {
      list = list[n]
      list = [list].filter(a => a)
    }
    return new Adjectives(list, this, this.world)
  }

  return Doc
}
module.exports = addMethod
