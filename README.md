<div align="center">
  <div><b>compromise</b></div>
  <img src="https://user-images.githubusercontent.com/399657/68222691-6597f180-ffb9-11e9-8a32-a7f38aa8bded.png"/>
  <div>modest natural language processing</div>

  <div align="center">
    <sub>
      by
      <a href="https://github.com/spencermountain">Spencer Kelly</a> and
      <a href="https://github.com/spencermountain/compromise/graphs/contributors">
        many contributors
      </a>
    </sub>
  </div>
  <img height="25px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>
</div>

<div align="center">
  <div>
    <a href="https://npmjs.org/package/compromise">
    <img src="https://img.shields.io/npm/v/compromise.svg?style=flat-square" />
  </a>
  <a href="https://www.codacy.com/app/spencerkelly86/nlp_compromise">
    <img src="https://api.codacy.com/project/badge/Coverage/82cc8ebd98b64ed199d7be6021488062" />
  </a>
  <a href="https://unpkg.com/compromise">
    <img src="https://badge-size.herokuapp.com/spencermountain/compromise/master/builds/compromise.min.js" />
  </a>
  </div>
</div>


<div align="center">
  compromise is not <a href="https://github.com/spencermountain/compromise/wiki/Justification">the cleverest</a>.
  <br/>
  but it is
  <a href="https://beta.observablehq.com/@spencermountain/compromise-filesize">small,
  <a href="https://beta.observablehq.com/@spencermountain/compromise-performance">quick</a>,
  and <a href="https://beta.observablehq.com/@spencermountain/compromise-accuracy">good-enough</a> for a bunch of things.
</div>

<!-- spacer -->
<img src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

