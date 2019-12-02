```js
//greedy match issue
nlp(`wayne's world, party time`)
  .match('#Noun+? wayne')
  .debug()

nlp('Toronto Ontario foo')
  .match('(him|her|it|#Person|#Place|#Organization)+ .')
  .debug()
```

dangling child replace....

```js
let doc = nlp("springfield, springfield, it's a hell of a town.")
// keep a 'dangling' child document
let a = doc.match('a hell of a town')
// transform the parent document
doc.replace('hell of a', 'reasonable')
//dangling document is updated?
return a.text()
```

empty split() parent

```js
let doc = nlp(`i have two questions for Homer - 'Why lie?' and 'Lies, why?'`)
doc
  .quotations()
  .split()
  .out('array')
doc.clauses().split()
```

ngram collisions

```js
let doc = nlp('he fished and caught two fish')
doc.normalize('heavy')
console.log(doc.ngram())
```

syllables issues

```js
let doc = nlp(`Andreas Johnsson, Auston Matthews, and Zach Hyman.`)
let names = doc.clauses().split()
let json = names.syllables()
```

```js
nlp('it is a UNESCO world heritage site')
  .acronyms()
  .text()
```

possessive, sentence period

```js
nlp(`Wayne's World, party-time, excellent!! `).text('reduced')
nlp(`Wayne's World, party-time, excellent!! `).text('root')
```

```js
var doc = nlp('we get it, you vape.')
doc.verbs().toNegative()
console.log(doc.text())
```

```js
let nlpA = nlp.clone()
nlp.extend(require('compromise-dates'))
return {
  before: nlpA('quarter to nine').json(),
  after: nlp('quarter to nine').json(),
}
```

```js
console.log(doc.normalize('heavy').text())
```

```js
nlp(`Cows don't`)
  .nouns()
  .toSingular()
//a cow doesn't
```

```js
let doc = nlp('I’m lookin’ for Amanda').debug()
```

```js
nlp("spencer's fines").debug()
```

emdash becomes minus

```js
let nlpObj = nlp('text—text')
const sen = nlpObj.sentences().data()
console.log(sen)
```

tag-logic

```js
let doc = nlp('april')
//by default, it is a #Month, and a #Date
doc.tag('FemaleName')
//now it is automatically a #Person, and a #FirstName
console.log(doc.out('tags')[0].april)
```

text-replace

```js
let doc = nlp('i worked at the F.B.I')
doc = doc.match('(#Acronym|#Abbreviation)').replaceWith(d => {
  return d
})
doc.debug()
```


```js
nlp(`i met April O'neil`).dates()
```


```js
nlp(`why can't i have no kids and three money?`).contractions().expand().text()
```