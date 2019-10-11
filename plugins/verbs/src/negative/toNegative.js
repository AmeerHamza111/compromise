const toInfinitive = require('../tense/toInfinitive')
const isPlural = require('../plural/isPlural')
// #Modal : would walk    -> 'would not walk'
// #Copula : is           -> 'is not'
// #PastTense : walked    -> did not walk
// #PresentTense : walks  -> does not walk
// #Gerund : walking:     -> not walking
// #Infinitive : walk     -> do not walk

const toNegative = function(parsed, world) {
  let vb = parsed.verb
  // if it's already negative...
  if (parsed.negative.found) {
    return
  }

  // would walk -> would not walk
  if (parsed.auxiliary.found) {
    parsed.auxiliary.append('not')
    return
  }
  // is walking -> is not walking
  if (vb.has('(#Copula|will|has|had|do)')) {
    vb.append('not')
    return
  }
  // walked -> did not walk
  if (vb.has('#PastTense')) {
    let inf = toInfinitive(parsed, world)
    vb.replace(inf)
    vb.prepend('did not')
    return
  }
  //walking -> not walking
  if (vb.has('#Gerund')) {
    let inf = toInfinitive(parsed, world)
    vb.replace(inf)
    vb.prepend('not')
    return
  }

  //fallback 1:  walk -> does not walk
  if (isPlural(parsed, world)) {
    vb.prepend('does not')
  }
  //fallback 2:  walk -> do not walk
  vb.prepend('do not')
  return
}
module.exports = toNegative
