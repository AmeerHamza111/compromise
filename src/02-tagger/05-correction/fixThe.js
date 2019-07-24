//Determiner-signals
const fixThe = function(doc) {
  let det = doc.if('#Determiner')
  if (det.found === true) {
    //the wait to vote
    det.match('(the|this) [#Verb] #Preposition .').tag('Noun', 'correction-determiner1')
    //the nice swim
    det.match('(the|this|those|these) #Adjective [#Verb]').tag('Noun', 'the-adj-verb')
    //the truly nice swim
    det.match('(the|this|those|these) #Adverb #Adjective [#Verb]').tag('Noun', 'correction-determiner4')
    //a stream runs
    det.match('(the|this|a|an) [#Infinitive] #Adverb? #Verb').tag('Noun', 'correction-determiner5')
    //some pressing issues
    det.match('some [#Verb] #Plural').tag('Noun', 'correction-determiner6')
    //the orange is
    det.match('#Determiner [#Adjective] (#Copula|#PastTense|#Auxiliary)').tag('Noun', 'the-adj-2')
    //a sense of
    det.match('#Determiner [#Verb] of').tag('Noun', 'the-verb-of')
    //the threat of force
    det.match('#Determiner #Noun of [#Verb]').tag('Noun', 'noun-of-noun')
    //a close
    det.match('#Determiner #Adverb? [close]').tag('Adjective', 'a-close')
    //the test string
    det.match('#Determiner [#Infinitive] #Noun').tag('Noun', 'correction-determiner7')
    //by a bear.
    det.match('#Determiner [#Infinitive]$').tag('Noun', 'a-inf')
    //the western line
    det.match('#Determiner [(western|eastern|northern|southern|central)] #Noun').tag('Noun', 'western-line')
    //the swim
    det.match('(the|those|these) [(#Infinitive|#PresentTense|#PastTense)]').tag('Noun', 'correction-determiner2')
    //the orange.
    det
      .match('#Determiner #Adjective$')
      .notIf('(#Comparative|#Superlative)')
      .term(1)
      .tag('Noun', 'the-adj-1')
  }

  let an = doc.if('(a|an)')
  if (an.found === true) {
    //a staggering cost
    an.match('(a|an) [#Gerund]').tag('Adjective', 'correction-a|an')
    //did a 900, paid a 20
    an.match('#Verb (a|an) [#Value]').tag('Singular', 'a-value')
    //a tv show
    an.match('(a|an) #Noun [#Infinitive]').tag('Noun', 'a-noun-inf')
    //a great run
    an.match('(a|an) #Adjective (#Infinitive|#PresentTense)')
      .term(2)
      .tag('Noun', 'correction-a|an2')
    //'a/an' can mean 1 - "a hour"
    an.match('[(a|an)] (#Duration|hundred|thousand|million|billion|trillion)')
      .ifNo('#Plural')
      .tag('Value', 'a-is-one')
  }

  return doc
}
module.exports = fixThe