### .match():
compromise makes it simple to interpret and match text:
```js
let doc = nlp(entireNovel)

doc.if('the #Adjective of times').text()
// "it was the blurst of times??"
```
```js
if(doc.has('^simon says #Verb+')){
  doThis(doc.match('#Verb+ .*').text())
}else{
  doThis('')
}
```
read about the [match syntax here](https://observablehq.com/@spencermountain/compromise-match-syntax)
<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221837-0d142480-ffb8-11e9-9d30-90669f1b897c.png"/>
</div>

### .verbs():
conjugate and negate verbs in any tense:
```js
let doc = nlp('she sells seashells by the seashore.').verbs().toPastTense()
doc.text()
// 'she sold seashells by the seashore.'
```
[docs here](https://observablehq.com/@spencermountain/verbs)
<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221824-09809d80-ffb8-11e9-9ef0-6ed3574b0ce8.png"/>
</div>

### .nouns():
transform nouns to plural and possessive forms:
```js
let doc = nlp('the purple dinosaur').nouns().toPlural()
doc.text()
// 'the purple dinosaurs'
```
[docs here](https://observablehq.com/@spencermountain/nouns)
<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221731-e8b84800-ffb7-11e9-8453-6395e0e903fa.png"/>
</div>


### .numbers():
interpret plaintext numbers
```js
nlp.extend(require('compromise-numbers'))

let doc = nlp('ninety five thousand and fifty two')
doc.numbers().toNumber().add(2)
doc.text()
// '95054'
```
[docs here](https://observablehq.com/@spencermountain/compromise-values)
<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221814-05ed1680-ffb8-11e9-8b6b-c7528d163871.png"/>
</div>

### .topics():
grab the subjects of a text:
```js
nlp.extend(require('compromise-entities'))

nlp(buddyHolly).people().if('mary').json()
// [{text:'Marry Tyler Moore'}]

nlp(freshPrince).places().first().text()
// 'West Phillidelphia'

doc = nlp('the opera about richard nixon visiting china')
doc.topics().json()
// [
//   { text: 'richard nixon' },
//   { text: 'china' }
// ]
```
[docs here](https://observablehq.com/@spencermountain/topics-named-entity-recognition)

<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221632-b9094000-ffb7-11e9-99e0-b48edd6cdf8a.png"/>
</div>

### .contractions():
work with contracted and expanded words:
```js
let doc =nlp("we're not gonna take it, no we ain't gonna take it.")

// match within a contraction
doc.has('going') // true

// transform 
doc.contractions().expand()
dox.text()
// 'we are not going to take it, no we are not going to take it.'
```

<div align="center">
  <img src="https://user-images.githubusercontent.com/399657/68221731-e8b84800-ffb7-11e9-8453-6395e0e903fa.png"/>
  <!-- spacer -->
  <img height="30" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>
</div>

Use it on the client-side: 
```html
<script src="https://unpkg.com/compromise"></script>
<script>
  var doc = nlp('dinosaur')

  var str = doc.nouns().toPlural().out('text')
  console.log(str)
  // 'dinosaurs'
</script>
```
or as an esmodule:
```typescript
import nlp from 'compromise'

var doc = nlp('London is calling')
doc.verbs().toNegative()
// 'London is not calling'
```

<!-- spacer -->
<img height="30" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

compromise is **170kb** (minified):
<div align="center">
  <!-- filesize -->
  <img width="600" src="https://user-images.githubusercontent.com/399657/68234819-14dfc300-ffd0-11e9-8b30-cb8545707b29.png"/>
</div>

it's pretty fast. It can run on keypress:
<div align="center">
  <img width="600" src="https://user-images.githubusercontent.com/399657/68234798-0abdc480-ffd0-11e9-9ac5-8875d185a631.png"/>
</div>

it works mainly by conjugating many forms of a basic word list. 

The final lexicon is > 14,000 words:
<div align="center">
  <img width="600" src="https://user-images.githubusercontent.com/399657/68234805-0d201e80-ffd0-11e9-8dc6-f7a600352555.png"/>
</div>

you can read more about how it works, [here](http://blog.spencermounta.in/2019/building-compromise/index.html)

<!-- spacer -->
  <!-- <img height="25px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/> -->
<div align="center">
  <img src="https://user-images.githubusercontent.com/399657/68221814-05ed1680-ffb8-11e9-8b6b-c7528d163871.png"/>
</div>

### .extend():
pass-in an object with your own words:
```js
let doc = nlp(muppetText, {kermit:'FirstName', fozzie:'FirstName'})
```

or change the library's internal data:
```js
const nlp = require('compromise')

nlp.extend((Doc, world) => {
  
  // add new tags
  world.addTags({
    Character: {
      isA: 'Person',
      notA: 'Adjective',
    },
  })

  // add or change words in the lexicon
  world.addWords({
    kermit: 'Character',
    gonzo: 'Character',
  })

  // add methods to run after the tagger
  world.postProcess(doc => {
    doc.match('light the lights').tag('#Verb . #Plural')
  })

  // add a whole new method
  Doc.prototype.kermitVoice = function() {
    this.sentences().prepend('well,')
    this.match('i [(am|was)]').prepend('um,')
    return this
  }
})
```
you can read about [.extend() here](https://observablehq.com/@spencermountain/compromise-plugins) .
<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221848-11404200-ffb8-11e9-90cd-3adee8d8564f.png"/>
</div>


### API:

##### Constructor
* **[tokenize](docs.compromise.cool/compromise-tokenize)** - parse text into a compromise object, without running POS-tagging
* **[extend]()** - mix in a compromise-plugin
* **[clone]()** - make a deep-copy of the library state
* **[load]()** - re-generate a Doc object from .export() results
* **[verbose]()**  -  log our decision-making for debugging
* **[version]()**  -  current semver version of the library

##### Utils
* **[all]()** - return the whole original document ('zoom out')
* **[found]()** [getter] - is this document empty?
* **[parent]()** - return the previous result
* **[parents]()** - return all of the previous results
* **[tagger]()** - (re-)run the part-of-speech tagger on this document
* **[wordCount]()**  -  count the # of terms in each match
* **[length]()**  - count the # of characters of each match  (string length)
* **[clone]()**  -  deep-copy the document, so that no references remain
* **[cache]()**  -  freeze the current state of the document, for speed-purposes 
* **[uncache]()**  -  un-freezes the current state of the document, so it may be transformed

##### Accessors
* **[first]()**  -  use only the first result(s)
* **[last]()**  -  use only the last result(s)
* **[slice]()**  -  grab a subset of the results
* **[eq]()**  -  use only the nth result
* **[firstTerm]()**  -  get the first word in each match
* **[lastTerm]()**  -  get the end word in each match
* **[termList]()**  -  return a flat list of all Term objects in match 

##### Match
* **[match]()**  -  return a new Doc, with this one as a parent
* **[not]()**  -  return all results except for this
* **[matchOne]()**  -  return only the first match
* **[if]()**  -  return each current phrase, only if it contains this match ('only')
* **[ifNo]()**  -  Filter-out any current phrases that have this match ('notIf')
* **[has]()**  -  Return a boolean if this match exists
* **[lookBehind]()**  -  search through earlier terms, in the sentence
* **[lookAhead]()**  -  search through following terms, in the sentence
* **[before]()**  -  return all terms before a match, in each phrase
* **[after]()**  -  return all terms after a match, in each phrase

##### Case
* **[toLowerCase]()**  -  turn every letter of every term to lower-cse
* **[toUpperCase]()**  -  turn every letter of every term to upper case
* **[toTitleCase]()**  -  upper-case the first letter of each term
* **[toCamelCase]()**  -  remove whitespace and title-case each term

##### Whitespace
* **[pre]()**  -  add this punctuation or whitespace before each match 
* **[post]()**  -  add this punctuation or whitespace after each match
* **[trim]()**  -  remove start and end whitespace
* **[hyphenate]()**  -  connect words with hyphen, and remove whitespace
* **[dehyphenate]()**  -  remove hyphens between words, and set whitespace
  
##### Tag
* **[tag]()**  -  Give all terms the given tag
* **[tagSafe]()**  -  Only apply tag to terms if it is consistent with current tags
* **[unTag]()**  -  Remove this term from the given terms
* **[canBe]()**  -  return only the terms that can be this tag

##### Loops
* **[map]()** - run each phrase through a function, and create a new document
* **[forEach]()**  -  run a function on each phrase, as an individual document
* **[filter]()**  -  return only the phrases that return true
* **[find]()**  -  return a document with only the first phrase that matches
* **[some]()**  -  return true or false if there is one matching phrase
* **[random]()**  -  sample a subset of the results

##### Insert
* **[replace]()**  -  search and replace match with new content
* **[replaceWith]()**  -  substitute-in new text
* **[delete]()**  -  fully remove these terms from the document
* **[append]()**  -  add these new terms to the end (insertAfter)
* **[prepend]()**  -  add these new terms to the front (insertBefore)
* **[concat]()**  -  add these new things to the end

##### Transform
* **[sort]()**  -  re-arrange the order of the matches (in place)
* **[reverse]()**  -  reverse the order of the matches, but not the words
* **[unique]()**  -  remove any duplicate matches
* **[split]()**  -  return a Document with three parts for every match ('splitOn')
* **[splitBefore]()**  -  separate everything after the match as a new phrase
* **[splitAfter]()**  -  separate everything before the word, as a new phrase 
* **[normalize]()** - clean-up the text in various ways
* **[segment]()** - split a document into labeled sections
* **[join]()** - make all phrases into one phrase 

##### Output
* **[text]()**  -  return the document as text
* **[json]()**  -  pull out desired metadata from the document
* **[out]()**  -  some named output formats
* **[debug]()**  -  pretty-print the current document and its tags
* **[export]()**  -  store a parsed document for later use
  
##### Selections
* **[terms]()**  -  split-up results by each individual term
* **[clauses]()**  -  split-up sentences into multi-term phrases
* **[hyphenated]()**  -   all terms connected with a hyphen or dash

* **[hashTags]()**  -  return things like '#nlp'
* **[emails]()**  -  return things like 'hi@compromise.cool'
* **[atMentions]()**  -  return things like '@nlp_compromise'
* **[urls]()**  -  return things like 'compromise.cool'

* **[fractions]()**  -  return anything tagged as a Fraction
* **[phoneNumbers]()**  -  return things like '(939) 555-0113'
* **[money]()**  -  return things like '$2.50'

* **[adverbs]()**  -  return things like 'quickly'
* **[pronouns]()**  -  return anything tagged as a Pronoun
* **[conjunctions]()**  -  return things like 
* **[prepositions]()**  -  return things like 
* **[abbreviations]()**  -  return things like 'Mrs.'
* **[romanNumerals]()**  -  return things like 'CCXXII'

* **[acronyms]()**  -  return things like 'FBI'  
* **[contractions]()**  -  return things like "didn't" and "would not"
* **[lists]()**  -  return all comma-seperated lists
* **[nouns]()**  -   return any subsequent terms tagged as a Noun
* **[parentheses]()**  -  return anything inside (parentheses)
* **[possessives]()**  -  return things like "Spencer's"
* **[quotations]()**  -  return any terms inside quotation marks
* **[verbs]()**  -  return any subsequent terms tagged as a Verb


<!-- spacer -->
<div >
  <img height="25px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>
  <hr/>
  <img height="25px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>
</div>


<!-- spacer -->
<div >
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>
</div>

### Docs:
##### Tutorials:
* **[Tutorial #1](https://observablehq.com/@spencermountain/tutorial-1)**  -  Input → output 
* **[Tutorial #2](https://observablehq.com/@spencermountain/compromise-tutorial-2)**  -  Match & transform 
* **[Tutorial #3](https://observablehq.com/@spencermountain/compromise-making-a-bot)**  -  Making a chat-bot
<!-- * **[Tutorial #4]()**  -  Making a plugin -->
##### 3rd party:
* **[Geocoding Social Conversations with NLP and JavaScript](http://compromise.cool)**  -  by Microsoft
* **[Microservice Recipe](https://eventn.com/recipes/text-parsing-with-nlp-compromise)**  -  by Eventn
* **[Building Text-Based Games](https://killalldefects.com/2019/09/24/building-text-based-games-with-compromise-nlp/)**  -  by Matt Eland
* **[Fun with javascript in BigQuery](https://medium.com/@hoffa/new-in-bigquery-persistent-udfs-c9ea4100fd83#6e09)**  -  by Felipe Hoffa
##### Talks:
* **[Language as an Interface](https://www.youtube.com/watch?v=WuPVS2tCg8s)**  -  by Spencer Kelly
* **[Coding Chat Bots](https://www.youtube.com/watch?v=c_hmwFwvO0U)**  -  by KahWee Teng

<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221824-09809d80-ffb8-11e9-9ef0-6ed3574b0ce8.png"/>
</div>

##### Some fun Applications:
* **[Chat dialogue framework](http://superscriptjs.com/)**  -  by Rob Ellis
* **[Automated Bechdel Test](https://github.com/guardian/bechdel-test)**  -  by The Guardian
* **[Tumbler blog of lists](https://leanstooneside.tumblr.com/)**  -  horse-ebooks-like lists -  by Michael Paulukonis
* **[Story generation](https://perchance.org/welcome)**  -  by Jose Phrocca
* **[Browser extension Fact-checking](https://github.com/AlexanderKidd/FactoidL)**  -  by Alexander Kidd
* **[Video Transcription and Editing](https://newtheory.io/)** -  by New Theory
* **[Siri shortcut](https://routinehub.co/shortcut/3260)**  -  by Michael Byrns 
* **[Amazon skill](https://github.com/tajddin/voiceplay)**  -  by Tajddin Maghni
* **[Tasking slack-bot](https://github.com/kevinsuh/toki)**  -  by Kevin Suh

<!-- spacer -->
<div align="center">
  <img height="25px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>
  <hr/>
</div>

#### FAQ

<ul align="left">
  <p>
    <details>
      <summary>☂️ Isn't javascript too...</summary>
      <p></p>
      <ul>
        yeah it is!
        <br/>
        it wasn't built to compete with NLTK, and may not fit every project.
        <br/>
        string processing is synchronous too, and parallelizing node processes is weird.
        <br/>
        See <a href="https://beta.observablehq.com/@spencermountain/compromise-performance">here</a> for information about speed & performance, and
        <a href="https://github.com/spencermountain/compromise/wiki/Justification">here></a> for project motivations
      </ul>
      <p></p>
    </details>
  </p>  
  <p>
    <details>
      <summary>💃 Can it run on my arduino-watch?</summary>
      <p></p>
      <ul>
        Only if it's water-proof!
        <br/>
        Read <a href="https://github.com/spencermountain/compromise/wiki/QuickStart">quick start</a> for running compromise in workers, mobile apps, and all sorts of funny environments.
      </ul>
      <p></p>
    </details>
  </p>
  <p>
    <details>
      <summary>🌎 Compromise in other Languages?</summary>
      <p></p>
      <ul>
        we've got work-in-progress forks for <a href="https://github.com/nlp-compromise/de-compromise">German</a> and <a href="https://github.com/nlp-compromise/fr-compromise">French</a>, in the same philosophy.
        <br/>
        and need some help.
      </ul>
      <p></p>
    </details>
  </p>
  <p>
    <details>
      <summary>✨ Partial builds?</summary>
      <p></p>
      <ul>
        compromise isn't easily tree-shaken.
        <br/> the tagging methods are competitive, and greedy, so it's not recommended to pull things out.
        <img height="25px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>
        It's best to load the library fully, given it's smaller than <a href="https://68.media.tumblr.com/tumblr_m674jlpyPT1ry8fquo1_250.gif">this gif</a>.
        <br/>
      </ul>
      <p></p>
    </details>
  </p>
</ul>



<div align="center">
  <img src="https://user-images.githubusercontent.com/399657/68221731-e8b84800-ffb7-11e9-8453-6395e0e903fa.png"/>
</div>

#### See Also:
* &nbsp; **[naturalNode](https://github.com/NaturalNode/natural)** - fancier statistical nlp in javascript
* &nbsp; **[superScript](http://superscriptjs.com/)** - clever conversation engine in js
* &nbsp; **[nodeBox linguistics](https://www.nodebox.net/code/index.php/Linguistics)** - conjugation, inflection in javascript
* &nbsp; **[reText](https://github.com/wooorm/retext)** - very impressive [text utilities](https://github.com/wooorm/retext/blob/master/doc/plugins.md) in javascript
* &nbsp; **[jsPos](https://code.google.com/archive/p/jspos/)** - javascript build of the time-tested Brill-tagger
* &nbsp; **[spaCy](https://spacy.io/)** - speedy, multilingual tagger in C/python

<img height="25px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

**MIT**
