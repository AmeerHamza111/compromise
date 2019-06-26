import efrtUnpack from 'efrt-unpack';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function getCjsExportFromNamespace (n) {
	return n && n['default'] || n;
}

//this is a not-well-thought-out way to reduce our dependence on `object===object` stuff
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');

//generates a unique id for this term
function makeId(str) {
  str = str || '_';
  var text = str + '-';
  for (var i = 0; i < 7; i++) {
    text += chars[Math.floor(Math.random() * chars.length)];
  }
  return text
}

var _id = makeId;

//a hugely-ignorant, and widely subjective transliteration of latin, cryllic, greek unicode characters to english ascii.
//approximate visual (not semantic or phonetic) relationship between unicode and ascii characters
//http://en.wikipedia.org/wiki/List_of_Unicode_characters
//https://docs.google.com/spreadsheet/ccc?key=0Ah46z755j7cVdFRDM1A2YVpwa1ZYWlpJM2pQZ003M0E
let compact = {
  '!': '¡',
  '?': '¿Ɂ',
  '"': '“”"❝❞',
  "'": '‘‛❛❜',
  '-': '—–',
  a: 'ªÀÁÂÃÄÅàáâãäåĀāĂăĄąǍǎǞǟǠǡǺǻȀȁȂȃȦȧȺΆΑΔΛάαλАДадѦѧӐӑӒӓƛɅæ',
  b: 'ßþƀƁƂƃƄƅɃΒβϐϦБВЪЬбвъьѢѣҌҍҔҕƥƾ',
  c: '¢©ÇçĆćĈĉĊċČčƆƇƈȻȼͻͼͽϲϹϽϾϿЄСсєҀҁҪҫ',
  d: 'ÐĎďĐđƉƊȡƋƌǷ',
  e: 'ÈÉÊËèéêëĒēĔĕĖėĘęĚěƎƏƐǝȄȅȆȇȨȩɆɇΈΕΞΣέεξϱϵ϶ЀЁЕЭеѐёҼҽҾҿӖӗӘәӚӛӬӭ',
  f: 'ƑƒϜϝӺӻҒғӶӷſ',
  g: 'ĜĝĞğĠġĢģƓǤǥǦǧǴǵ',
  h: 'ĤĥĦħƕǶȞȟΉΗЂЊЋНнђћҢңҤҥҺһӉӊ',
  I: 'ÌÍÎÏ',
  i: 'ìíîïĨĩĪīĬĭĮįİıƖƗȈȉȊȋΊΐΪίιϊІЇії',
  j: 'ĴĵǰȷɈɉϳЈј',
  k: 'ĶķĸƘƙǨǩΚκЌЖКжкќҚқҜҝҞҟҠҡ',
  l: 'ĹĺĻļĽľĿŀŁłƚƪǀǏǐȴȽΙӀӏ',
  m: 'ΜϺϻМмӍӎ',
  n: 'ÑñŃńŅņŇňŉŊŋƝƞǸǹȠȵΝΠήηϞЍИЙЛПийлпѝҊҋӅӆӢӣӤӥπ',
  o: 'ÒÓÔÕÖØðòóôõöøŌōŎŏŐőƟƠơǑǒǪǫǬǭǾǿȌȍȎȏȪȫȬȭȮȯȰȱΌΘΟθοσόϕϘϙϬϭϴОФоѲѳӦӧӨөӪӫ¤ƍΏ',
  p: 'ƤƿΡρϷϸϼРрҎҏÞ',
  q: 'Ɋɋ',
  r: 'ŔŕŖŗŘřƦȐȑȒȓɌɍЃГЯгяѓҐґ',
  s: 'ŚśŜŝŞşŠšƧƨȘșȿςϚϛϟϨϩЅѕ',
  t: 'ŢţŤťŦŧƫƬƭƮȚțȶȾΓΤτϮϯТт҂Ҭҭ',
  u: 'µÙÚÛÜùúûüŨũŪūŬŭŮůŰűŲųƯưƱƲǓǔǕǖǗǘǙǚǛǜȔȕȖȗɄΰμυϋύϑЏЦЧцџҴҵҶҷӋӌӇӈ',
  v: 'νѴѵѶѷ',
  w: 'ŴŵƜωώϖϢϣШЩшщѡѿ',
  x: '×ΧχϗϰХхҲҳӼӽӾӿ',
  y: 'ÝýÿŶŷŸƳƴȲȳɎɏΎΥΫγψϒϓϔЎУучўѰѱҮүҰұӮӯӰӱӲӳ',
  z: 'ŹźŻżŽžƩƵƶȤȥɀΖζ',
};
//decompress data into two hashes
let unicode = {};
Object.keys(compact).forEach(function(k) {
  compact[k].split('').forEach(function(s) {
    unicode[s] = k;
  });
});

const killUnicode = str => {
  let chars = str.split('');
  chars.forEach((s, i) => {
    if (unicode[s]) {
      chars[i] = unicode[s];
    }
  });
  return chars.join('')
};
var unicode_1 = killUnicode;

const periodAcronym = /([A-Z]\.)+[A-Z]?,?$/;
const oneLetterAcronym = /^[A-Z]\.,?$/;
const noPeriodAcronym = /[A-Z]{2}('s|,)?$/;

/** does it appear to be an acronym, like FBI or M.L.B. */
const isAcronym = function(str) {
  //like N.D.A
  if (periodAcronym.test(str) === true) {
    return true
  }
  //like 'F.'
  if (oneLetterAcronym.test(str) === true) {
    return true
  }
  //like NDA
  if (noPeriodAcronym.test(str) === true) {
    return true
  }
  return false
};
var isAcronym_1 = isAcronym;

/** some basic operations on a string to reduce noise */
const normalize = function(str) {
  str = str || '';
  str = str.toLowerCase();
  str = str.trim();
  let original = str;
  //(very) rough ASCII transliteration -  bjŏrk -> bjork
  str = unicode_1(str);
  //#tags, @mentions
  str = str.replace(/^[#@]/, '');
  //punctuation
  str = str.replace(/[,;.!?]+$/, '');
  // coerce single curly quotes
  str = str.replace(/[\u0027\u0060\u00B4\u2018\u2019\u201A\u201B\u2032\u2035\u2039\u203A]+/g, "'");
  // coerce double curly quotes
  str = str.replace(
    /[\u0022\u00AB\u00BB\u201C\u201D\u201E\u201F\u2033\u2034\u2036\u2037\u2E42\u301D\u301E\u301F\uFF02]+/g,
    '"'
  );
  //coerce Unicode ellipses
  str = str.replace(/\u2026/g, '...');
  //en-dash
  str = str.replace(/\u2013/g, '-');
  //lookin'->looking (make it easier for conjugation)
  if (/[a-z][^aeiou]in['’]$/.test(str) === true) {
    str = str.replace(/in['’]$/, 'ing');
  }
  //turn re-enactment to reenactment
  if (/^(re|un)-?[^aeiou]./.test(str) === true) {
    str = str.replace('-', '');
  }
  //strip leading & trailing grammatical punctuation
  if (/^[:;]/.test(str) === false) {
    str = str.replace(/\.{3,}$/g, '');
    str = str.replace(/['",\.!:;\?\)]+$/g, '');
    str = str.replace(/^['"\(]+/g, '');
  }
  //do this again..
  str = str.trim();
  //oh shucks,
  if (str === '') {
    str = original;
  }
  //compact acronyms
  if (isAcronym_1(str)) {
    str = str.replace(/\./g, '');
  }
  //nice-numbers
  str = str.replace(/([0-9]),([0-9])/g, '$1$2');
  return str
};

var normalize_1 = normalize;

//all punctuation marks, from https://en.wikipedia.org/wiki/Punctuation
let endings = /[ \.’'\[\](){}⟨⟩:,،、‒–—―…!.‹›«»‐\-?‘’“”'";\/⁄·\&*@\•^†‡°”¡¿※#№÷×ºª%‰+−=‱¶′″‴§~_|‖¦©℗®℠™¤₳฿]+$/;
let startings = /^[ \.’'\[\](){}⟨⟩:,،、‒–—―…!.‹›«»‐\-?‘’“”'";\/⁄·\&*@\•^†‡°”¡¿※#№÷×ºª%‰+−=‱¶′″‴§~_|‖¦©℗®℠™¤₳฿]+/;
// let punctuation = '[ \.’\'\[\(\)\{\}⟨⟩:,،、‒–—―…!.‹›«»‐-\?]';
//money = ₵¢₡₢$₫₯֏₠€ƒ₣₲₴₭₺₾ℳ₥₦₧₱₰£៛₽₹₨₪৳₸₮₩¥

/** turn given text into a parsed-up object
 * seperate the 'meat' of the word from the whitespace+punctuation
 */
const parseTerm = str => {
  let preText = '';
  let postText = '';
  str = str.replace(startings, found => {
    preText = found;
    return ''
  });
  str = str.replace(endings, found => {
    postText = found;
    return ''
  });
  //we went too far..
  if (str === '') {
    str = preText.replace(/[.?!]/, ''); //.trim(); //huh?
    preText = '';
  }
  return {
    text: str,
    normal: normalize_1(str),
    preText: preText,
    postText: postText,
  }
};
var parse = parseTerm;

/** convert all text to uppercase */
var toUpperCase = function() {
  this.text = this.text.toUpperCase();
  this.tag('#UpperCase', 'toUpperCase');
  return this
};

/** convert all text to lowercase */
var toLowerCase = function() {
  this.text = this.text.toLowerCase();
  this.unTag('#TitleCase');
  this.unTag('#UpperCase');
  return this
};

/** only set the first letter to uppercase
 * leave any existing uppercase alone
 */
var toTitleCase = function() {
  this.text = this.text.replace(/^ *[a-z]/, x => x.toUpperCase());
  this.tag('#TitleCase', 'toTitleCase');
  return this
};

var _01Case = {
	toUpperCase: toUpperCase,
	toLowerCase: toLowerCase,
	toTitleCase: toTitleCase
};

/** does it have a comma?  */
var hasComma = function() {
  return this.postText.includes(',')
};

/** does it end in a period? */
var hasPeriod = function() {
  return this.postText.includes('.') === true && this.postText.includes('...') === false
};

/** does it end in an exclamation */
var hasExclamation = function() {
  return this.postText.includes('!')
};

/** does it end with a question mark? */
var hasQuestionMark = function() {
  return this.postText.includes('?') || this.postText.includes('¿')
};

/** is there a ... at the end? */
var hasElipses = function() {
  return this.postText.includes('..') || this.postText.includes('…')
};

/** is there a semicolon after this word? */
var hasSemicolon = function() {
  return this.postText.includes(';')
};

/** clopper any atypical whitespace */
var normalizeWhitespace = function() {
  let punct = this.punctuation() || '';
  this.preText = ' ';
  this.postText = punct;
  return this
};

/** return any expected forms of trailing punctuation */
var punctuation = function() {
  let str = this.postText.trim();
  let m = str.match(/[\.,\?\!]/);
  if (m !== null) {
    return m[0]
  }
  return null
};

var _02Punctuation = {
	hasComma: hasComma,
	hasPeriod: hasPeriod,
	hasExclamation: hasExclamation,
	hasQuestionMark: hasQuestionMark,
	hasElipses: hasElipses,
	hasSemicolon: hasSemicolon,
	normalizeWhitespace: normalizeWhitespace,
	punctuation: punctuation
};

/** ignore optional/greedy logic, straight-up term match*/
const doesMatch = function(t, reg) {
  if (reg.normal !== undefined) {
    return reg.normal === t.normal
  }
  if (reg.tag !== undefined) {
    return t.tags[reg.tag] === true
  }
  if (reg.regex !== undefined) {
    return reg.regex.test(t.normal)
  }
  if (reg.choices !== undefined) {
    //recursion alert
    let foundOne = reg.choices.find(r => doesMatch(t, r));
    return foundOne !== undefined
  }
  return false
};
var _match = doesMatch;

//
var out = function(options) {
  let word = this.text;
  let before = this.preText;
  let after = this.postText;
  if (options.normal === true) {
    word = this.normal;
    before = '';
    after = ' ';
    if (options.last === true) {
      after = '';
    }
    //normalized end punctuation
    if (this.hasPeriod() === true) {
      after = '.' + after;
    } else if (this.hasQuestionMark() === true) {
      after = '?' + after;
    } else if (this.hasExclamation() === true) {
      after = '!' + after;
    } else if (this.hasComma() === true) {
      after = ',' + after;
    } else if (this.hasElipses() === true) {
      after = '...' + after;
    }
  }
  return before + word + after
};

/** return various metadata for this term */
var json = function() {
  let result = {
    text: this.text,
    tags: Object.keys(this.tags),
    preText: this.preText,
    postText: this.postText,
  };
  return result
};

var _04Out = {
	out: out,
	json: json
};

const boring = {
  TitleCase: true,
  UpperCase: true,
  CamelCase: true,
  Hyphenated: true,
  StartBracket: true,
  EndBracket: true,
  Comma: true,
  ClauseEnd: true,
};

/** check a match object against this term */
var doesMatch_1 = function(reg) {
  return _match(this, reg)
};

/** return term meta-data in a given format */
var out_1 = function(reg) {
  return _04Out(this, reg)
};

/** does this term look like an acryonym? */
var isAcronym_1$1 = function() {
  return isAcronym_1(this.text)
};

/** does the term have one meaningful tag? */
var isKnown = function() {
  let tags = Object.keys(this.tags);
  tags = tags.filter(t => !boring[t]);
  return tags.length > 0
};

var _03Misc = {
	doesMatch: doesMatch_1,
	out: out_1,
	isAcronym: isAcronym_1$1,
	isKnown: isKnown
};

var methods = Object.assign(
  {},
  _01Case,
  _02Punctuation,
  _03Misc,
  _04Out
);

/** add spaces at the end */
const padEnd = function(str, width) {
  str = str.toString();
  while (str.length < width) {
    str += ' ';
  }
  return str
};

/** output for verbose-mode */
var logTag = function(t, tag, reason) {
  let log = '\x1b[33m' + padEnd(t.normal, 15) + '\x1b[0m + \x1b[32m' + tag + '\x1b[0m ';
  if (reason) {
    log = padEnd(log, 35) + ' ' + reason + '';
  }
  console.log(log);
};

/** output for verbose mode  */
var logUntag = function(t, tag, reason) {
  let log = '\x1b[33m' + padEnd(t.normal, 3) + ' \x1b[31m - #' + tag + '\x1b[0m ';
  if (reason) {
    log = padEnd(log, 35) + ' ' + reason;
  }
  console.log(log);
};

var isArray = function(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
};

var titleCase = str => {
  return str.charAt(0).toUpperCase() + str.substr(1)
};

var fns = {
	logTag: logTag,
	logUntag: logUntag,
	isArray: isArray,
	titleCase: titleCase
};

/** add a tag, and its descendents, to a term */
const addTag = function(t, tag, reason, world) {
  if (tag[0] === '#') {
    tag = tag.replace(/^#/, '');
  }
  tag = fns.titleCase(tag);
  //if we already got this one
  if (t.tags[tag] === true) {
    return
  }
  if (world !== undefined && world.isVerbose() === true) {
    fns.logTag(t, tag, reason);
  }
  //add tag
  t.tags[tag] = true; //whee!

  //check tagset for any additional things to do...
  if (world !== undefined && world.tags !== undefined) {
    let tagset = world.tags;
    if (tagset.hasOwnProperty(tag) === true) {
      //add parent Tags
      if (tagset[tag].isA !== undefined) {
        let parentTag = tagset[tag].isA;
        addTag(t, parentTag, '→', world); //recursive
      }
      //remove any contrary tags
      if (typeof tagset[tag].notA !== 'undefined') {
        t.unTag(tagset[tag].notA, '←', world);
      }
    }
  }
};

/** support an array of tags */
const addTags = function(term, tags, reason, world) {
  if (fns.isArray(tags) === true) {
    tags.forEach(tag => addTag(term, tag, reason, world));
  } else {
    addTag(term, tags, reason, world);
  }
};
var add = addTags;

/** remove this tag, and its descentents from the term */
const unTag = function(t, tag, reason, world) {
  if (t.tags.hasOwnProperty(tag) === true) {
    delete t.tags[tag];
    //log in verbose-mode
    if (world !== undefined && world.isVerbose() === true) {
      fns.logUntag(t, tag, reason);
    }
  }
  //delete downstream tags too
  if (world) {
    //TODO: properly support Term calling itself directly
    const tagset = world.tags;
    if (tagset[tag]) {
      let also = tagset[tag].downward;
      for (let i = 0; i < also.length; i++) {
        unTag(t, also[i], ' - -   - ', world); //recursive
      }
    }
  }
  return t
};

//handle an array of tags
const untagAll = function(term, tags, reason, world) {
  if (fns.isArray(tags) === true) {
    tags.forEach(tag => unTag(term, tag, reason, world));
  } else {
    unTag(term, tags, reason, world);
  }
};
var unTag_1 = untagAll;

//recursively-check compatibility of this tag and term
const canBe = function(term, tag, world) {
  const tagset = world.tags;
  //fail-fast
  if (tagset[tag] === undefined) {
    return true
  }
  //loop through tag's contradictory tags
  let enemies = tagset[tag].notA || [];
  for (let i = 0; i < enemies.length; i++) {
    if (term.tags[enemies[i]] === true) {
      return false
    }
  }
  if (tagset[tag].isA !== undefined) {
    return canBe(term, tagset[tag].isA, world) //recursive
  }
  return true
};

var canBe_1 = canBe;

/** add a tag or tags, and their descendents to this term
 * @param  {string | string[]} tags - a tag or tags
 * @param {string?} [reason] a clue for debugging
 */
var tag_1 = function(tags, reason, world) {
  add(this, tags, reason, world);
  return this
};

/** remove a tag or tags, and their descendents from this term
 * @param {string | string[]} tags  - a tag or tags
 * @param {string?} [reason] a clue for debugging
 */
var unTag_1$1 = function(tags, reason, world) {
  unTag_1(this, tags, reason, world);
  return this
};

/** is this tag consistent with the word's current tags?
 * @param {string | string[]} tags - a tag or tags
 * @returns {boolean}
 */
var canBe_1$1 = function(tags, world) {
  return canBe_1(this, tags, world)
};

var tag = {
	tag: tag_1,
	unTag: unTag_1$1,
	canBe: canBe_1$1
};

class Term {
  constructor(text = '') {
    text = String(text);
    let obj = parse(text);
    this.text = obj.text || '';
    this.normal = obj.normal || '';
    this.implicit =  null;
    this.preText = obj.preText || '';
    this.postText = obj.postText || '';
    this.raw = text.trim();
    this.tags = {};
    this.prev = null;
    this.next = null;
    this.id = _id(this.normal);
    this.isA = 'Term'; // easier than .constructor...
  }
}

/** create a deep-copy of this term */
Term.prototype.clone = function() {
  let term = new Term(this.text);
  term.preText = this.preText;
  term.postText = this.postText;
  term.tags = this.tags.slice(0);
  return term
};

Object.assign(Term.prototype, methods);
Object.assign(Term.prototype, tag);

var Term_1 = Term;

/** return a flat array of Term objects */
var terms = function(n) {
  let terms = [this.pool.get(this.start)];
  if (this.length === 0) {
    return []
  }
  for (let i = 0; i < this.length - 1; i += 1) {
    let id = terms[terms.length - 1].next;
    if (id === null) {
      console.warn('linked-list broken');
      break
    }
    let term = this.pool.get(id);
    terms.push(term);
  }
  if (n !== undefined) {
    return terms[n]
  }
  return terms
};

/** return a deep-copy of this phrse  */
var clone = function() {
  //how do we clone part of the pool?
  let terms = this.terms();
  let newTerms = terms.map(t => t.clone());
  //connect these new ids up
  newTerms.forEach((t, i) => {
    //add it to the pool..
    this.pool.add(t);
    if (newTerms[i + 1]) {
      t.next = newTerms[i + 1].id;
    }
    if (newTerms[i - 1]) {
      t.prev = newTerms[i - 1].id;
    }
  });
  return this.buildFrom(newTerms[0].id, newTerms.length)
};

/** return last term object */
var lastTerm = function() {
  let terms = this.terms();
  return terms[terms.length - 1]
};

/** quick lookup for a term id */
var hasId = function(id) {
  let terms = this.terms();
  return terms.find(t => t.id === id) !== undefined
};

/** produce output in the given format */
var out$1 = function(options = {}) {
  let terms = this.terms();
  return terms.reduce((str, t, i) => {
    options.last = i === terms.length - 1;
    return str + t.out(options)
  }, '')
};

/** return json metadata for this phrase */
var json$1 = function(options = {}) {
  return this.terms().map(t => t.json(options))
};

var _01Utils = {
	terms: terms,
	clone: clone,
	lastTerm: lastTerm,
	hasId: hasId,
	out: out$1,
	json: json$1
};

/** remove start and end whitespace */
var trim = function() {
  let terms = this.terms();
  if (terms.length > 0) {
    //trim starting
    terms[0].preText = terms[0].preText.replace(/^\s+/, '');
    //trim ending
    let lastTerm = terms[terms.length - 1];
    lastTerm.postText = lastTerm.postText.replace(/\s+$/, '');
  }
  return this
};

var _02Change = {
	trim: trim
};

const hasSpace = / /;

//add whitespace to the start of the second bit
const addWhitespace = function(two) {
  let firstWord = two[0];
  if (hasSpace.test(firstWord.preText) === false) {
    firstWord.preText = ' ' + firstWord.preText;
  }
};

//insert this segment into the linked-list
const stitchIn = function(first, two) {
  let end = first[first.length - 1];
  let afterId = end.next;
  //connect ours in ([original] → [ours])
  end.next = two[0].id;
  //stich the end in  ([ours] -> [after])
  two[two.length - 1].next = afterId;
};

//recursively increase the length of all parent phrases
const stretchAll = function(doc, id, len) {
  //find our phrase to stretch
  let phrase = doc.list.find(p => p.hasId(id));
  phrase.length += len;
  if (doc.from) {
    stretchAll(doc.from, id, len);
  }
};

//append one phrase onto another
const joinPhrase = function(first, two, doc) {
  let firstTerms = first.terms();
  let twoTerms = two.terms();
  //spruce-up the whitespace issues
  addWhitespace(twoTerms);
  //insert this segment into the linked-list
  stitchIn(firstTerms, twoTerms);
  //increase the length of our phrases
  stretchAll(doc, firstTerms[0].id, two.length);
  return first
};
var append = joinPhrase;

const hasSpace$1 = / /;

//a new space needs to be added, either on the new phrase, or the old one
// '[new] [◻old]'   -or-   '[old] [◻new] [old]'
const addWhitespace$1 = function(original, newPhrase) {
  //is there a word before our entry-point?
  let term = original.pool.get(original.start);
  if (term.prev) {
    //add our space ahead of our new terms
    let firstWord = newPhrase.terms()[0];
    if (hasSpace$1.test(firstWord.preText) === false) {
      firstWord.preText = ' ' + firstWord.preText;
    }
    return
  }
  //otherwise, add our space to the start of original
  if (hasSpace$1.test(term.preText) === false) {
    term.preText = ' ' + term.preText;
  }
  return
};

//insert this segment into the linked-list
const stitchIn$1 = function(original, newPhrase) {
  // [ours] → [original]
  let newTerms = newPhrase.terms();
  newTerms[newTerms.length - 1].next = original.start;
  //see if there's a word before original
  // [before] → [ours]
  let pool = original.pool;
  let start = pool.get(original.start);
  if (start.prev) {
    let before = pool.get(start.prev);
    before.next = newPhrase.start; //wire it in
  }
};

//recursively increase the length of all parent phrases
const stretchAll$1 = function(doc, original, newPhrase) {
  //find our phrase to stretch
  let phrase = doc.list.find(p => p.hasId(original.start));
  if (phrase === undefined) {
    console.error('compromise error: Prepend missing start - ' + original.start);
    return
  }
  //should we update the phrase's starting?
  if (phrase.start === original.start) {
    phrase.start = newPhrase.start;
  }
  phrase.length += newPhrase.length;
  if (doc.from) {
    stretchAll$1(doc.from, original, newPhrase);
  }
};

//append one phrase onto another
const joinPhrase$1 = function(original, newPhrase, doc) {
  //spruce-up the whitespace issues
  addWhitespace$1(original, newPhrase);
  //insert this segment into the linked-list
  stitchIn$1(original, newPhrase);
  //increase the length of our phrases
  stretchAll$1(doc, original, newPhrase);
  return original
};
var prepend = joinPhrase$1;

/** put this text at the end */
var append_1 = function(phrase, doc) {
  append(this, phrase, doc);
  return this
};

/** add this text to the beginning */
var prepend_1 = function(phrase, doc) {
  prepend(this, phrase, doc);
  return this
};

/**
 * Turn this phrase object into 3 phrase objects
 */
var splitOn = function(p) {
  let terms = this.terms();
  let result = {
    before: null,
    match: null,
    after: null,
  };
  let index = terms.findIndex(t => t.id === p.start);
  if (index === -1) {
    return result
  }
  //make all three sections into phrase-objects
  let start = terms.slice(0, index);
  if (start.length > 0) {
    result.before = this.buildFrom(start[0].id, start.length);
  }
  let match = terms.slice(index, index + p.length);
  if (match.length > 0) {
    result.match = this.buildFrom(match[0].id, match.length);
  }
  let end = terms.slice(index + p.length, terms.length);
  if (end.length > 0) {
    result.after = this.buildFrom(end[0].id, end.length, this.pool);
  }
  return result
};

var _03Split = {
	append: append_1,
	prepend: prepend_1,
	splitOn: splitOn
};

var methods$1 = Object.assign(
  {},
  _01Utils,
  _02Change,
  _03Split
);

//
const failFast = function(terms, regs) {
  for (let i = 0; i < regs.length; i += 1) {
    let reg = regs[i];
    //logical quick-ones
    if (reg.optional !== true) {
      //this is not possible
      if (reg.anything === true && reg.negative === true) {
        return true
      }
      //start/end impossibilites
      if (reg.start === true && i > 0) {
        return true
      }
      if (reg.end === true && i < regs.length - 1) {
        return true
      }
      if (reg.start === true && reg.end === true && terms.length > 1) {
        return true
      }
      //empty choices
      if (reg.choices && reg.choices.length === 0) {
        return true
      }
    }
  }
  return false
};
var _02FailFast = failFast;

//found a match? it's greedy? keep going!
const getGreedy = function(terms, t, reg) {
  for (; t < terms.length; t += 1) {
    if (terms[t].doesMatch(reg) === false) {
      return t
    }
  }
  return t
};

//'unspecific greedy' is a weird situation.
const greedyTo = function(terms, t, nextReg) {
  //if there's no next one, just go off the end!
  if (!nextReg) {
    return terms.length
  }
  //otherwise, we're looking for the next one
  for (; t < terms.length; t += 1) {
    if (terms[t].doesMatch(nextReg) === true) {
      return t
    }
  }
  //guess it doesn't exist, then.
  return null
};

/** tries to match a sequence of terms, starting from here */
const tryHere = function(terms, regs) {
  let captureGroup = [];
  let t = 0;
  // we must satisfy each rule in 'regs'
  for (let r = 0; r < regs.length; r += 1) {
    let reg = regs[r];
    if (!terms[t]) {
      return false
    }

    //support 'unspecific greedy' properly
    if (reg.anything === true && reg.greedy === true) {
      let goto = greedyTo(terms, t, regs[r + 1]);
      if (goto === null) {
        return false //couldn't find it
      }
      t = goto;
      continue
    }

    //looks like a match, continue
    if (reg.anything === true || terms[t].doesMatch(reg) === true) {
      let startAt = t;
      //advance to the next term!
      t += 1;
      //check any ending '$' flags
      if (reg.end === true) {
        //if this isn't the last term, refuse the match
        if (t !== terms.length && reg.greedy !== true) {
          return false
        }
      }
      //try keep it going!
      if (reg.greedy === true) {
        t = getGreedy(terms, t, reg);
      }
      if (reg.capture) {
        captureGroup = terms.slice(startAt, t);
      }
      continue
    }

    //bah, who cares, keep going
    if (reg.optional === true) {
      continue
    }
    // console.log('   ❌\n\n');
    return false
  }
  //we got to the end of the regs, and haven't failed!

  //try to only return our [captured] segment
  if (captureGroup.length > 0) {
    return captureGroup
  }
  //return our result
  return terms.slice(0, t)
};
var _03TryMatch = tryHere;

/* break-down a match expression into this:
{
  normal:'',
  tag:'',
  regex:'',

  start:false,
  end:false,
  negative:false,
  anything:false,
  greedy:false,
  optional:false,

  capture:false,
  choices:[],
}
*/
const end = function(str) {
  return str[str.length - 1]
};
const start = function(str) {
  return str[0]
};
const stripStart = function(str) {
  return str.substr(1)
};
const stripEnd = function(str) {
  return str.substr(0, str.length - 1)
};
const stripBoth = function(str) {
  str = stripStart(str);
  str = stripEnd(str);
  return str
};

//
const token = function(w) {
  let obj = {};

  //collect any flags (do it twice)
  for (let i = 0; i < 2; i += 1) {
    //back-flags
    if (end(w) === '+') {
      obj.greedy = true;
      w = stripEnd(w);
    }
    if (w !== '*' && end(w) === '*') {
      obj.greedy = true;
      w = stripEnd(w);
    }
    if (end(w) === '?') {
      obj.optional = true;
      w = stripEnd(w);
    }
    if (end(w) === '$') {
      obj.end = true;
      w = stripEnd(w);
    }
    //front-flags
    if (start(w) === '^') {
      obj.start = true;
      w = stripStart(w);
    }
    if (start(w) === '!') {
      obj.negative = true;
      w = stripStart(w);
    }
    //wrapped-flags
    if (start(w) === '(' && end(w) === ')') {
      obj.choices = w.split('|');
      //remove '(' and ')'
      obj.choices[0] = stripStart(obj.choices[0]);
      let last = obj.choices.length - 1;
      obj.choices[last] = stripEnd(obj.choices[last]);
      obj.choices = obj.choices.filter(s => s);
      //recursion alert!
      obj.choices = obj.choices.map(token);
      w = '';
    }
    //capture group
    if (start(w) === '[' && end(w) === ']') {
      obj.capture = true;
      w = stripBoth(w);
    }
    //regex
    if (start(w) === '/' && end(w) === '/') {
      w = stripBoth(w);
      obj.regex = new RegExp(w);
      return obj
    }
  }

  //do the actual token content
  if (start(w) === '#') {
    obj.tag = stripStart(w);
    return obj
  }
  if (w === '.') {
    obj.anything = true;
    return obj
  }
  //support alone-astrix
  if (w === '*') {
    obj.anything = true;
    obj.greedy = true;
    obj.optional = true;
    return obj
  }
  if (w) {
    //somehow handle encoded-chars?
    obj.normal = w;
  }
  return obj
};
var parseToken = token;

const isArray$1 = function(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
};

//split-up by (these things)
const byParentheses = function(str) {
  let arr = str.split(/(\(.*?\)[?+*]*)/);
  arr = arr.map(s => s.trim());
  return arr
};

const byWords = function(arr) {
  let words = [];
  arr.forEach(a => {
    //keep brackets lumped together
    if (/^[[^_/]?\(/.test(a[0])) {
      words.push(a);
      return
    }
    let list = a.split(' ');
    list = list.filter(w => w);
    words = words.concat(list);
  });
  return words
};

//turn an array into a 'choices' list
const byArray = function(arr) {
  return [
    {
      choices: arr.map(s => {
        return {
          normal: s,
        }
      }),
    },
  ]
};

/** parse a match-syntax string into json */
const syntax = function(str) {
  //support a flat array of normalized words
  if (typeof str === 'object' && isArray$1(str)) {
    return byArray(str)
  }
  let tokens = byParentheses(str);
  tokens = byWords(tokens);
  tokens = tokens.map(parseToken);
  return tokens
};
var syntax_1 = syntax;

/**  returns a simple array of arrays */
const matchAll = function(p, regs) {
  //if we forgot to parse it..
  if (typeof regs === 'string') {
    regs = syntax_1(regs);
  }

  let terms = p.terms();
  //try to dismiss it, at-once
  if (_02FailFast(terms, regs) === true) {
    return []
  }
  //any match needs to be this long, at least
  const minLength = regs.filter(r => r.optional !== true).length;
  let matches = [];

  //optimisation for '^' start logic
  if (regs[0].start === true) {
    let match = _03TryMatch(terms, regs);
    if (match !== false && match.length > 0) {
      matches.push(match);
    }
    return matches
  }
  //try starting, from every term
  for (let i = 0; i < terms.length; i += 1) {
    // slice may be too short
    if (i + minLength > terms.length) {
      break
    }
    //try it!
    // console.log('- #' + i);
    let match = _03TryMatch(terms.slice(i), regs);
    if (match !== false && match.length > 0) {
      matches.push(match);
      i += match.length - 1; //zoom forward
    }
  }
  return matches
};
var _01MatchAll = matchAll;

/** return anything that doesn't match.
 * returns a simple array of arrays
 */
const notMatch = function(p, regs) {
  let found = {};
  let arr = _01MatchAll(p, regs);
  arr.forEach(ts => {
    ts.forEach(t => {
      found[t.id] = true;
    });
  });
  //return anything not found
  let terms = p.terms();
  let result = [];
  let current = [];
  terms.forEach(t => {
    if (found[t.id] === true) {
      if (current.length > 0) {
        result.push(current);
        current = [];
      }
      return
    }
    current.push(t);
  });
  if (current.length > 0) {
    result.push(current);
  }
  return result
};
var not = notMatch;

/** return an array of matching phrases */
var match_1 = function(str) {
  let matches = _01MatchAll(this, str);
  //make them phrase objects
  matches = matches.map(list => {
    return this.buildFrom(list[0].id, list.length)
  });
  return matches
};

/** remove all matches from the result */
var not$1 = function(str) {
  let matches = not(this, str);
  //make them phrase objects
  matches = matches.map(list => {
    return this.buildFrom(list[0].id, list.length)
  });
  return matches
};

/** return a list of phrases that can have this tag */
var canBe$1 = function(tag, world) {
  let results = [];
  let terms = this.terms();
  let previous = false;
  for (let i = 0; i < terms.length; i += 1) {
    let can = terms[i].canBe(tag, world);
    if (can === true) {
      if (previous === true) {
        //add it to the end
        results[results.length - 1].push(terms[i]);
      } else {
        results.push([terms[i]]); //make a new one
      }
      previous = can;
    }
  }
  //turn them into Phrase objects
  results = results
    .filter(a => a.length > 0)
    .map(arr => {
      return this.buildFrom(arr[0].id, arr.length)
    });
  return results
};

var match = {
	match: match_1,
	not: not$1,
	canBe: canBe$1
};

class Phrase {
  constructor(id, length, pool) {
    this.start = id;
    this.length = length;
    this.isA = 'Phrase'; // easier than .constructor...
    Object.defineProperty(this, 'pool', {
      enumerable: false,
      writable: true,
      value: pool,
    });
  }
}

/** create a new Phrase object from an id and length */
Phrase.prototype.buildFrom = function(id, length) {
  return new Phrase(id, length, this.pool)
};

//apply methods
Object.assign(Phrase.prototype, match);
Object.assign(Phrase.prototype, methods$1);

//apply aliases
const aliases = {
  term: 'terms',
};
Object.keys(aliases).forEach(k => (Phrase.prototype[k] = Phrase.prototype[aliases[k]]));

var Phrase_1 = Phrase;

/** a key-value store of all terms in our Document */
class Pool {
  constructor(words = {}) {
    //quiet this property in console.logs
    Object.defineProperty(this, 'words', {
      enumerable: false,
      value: words,
    });
  }
  /** throw a new term object in */
  add(term) {
    this.words[term.id] = term;
    return this
  }
  /** find a term by it's id */
  get(id) {
    return this.words[id]
  }
  /** helper method */
  stats() {
    return {
      words: Object.keys(this.words).length,
    }
  }
}

/** make a deep-copy of all terms */
Pool.prototype.clone = function() {
  let keys = Object.keys(this.words);
  let words = keys.reduce((h, k) => {
    let t = this.words[k].clone();
    h[t.id] = t;
    return h
  }, {});
  return new Pool(words)
};

var Pool_1 = Pool;

//these are common word shortenings used in the lexicon and sentence segmentation methods
//there are all nouns,or at the least, belong beside one.

//common abbreviations
let compact$1 = {
  Noun: [
    'arc',
    'al',
    'exp',
    'fy',
    'pd',
    'pl',
    'plz',
    'tce',
    'bl',
    'ma',
    'ba',
    'lit',
    'ex',
    'eg',
    'ie',
    'ca',
    'cca',
    'vs',
    'etc',
    'esp',
    'ft',
    //these are too ambiguous
    'bc',
    'ad',
    'md',
    'corp',
    'col',
  ],
  Organization: [
    'dept',
    'univ',
    'assn',
    'bros',
    'inc',
    'ltd',
    'co',
    //proper nouns with exclamation marks
    'yahoo',
    'joomla',
    'jeopardy',
  ],

  Place: [
    'rd',
    'st',
    'dist',
    'mt',
    'ave',
    'blvd',
    'cl',
    'ct',
    'cres',
    'hwy',
    //states
    'ariz',
    'cal',
    'calif',
    'colo',
    'conn',
    'fla',
    'fl',
    'ga',
    'ida',
    'ia',
    'kan',
    'kans',

    'minn',
    'neb',
    'nebr',
    'okla',
    'penna',
    'penn',
    'pa',
    'dak',
    'tenn',
    'tex',
    'ut',
    'vt',
    'va',
    'wis',
    'wisc',
    'wy',
    'wyo',
    'usafa',
    'alta',
    'ont',
    'que',
    'sask',
  ],

  Month: ['jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'sept', 'oct', 'nov', 'dec'],
  Date: ['circa'],

  //Honorifics
  Honorific: [
    'adj',
    'adm',
    'adv',
    'asst',
    'atty',
    'bldg',
    'brig',
    'capt',
    'cmdr',
    'comdr',
    'cpl',
    'det',
    'dr',
    'esq',
    'gen',
    'gov',
    'hon',
    'jr',
    'llb',
    'lt',
    'maj',
    'messrs',
    'mister',
    'mlle',
    'mme',
    'mr',
    'mrs',
    'ms',
    'mstr',
    'op',
    'ord',
    'phd',
    'prof',
    'pvt',
    'rep',
    'reps',
    'res',
    'rev',
    'sen',
    'sens',
    'sfc',
    'sgt',
    'sir',
    'sr',
    'supt',
    'surg',
    //miss
    //misses
  ],
  Value: ['no'],
};

//unpack the compact terms into the misc lexicon..
let abbreviations = {};
const keys = Object.keys(compact$1);
for (let i = 0; i < keys.length; i++) {
  const arr = compact$1[keys[i]];
  for (let i2 = 0; i2 < arr.length; i2++) {
    abbreviations[arr[i2]] = [keys[i], 'Abbreviation'];
  }
}
var abbreviations_1 = abbreviations;

//(Rule-based sentence boundary segmentation) - chop given text into its proper sentences.
// Ignore periods/questions/exclamations used in acronyms/abbreviations/numbers, etc.
// @spencermountain 2017 MIT
const abbreviations$1 = Object.keys(abbreviations_1);

//regs-
const abbrev_reg = new RegExp(
  '\\b(' + abbreviations$1.join('|') + ')[.!?\u203D\u2E18\u203C\u2047-\u2049] *$',
  'i'
);
const acronym_reg = /[ .][A-Z]\.? *$/i;
const ellipses_reg = /(?:\u2026|\.{2,}) *$/;

// Match different formats of new lines. (Mac: \r, Linux: \n, Windows: \r\n)
const new_line = /((?:\r?\n|\r)+)/;
const naiive_sentence_split = /(\S.+?[.!?\u203D\u2E18\u203C\u2047-\u2049])(?=\s+|$)/g;

const letter_regex = /[a-z]/i;
const not_ws_regex = /\S/;
const startWhitespace = /^\W+/;

// Start with a regex:
const naiive_split = function(text) {
  let all = [];
  //first, split by newline
  let lines = text.split(new_line);
  for (let i = 0; i < lines.length; i++) {
    //split by period, question-mark, and exclamation-mark
    let arr = lines[i].split(naiive_sentence_split);
    for (let o = 0; o < arr.length; o++) {
      all.push(arr[o]);
    }
  }
  return all
};

const splitSentences = function(text) {
  text = text || '';
  text = String(text);
  let sentences = [];
  // First do a greedy-split..
  let chunks = [];
  // Ensure it 'smells like' a sentence
  if (!text || typeof text !== 'string' || not_ws_regex.test(text) === false) {
    return sentences
  }
  // Start somewhere:
  let splits = naiive_split(text);
  // Filter-out the crap ones
  for (let i = 0; i < splits.length; i++) {
    let s = splits[i];
    if (s === undefined || s === '') {
      continue
    }
    //this is meaningful whitespace
    if (not_ws_regex.test(s) === false) {
      //add it to the last one
      if (chunks[chunks.length - 1]) {
        chunks[chunks.length - 1] += s;
        continue
      } else if (splits[i + 1]) {
        //add it to the next one
        splits[i + 1] = s + splits[i + 1];
        continue
      }
    }
    //else, only whitespace, no terms, no sentence
    chunks.push(s);
  }

  //detection of non-sentence chunks:
  //loop through these chunks, and join the non-sentence chunks back together..
  for (let i = 0; i < chunks.length; i++) {
    let c = chunks[i];
    //should this chunk be combined with the next one?
    if (
      chunks[i + 1] &&
      letter_regex.test(c) &&
      (abbrev_reg.test(c) || acronym_reg.test(c) || ellipses_reg.test(c))
    ) {
      chunks[i + 1] = c + (chunks[i + 1] || '');
    } else if (c && c.length > 0 && letter_regex.test(c)) {
      //this chunk is a proper sentence..
      sentences.push(c);
      chunks[i] = '';
    }
  }
  //if we never got a sentence, return the given text
  if (sentences.length === 0) {
    return [text]
  }

  //move whitespace to the ends of sentences, when possible
  //['hello',' world'] -> ['hello ','world']
  for (let i = 1; i < sentences.length; i += 1) {
    let ws = sentences[i].match(startWhitespace);
    if (ws !== null) {
      sentences[i - 1] += ws[0];
      sentences[i] = sentences[i].replace(startWhitespace, '');
    }
  }
  return sentences
};

var _01Sentences = splitSentences;

const wordlike = /\S/;
const isBoundary = /^[!?.]+$/;

const notWord = {
  '.': true,
  '-': true, //dash
  '–': true, //en-dash
  '—': true, //em-dash
  '--': true,
  '...': true,
};

const hasHyphen = function(str) {
  //dont split 're-do'
  if (/^(re|un)-?[^aeiou]./.test(str) === true) {
    return false
  }
  //letter-number
  let reg = /^([a-z`"'/]+)(-|–|—)([a-z0-9].*)/i;
  if (reg.test(str) === true) {
    return true
  }
  //support weird number-emdash combo '2010–2011'
  let reg2 = /^([0-9]+)(–|—)([0-9].*)/i;
  if (reg2.test(str)) {
    return true
  }
  return false
};

//support splitting terms like "open/closed"
const hasSlash = function(word) {
  const reg = /[a-z]\/[a-z]/;
  if (reg.test(word)) {
    //only one slash though
    if (word.split(/\//g).length === 2) {
      return true
    }
  }
  return false
};

//turn a string into an array of terms (naiive for now, lumped later)
const splitWords = function(str) {
  let result = [];
  let arr = [];
  //start with a naiive split
  str = str || '';
  if (typeof str === 'number') {
    str = String(str);
  }
  const firstSplit = str.split(/(\S+)/);
  for (let i = 0; i < firstSplit.length; i++) {
    const word = firstSplit[i];
    if (hasHyphen(word) === true) {
      //support multiple-hyphenated-terms
      const hyphens = word.split(/[-–—]/);
      for (let o = 0; o < hyphens.length; o++) {
        if (o === hyphens.length - 1) {
          arr.push(hyphens[o]);
        } else {
          arr.push(hyphens[o] + '-');
        }
      }
    } else if (hasSlash(word) === true) {
      const slashes = word.split(/\//);
      arr.push(slashes[0]);
      arr.push('/' + slashes[1]);
    } else {
      arr.push(word);
    }
  }
  //greedy merge whitespace+arr to the right
  let carry = '';
  for (let i = 0; i < arr.length; i++) {
    //if it's more than a whitespace
    if (
      wordlike.test(arr[i]) === true &&
      notWord.hasOwnProperty(arr[i]) === false &&
      isBoundary.test(arr[i]) === false
    ) {
      result.push(carry + arr[i]);
      carry = '';
    } else {
      carry += arr[i];
    }
  }
  //handle last one
  if (carry && result.length > 0) {
    result[result.length - 1] += carry; //put it on the end
  }
  return result
};
var _02Words = splitWords;

//add forward/backward 'linked-list' prev/next ids
const addLinks = terms => {
  terms.forEach((term, i) => {
    if (i > 0) {
      term.prev = terms[i - 1].id;
    }
    if (terms[i + 1]) {
      term.next = terms[i + 1].id;
    }
  });
};

/** turn a string into an array of Phrase objects */
const fromText = function(text = '', pool) {
  //tokenize into words
  let sentences = _01Sentences(text);
  sentences = sentences.map(str => _02Words(str));

  //turn them into proper objects
  pool = pool || new Pool_1();
  let phrases = sentences.map(terms => {
    terms = terms.map(str => {
      let term = new Term_1(str);
      pool.add(term);
      return term
    });

    //add next/previous ids
    addLinks(terms);

    //return phrase objects
    return new Phrase_1(terms[0].id, terms.length, pool)
  });
  //return them ready for a Document object
  return phrases
};

/** create a word-pool and Phrase objects from .json() results*/
const fromJSON = function(data) {
  let pool = new Pool_1();
  //create Phrase objects
  let phrases = data.map(terms => {
    //create Term objects
    terms = terms.map(obj => {
      let term = new Term_1(obj.text);
      term.preText = obj.preText;
      term.postText = obj.postText;
      term.tags = obj.tags.reduce((h, tag) => {
        h[tag] = true;
        return h
      }, {});
      pool.add(term);
      return term
    });
    //add prev/next links
    addLinks(terms);
    return new Phrase_1(terms[0].id, terms.length, pool)
  });
  return phrases
};

var tokenizer = {
  fromText,
  fromJSON,
};

var author = "Spencer Kelly <spencermountain@gmail.com> (http://spencermounta.in)";
var name = "compromise";
var description = "natural language processing in the browser";
var version = "11.12.0";
var main = "./builds/compromise.js";
var types = "./compromise.d.ts";
var repository = {
	type: "git",
	url: "git://github.com/nlp-compromise/compromise.git"
};
var scripts = {
	build: "rollup -c",
	coverage: "node ./scripts/postpublish/coverage.js",
	pack: "node ./scripts/pack.js",
	"test:spec": "tape \"./tests/**/*.test.js\" | tap-spec",
	"test:types": "tsc --project test/types",
	test: "tape \"./tests/**/*.test.js\" | tap-dancer",
	testb: "TESTENV=prod tape \"./tests/**/*.test.js\" | tap-spec",
	watch: "amble ./scratch.js"
};
var files = [
	"builds/",
	"docs/",
	"compromise.d.ts"
];
var prettier = {
	trailingComma: "es5",
	tabWidth: 2,
	semi: false,
	singleQuote: true,
	printWidth: 100
};
var dependencies = {
	"efrt-unpack": "2.0.3"
};
var devDependencies = {
	"@babel/core": "7.4.5",
	"@babel/preset-env": "7.4.5",
	amble: "0.0.7",
	chalk: "2.4.2",
	"compromise-plugin": "0.0.8",
	"rollup-plugin-babel": "^4.3.3",
	"rollup-plugin-commonjs": "^10.0.0",
	"rollup-plugin-json": "^4.0.0",
	"rollup-plugin-node-resolve": "^5.1.0",
	"rollup-plugin-terser": "^5.0.0",
	"tap-dancer": "0.2.0",
	tape: "4.10.2"
};
var eslintIgnore = [
	"builds/*.js"
];
var license = "MIT";
var _package = {
	author: author,
	name: name,
	description: description,
	version: version,
	main: main,
	types: types,
	repository: repository,
	scripts: scripts,
	files: files,
	prettier: prettier,
	dependencies: dependencies,
	devDependencies: devDependencies,
	eslintIgnore: eslintIgnore,
	license: license
};

var _package$1 = /*#__PURE__*/Object.freeze({
	author: author,
	name: name,
	description: description,
	version: version,
	main: main,
	types: types,
	repository: repository,
	scripts: scripts,
	files: files,
	prettier: prettier,
	dependencies: dependencies,
	devDependencies: devDependencies,
	eslintIgnore: eslintIgnore,
	license: license,
	'default': _package
});

var _data=`{"words":"Comparative¦better|Superlative¦earlier|PresentTense¦sounds|Value¦a few|Noun¦autumn,daylight9eom,here,no doubt,one d8s5t2w0yesterd8;eek0int5;d6end;mr1o0;d4morrow;!w;ome 1tandard3umm0;er;d0point;ay; time|Copula¦a1is,w0;as,ere;m,re|Condition¦if,unless|PastTense¦be2came,d1had,mea0sa1taken,we0;nt;id;en,gan|Gerund¦accord0be0develop0go0result0stain0;ing|Negative¦n0;ever,o0;!n,t|QuestionWord¦how3wh0;at,e1ich,o0y;!m,se;n,re; come,'s|Singular¦a05bYcTdPeNfKgJhFici09jel06kitty,lEmCnBoAp7question mark,r6s4t1us 0;dollUstV; rex,a1h0ic,ragedy,v show;ere,i06;l02x return;ky,tu0uper bowl,yst05;dIff;alZi02oom;a1robl02u0;dCrpo8;rt,tE;cean,thers;othiXumbG;ayfTeeNo0;del,nopoS;iRunch;ead start,o0;lPme1u0;se;! run;adfMirlIlaci8od,rand slam,ulM;amiLly,olLr1un0;diN;iGosD;conomy,gg,ner3v0xampG;ent;eath,inn2o0ragonfG;cument6g0iFlFor;gy;er;an3eiliFhocol2i0ottage,redit card;ty,vil w0;ar;ate;ary;ankiAel7les9o2reakfast,u0;n0tterf6;ti8;dy,tt2y0;fri0;end;le;d1l0noma0;ly; homin2verti0;si0;ng;em|Infinitive¦0:6Y;1:7C;2:7A;3:79;4:5F;5:74;6:6D;7:6L;8:78;9:6W;A:73;B:76;C:6R;D:68;E:7D;F:60;a6Qb69c5Bd4Je43f3Qg3Jh3Ci2Zj2Xk2Tl2Km2Bn28o24p1Pques3Rr0Xs05tWuRvOwHyG;awn,ield;aJe24hist7iIoGre6H;nd0rG;k,ry;n,pe,sh,th0;lk,nHrGsh,tCve;n,raE;d0t;aHiGo8;ew,sA;l6Rry;nHpGr3se;gra4Wli49;dGi8lo65;erGo;go,mi5H;aNeMhKie,oJrHuGwi5;ne,rn;aGe0Ui60u5y;de,in,nsf0p,v5O;r37uC;ank,rG;eat2Vi2;nd,st;ke,lk,rg5Os8;a06c03eZhWi4Jkip,lVmUneTo56pQtJuGwitC;bmAck,ff0gge5ppHrGspe6;ge,pri1rou53vi2;ly,o3D;aLeKoJrHuG;dy,mb7;aDeGi2;ngth2Lss,tC;p,re;m,p;in,ke,r0Yy;iHlaFoil,rinG;g,k7;n,t;ak,e3E;aFe22i7o5B;am,e1Qip;aHiv0oG;ck,ut;re,ve;arCeIle6nHr2tG;!t7;d,se;k,m;aHo4rG;atCew;le,re;il,ve;a05eIisk,oHuG;b,in,le,n,sh;am,ll;a01cZdu9fYgXje6lUmTnt,pQquPsKtJvGwa5V;eGiew,o4U;al,l,rG;se,t;aDi4u42;eJi5oItG;!o4rG;i6uc20;l2rt;mb7nt,r2;e5i4;air,eHlGo40reseE;a9y;at;aDemb0i3Wo2;aHeGi2y;a1nt;te,x;a5Dr4A;act1Yer,le6u1;a12ei2k5PoGyc7;gni2Cnci7rd;ch,li2Bs5N;i1nG;ge,k;aTerSiRlPoNrIuG;b21ll,mp,rGsh,t;cha1s4Q;ai1eJiEoG;cHdu9greBhibAmi1te5vG;e,i2U;eBlaim;di6pa4ss,veE;iEp,rtr43sGur;e,t;a3RuG;g,n3;ck,le;fo32mAsi5;ck,iErt4Mss,u1y;bIccur,ff0pera8utweHverGwe;co47lap,ta3Qu1whelm;igh;ser2taD;eHotG;e,i9;ed,gle6;aLeKiIoHuG;ltip3Frd0;nit14ve;nGrr13;d,g7us;asu4lt,n0Qr3ssa3;intaDke d40na3rHtG;ch,t0;ch,k39ry;aMeLiIoGu1F;aGck,ok,ve;d,n;ft,ke,mAnHstGve;!en;e,k;a2Gc0Ht;b0Qck,uG;gh,nC;eIiHnoG;ck,w;ck,ll,ss;ep;am,oDuG;d3mp;gno4mQnGss3I;cOdica8flu0NhNsKtIvG;eGol2;nt,st;erGrodu9;a6fe4;i5tG;aGru6;ll;abAibA;lu1Fr1D;agi22pG;lemeEo20ro2;aKeIi4oHuG;nt,rry;ld fa5n03pe,st;aGlp;d,t;nd7ppGrm,te;en;aLet,loBoKrIuG;arGeBi14;ant39d;aGip,ow,umb7;b,sp;es,ve1I;in,th0ze;aQeaPiNlLoIracHuncG;ti3I;tu4;cus,lHrG;ce,eca5m,s30;d,l22;aFoG;at,od,w;gu4lGniFx;e,l;r,tu4;il,ll,vG;or;a13cho,dAle6mSnPstNvalua8xG;a0AcLerKi5pGte16;a15eHlaDoGreB;rt,se;ct,riG;en9;ci1t;el,han3;abGima8;liF;ab7couXdHfor9ga3han9j03riCsu4t0vG;isi2Vy;!u4;body,er3pG;hasiGow0;ze;a06eUiMoLrHuG;mp;aIeHiGop;ft;am,ss;g,in;!d3ubt;e,ff0p,re6sHvG;e,iXor9;aJcGli13miBpl18tinguiF;oGuB;uGv0;ra3;gr1YppG;ear,ro2;al,cNem,fLliv0ma0Cny,pKsHterG;mi0D;cribe,er2iHtrG;oy;gn,re;a08e07i6osA;eGi08y;at,ct;iIlHrG;ea1;a4i04;de;ma3n9re,te;a0Ae09h06i8l03oJrGut;aHeGoBuFy;a8dA;ck,ve;llYmSnHok,py,uGv0;gh,nt;cePdu6fMsKtIvG;eGin9;rt,y;aDin0XrG;a5ibu8ol;iGtitu8;d0st;iHoGroE;rm;gu4rm;rn;biKe,foJmaIpG;a4laD;re;nd;rt;ne;ap1e6;aHiGo1;ng,p;im,w;aHeG;at,ck,w;llen3n3r3se;a1nt0;ll,ncHrGt0u1;e,ry;el;aUeQloPoNrKuG;dgIlHrG;n,y;ly;et;aHuF;sh;ke;a5mb,o5rrGth0un9;ow;ck;ar,coSgDlHnefAtrG;ay;ie2ong;in;nGse;!g;band0Jc0Bd06ffo05gr04id,l01mu1nYppTrQsKttGvoid,waA;acIeHra6;ct;m0Fnd;h,k;k,sG;eIiHocia8uG;me;gn,st;mb7rt;le;chHgGri2;ue;!i2;eaJlIroG;aCve;ch;aud,y;l,r;noun9sw0tG;icipa8;ce;lHt0;er;e3ow;ee;rd;aRdIju5mAoR;it;st;!reB;ss;cJhie2knowled3tiva8;te;ge;ve;eIouEu1;se;nt;pt;on|Actor¦aJbGcFdCengineIfAgardenIh9instructPjournalLlawyIm8nurse,opeOp5r3s1t0;echnCherapK;ailNcientJoldiGu0;pervKrgeon;e0oofE;ceptionGsearC;hotographClumbColi1r0sychologF;actitionBogrammB;cem6t5;echanic,inist9us4;airdress8ousekeep8;arm7ire0;fight6m2;eputy,iet0;ici0;an;arpent2lerk;ricklay1ut0;ch0;er;ccoun6d2ge7r0ssis6ttenda7;chitect,t0;ist;minist1v0;is1;rat0;or;ta0;nt|Honorific¦aObrigadiNcHdGexcellency,fiBking,liDmaAofficNp6queen,r3s0taoiseach,vice5;e0ultJ;c0rgeaC;ond liAretary;abbi,e0;ar0verend; adJ;astFr0;eside6i0ofessE;me ministEnce0;!ss;gistrate,r4yB;eld mar3rst l0;ady,i0;eutena0;nt;shA;oct5utchess;aptain,hance3o0;lonel,mmand4ngress0unci2;m0wom0;an;ll0;or;er;d0yatullah;mir0;al|SportsTeam¦0:1A;1:1H;2:1G;a1Eb16c0Td0Kfc dallas,g0Ihouston 0Hindiana0Gjacksonville jagua0k0El0Bm01newToQpJqueens parkIreal salt lake,sAt5utah jazz,vancouver whitecaps,w3yW;ashington 3est ham0Rh10;natio1Oredski2wizar0W;ampa bay 6e5o3;ronto 3ttenham hotspur;blue ja0Mrapto0;nnessee tita2xasC;buccanee0ra0K;a7eattle 5heffield0Kporting kansas0Wt3;. louis 3oke0V;c1Frams;marine0s3;eah15ounG;cramento Rn 3;antonio spu0diego 3francisco gJjose earthquak1;char08paA; ran07;a8h5ittsburgh 4ortland t3;imbe0rail blaze0;pirat1steele0;il3oenix su2;adelphia 3li1;eagl1philNunE;dr1;akland 3klahoma city thunder,rlando magic;athle0Mrai3;de0; 3castle01;england 7orleans 6york 3;city fc,g4je0FknXme0Fred bul0Yy3;anke1;ian0D;pelica2sain0C;patrio0Brevolut3;ion;anchester Be9i3ontreal impact;ami 7lwaukee b6nnesota 3;t4u0Fvi3;kings;imberwolv1wi2;rewe0uc0K;dolphi2heat,marli2;mphis grizz3ts;li1;cXu08;a4eicesterVos angeles 3;clippe0dodDla9; galaxy,ke0;ansas city 3nE;chiefs,roya0E; pace0polis colU;astr06dynamo,rockeTtexa2;olden state warrio0reen bay pac3;ke0;.c.Aallas 7e3i05od5;nver 5troit 3;lio2pisto2ti3;ge0;broncZnuggeM;cowbo4maver3;ic00;ys; uQ;arCelKh8incinnati 6leveland 5ol3;orado r3umbus crew sc;api5ocki1;brow2cavalie0india2;bengaWre3;ds;arlotte horAicago 3;b4cubs,fire,wh3;iteB;ea0ulR;diff3olina panthe0; c3;ity;altimore 9lackburn rove0oston 5rooklyn 3uffalo bilN;ne3;ts;cel4red3; sox;tics;rs;oriol1rave2;rizona Ast8tlanta 3;brav1falco2h4u3;nited;aw9;ns;es;on villa,r3;os;c5di3;amondbac3;ks;ardi3;na3;ls|Uncountable¦0:1C;a1Hb1Bc12e0Wf0Qg0Mh0Gi0Dj0Cknowled1Gl07mYnXoWpRrOsCt8vi7w1;a5ea0Ai4o1;o2rld1;! seI;d,l;ldlife,ne;rmth,t0;neg0Xol08;e3hund0ime,oothpaste,r1una;affRou1;ble,sers,t;a,nnis;aAcene07e9h8il7now,o6p3te2u1;g0Rnshi0L;am,el;ace2e1;ciOed;!c12;ap,cc0ft0B;k,v0;eep,opp0O;riJ;d07fe0Wl1nd;m0Qt;ain,e1i0W;c1laxa0Csearch;ogni0Brea0B;a4e2hys0Elast9o1ress00;rk,w0;a1pp0trol;ce,nR;p0tiK;il,xygen;ews,oi0C;a7ea5i4o3u1;mps,s1;ic;nHo08;lk,st;sl1t;es;chine1il,themat00; learn02ry;aught0e3i2u1;ck,g07;ghtnZqu0CteratI;a1isH;th0;ewel7usti08;ce,mp1nformaOtself;ati1ortan06;en05;a4isto3o1;ck1mework,n1spitali01;ey;ry;ir,lib1ppi9;ut;o2r1um,ymnastJ;a7ound;l1ssip;d,f;i5lour,o2ruit,urnit1;ure;od,rgive1wl;ne1;ss;c6sh;conom9duca5lectriciMn3quip4th9very1;body,o1thB;ne;joy1tertain1;ment;tiC;a8elcius,h4iv3loth6o1urrency;al,ffee,ld w1nfusiAttA;ar;ics;aos,e1;e2w1;ing;se;ke,sh;a3eef,is2lood,read,utt0;er;on;g1ss;ga1;ge;c4dvi3irc2mnes1rt;ty;raft;ce;id|Unit¦0:17;a12b10c0Md0Le0Jf0Fg0Bh08in07joule0k01lZmOnNoMpIqHsqCt7volts,w6y4z3°2µ1;g,s;c,f,n;b,e2;a0Lb,d0Rears old,o1;tt0F;att0b;able4b3e2on1sp;!ne0;a2r0B;!l,sp;spo03; ft,uare 1;c0Gd0Ff3i0Dkilo0Hm1ya0C;e0Kil1;e0li0F;eet0o0B;t,uart0;a3e2i1ou0Nt;c0Knt0;rcent,t00;!scals;hms,uVz;an0GewtR;/s,b,e7g,i3l,m2p1²,³;h,s;!²;!/h,cro3l1;e1li05;! DsC²;g05s0A;gPter1;! 2s1;! 1;per second;b,iZm,u1x;men0x0;b,elvin0g,ilo2m1nQ;!/h,ph,²;byYgWmeter1;! 2s1;! 1;per hour;²,³;e1g,z;ct1rtz0;aWogP;al2b,ig9ra1;in0m0;!l1;on0;a3emtOl1tG; oz,uid ou1;nce0;hrenheit0rad0;b,x1;abyH;eciCg,l,mA;arat0eAg,l,m9oulomb0u1;bic 1p0;c5d4fo3i2meAya1;rd0;nch0;ot0;eci2;enti1;me4;!²,³;lsius0nti1;g2li1me1;ter0;ram0;bl,y1;te0;c4tt1;os1;eco1;nd0;re0;!s|Pronoun¦'em,elle,h4i3me,ourselves,she5th1us,we,you0;!rself;e0ou;m,y;!l,t;e0im;!'s|Organization¦0:44;a39b2Qc2Ad22e1Yf1Ug1Mh1Hi1Ej1Ak18l14m0Tn0Go0Dp07qu06rZsStFuBv8w3y1;amaha,m0You1w0Y;gov,tu2R;a3e1orld trade organizati3Z;lls fargo,st1;fie23inghou17;l1rner br3B;-m12gree30l street journ25m12;an halNeriz3Uisa,o1;dafo2Gl1;kswagLvo;bs,kip,n2ps,s1;a tod2Qps;es33i1;lev2Wted natio2T; mobi2Jaco bePd bMeAgi frida9h3im horto2Smz,o1witt2V;shiba,y1;ota,s r Y;e 1in lizzy;b3carpen31daily ma2Vguess w2holli0rolling st1Ns1w2;mashing pumpki2Nuprem0;ho;ea1lack eyed pe3Dyrds;ch bo1tl0;ys;l2s1;co,la m13;efoni08us;a6e4ieme2Fnp,o2pice gir5ta1ubaru;rbucks,to2L;ny,undgard1;en;a2Px pisto1;ls;few24insbu25msu1W;.e.m.,adiohead,b6e3oyal 1yan2V;b1dutch she4;ank;/max,aders dige1Ed 1vl30;bu1c1Thot chili peppe2Ilobst27;ll;c,s;ant2Tizno2D;an5bs,e3fiz23hilip morrBi2r1;emier25octer & gamb1Qudenti14;nk floyd,zza hut;psi26tro1uge09;br2Ochina,n2O; 2ason1Wda2E;ld navy,pec,range juli2xf1;am;us;aAb9e5fl,h4i3o1sa,wa;kia,tre dame,vart1;is;ke,ntendo,ss0L;l,s;c,stl3tflix,w1; 1sweek;kids on the block,york09;e,é;a,c;nd1Rs2t1;ional aca2Co,we0P;a,cYd0N;aAcdonald9e5i3lb,o1tv,yspace;b1Knsanto,ody blu0t1;ley crue,or0N;crosoft,t1;as,subisO;dica3rcedes2talli1;ca;!-benz;id,re;'s,s;c's milk,tt11z1V;'ore08a3e1g,ittle caesa1H;novo,x1;is,mark; pres5-z-boy,bour party;atv,fc,kk,m1od1H;art;iffy lu0Jo3pmorgan1sa;! cha1;se;hnson & johns1Py d1O;bm,hop,n1tv;g,te1;l,rpol; & m,asbro,ewlett-packaSi3o1sbc,yundai;me dep1n1G;ot;tac1zbollah;hi;eneral 6hq,l5mb,o2reen d0Gu1;cci,ns n ros0;ldman sachs,o1;dye1g09;ar;axo smith kliYencore;electr0Gm1;oto0S;a3bi,da,edex,i1leetwood mac,oFrito-l08;at,nancial1restoU; tim0;cebook,nnie mae;b04sa,u3xxon1; m1m1;ob0E;!rosceptics;aiml08e5isney,o3u1;nkin donuts,po0Tran dur1;an;j,w j1;on0;a,f leppa2ll,peche mode,r spiegXstiny's chi1;ld;rd;aEbc,hBi9nn,o3r1;aigsli5eedence clearwater reviv1ossra03;al;ca c5l4m1o08st03;ca2p1;aq;st;dplLgate;ola;a,sco1tigroup;! systems;ev2i1;ck fil-a,na daily;r0Fy;dbury,pital o1rl's jr;ne;aFbc,eBf9l5mw,ni,o1p,rexiteeV;ei3mbardiJston 1;glo1pizza;be;ng;ack & deckFo2ue c1;roW;ckbuster video,omingda1;le; g1g1;oodriM;cht3e ge0n & jer2rkshire hathaw1;ay;ryG;el;nana republ3s1xt5y5;f,kin robbi1;ns;ic;bWcRdidQerosmith,ig,lKmEnheuser-busDol,pple9r6s3t&t,v2y1;er;is,on;hland1sociated F; o1;il;by4g2m1;co;os; compu2bee1;'s;te1;rs;ch;c,d,erican3t1;!r1;ak; ex1;pre1;ss; 4catel2t1;air;!-luce1;nt;jazeera,qae1;da;as;/dc,a3er,t1;ivisi1;on;demy of scienc0;es;ba,c|Demonym¦0:16;1:13;a0Wb0Nc0Cd0Ae09f07g04h02iYjVkTlPmLnIomHpDqatari,rBs7t5u4v3wel0Rz2;am0Fimbabwe0;enezuel0ietnam0H;g9krai1;aiwThai,rinida0Iu2;ni0Qrkmen;a4cot0Ke3ingapoOlovak,oma0Tpa05udRw2y0X;edi0Kiss;negal0Br08;mo0uU;o6us0Lw2;and0;a3eru0Hhilipp0Po2;li0Ertugu06;kist3lesti1na2raguay0;ma1;ani;amiZi2orweP;caragu0geri2;an,en;a3ex0Mo2;ngo0Erocc0;cedo1la2;gasy,y08;a4eb9i2;b2thua1;e0Dy0;o,t02;azakh,eny0o2uwaiti;re0;a2orda1;ma0Bp2;anN;celandic,nd4r2sraeli,ta02vo06;a2iT;ni0qi;i0oneV;aiDin2ondur0unN;di;amDe2hanai0reek,uatemal0;or2rm0;gi0;i2ren7;lipino,n4;cuadoVgyp6ngliJsto1thiopi0urope0;a2ominXut4;niH;a9h6o4roa3ub0ze2;ch;ti0;lom2ngol5;bi0;a6i2;le0n2;ese;lifor1m2na3;bo2eroo1;di0;angladeshi,el8o6r3ul2;gaG;aziBi2;ti2;sh;li2s1;vi0;aru2gi0;si0;fAl7merBngol0r5si0us2;sie,tr2;a2i0;li0;gent2me1;ine;ba1ge2;ri0;ni0;gh0r2;ic0;an|Region¦a20b1Sc1Id1Des1Cf19g13h10i0Xj0Vk0Tl0Qm0FnZoXpSqPrMsDtAut9v5w2y0zacatec22;o05u0;cat18kZ;a0est vir4isconsin,yomi14;rwick1Qshington0;! dc;er2i0;cto1Ir0;gin1R;acruz,mont;ah,tar pradesh;a1e0laxca1Cusca9;nnessee,x1Q;bas0Jmaulip1PsmI;a5i3o1taf0Nu0ylh12;ffUrrZs0X;me0Zno19uth 0;cRdQ;ber1Hc0naloa;hu0Rily;n1skatchew0Qxo0;ny; luis potosi,ta catari1H;a0hode6;j0ngp01;asth0Lshahi;inghai,u0;e0intana roo;bec,ensVreta0D;ara3e1rince edward0; isT;i,nnsylv0rnambu01;an13;!na;axa0Mdisha,h0klaho1Antar0reg3x03;io;ayarit,eAo2u0;evo le0nav0K;on;r0tt0Qva scot0W;f5mandy,th0; 0ampton0P;c2d1yo0;rk0N;ako0X;aroli0U;olk;bras0Wva00w0; 1foundland0;! and labrador;brunswick,hamp0Gjers0mexiIyork state;ey;a5i1o0;nta0Mrelos;ch2dlanAn1ss0;issippi,ouri;as geraFneso0L;igPoacP;dhya,harasht03ine,ni2r0ssachusetts;anhao,y0;land;p0toba;ur;anca03e0incoln03ouis7;e0iG;ds;a0entucky,hul09;ns07rnata0Cshmir;alis0iangxi;co;daho,llino1nd0owa;ia04;is;a1ert0idalDun9;fordS;mpRwaii;ansu,eorgVlou4u0;an1erre0izhou,jarat;ro;ajuato,gdo0;ng;cesterL;lori1uji0;an;da;sex;e3o1uran0;go;rs0;et;lawaDrbyC;a7ea6hi5o0umbrG;ahui3l2nnectic1rsi0ventry;ca;ut;iLorado;la;apDhuahua;ra;l7m0;bridge2peche;a4r3uck0;ingham0;shi0;re;emen,itish columb2;h1ja cal0sque,var1;iforn0;ia;guascalientes,l3r0;izo1kans0;as;na;a1ber0;ta;ba1s0;ka;ma|Possessive¦anyAh5its,m3noCo1sometBthe0yo1;ir1mselves;ur0;!s;i8y0;!se4;er1i0;mse2s;!s0;!e0;lf;o1t0;hing;ne|Currency¦$,aud,bRcPdKeurJfIgbp,hkd,inr,jpy,kGlEp8r7s3usd,x2y1z0¢,£,¥,ден,лв,руб,฿,₡,₨,€,₭,﷼;lotyRł;en,uanQ;af,of;h0t5;e0il5;k0q0;elL;iel,oubleKp,upeeK;e2ound st0;er0;lingH;n0soG;ceFn0;ies,y;e0i7;i,mpi6;n,r0wanzaByatB;!onaAw;ori7ranc9;!o8;en3i2kk,o0;b0ll2;ra5;me4n0rham4;ar3;ad,e0ny;nt1;aht,itcoin0;!s|Country¦0:38;1:2L;a2Wb2Dc21d1Xe1Rf1Lg1Bh19i13j11k0Zl0Um0Gn05om3CpZqat1JrXsKtCu6v4wal3yemTz2;a24imbabwe;es,lis and futu2X;a2enezue31ietnam;nuatu,tican city;.5gTkraiZnited 3ruXs2zbeE;a,sr;arab emirat0Kkingdom,states2;! of am2X;k.,s.2; 27a.;a7haBimor-les0Bo6rinidad4u2;nis0rk2valu;ey,me2Xs and caic1T; and 2-2;toba1J;go,kel0Ynga;iw2Vji2nz2R;ki2T;aCcotl1eBi8lov7o5pa2Bri lanka,u4w2yr0;az2ed9itzerl1;il1;d2Qriname;lomon1Vmal0uth 2;afr2IkLsud2O;ak0en0;erra leoEn2;gapo1Wt maart2;en;negKrb0ychellY;int 2moa,n marino,udi arab0;hele24luc0mart1Z;epublic of ir0Com2Cuss0w2;an25;a3eHhilippinTitcairn1Ko2uerto riM;l1rtugE;ki2Bl3nama,pua new0Tra2;gu6;au,esti2;ne;aAe8i6or2;folk1Gth3w2;ay; k2ern mariana1B;or0M;caragua,ger2ue;!ia;p2ther18w zeal1;al;mib0u2;ru;a6exi5icro09o2yanm04;ldova,n2roc4zamb9;a3gol0t2;enegro,serrat;co;c9dagascZl6r4urit3yot2;te;an0i14;shall0Vtin2;ique;a3div2i,ta;es;wi,ys0;ao,ed00;a5e4i2uxembourg;b2echtenste10thu1E;er0ya;ban0Gsotho;os,tv0;azakh1De2iriba02osovo,uwait,yrgyz1D;eling0Jnya;a2erF;ma15p1B;c6nd5r3s2taly,vory coast;le of m19rael;a2el1;n,q;ia,oI;el1;aiSon2ungary;dur0Mg kong;aAermany,ha0Pibralt9re7u2;a5ern4inea2ya0O;!-biss2;au;sey;deloupe,m,tema0P;e2na0M;ce,nl1;ar;bTmb0;a6i5r2;ance,ench 2;guia0Dpoly2;nes0;ji,nl1;lklandTroeT;ast tim6cu5gypt,l salv5ngl1quatorial3ritr4st2thiop0;on0; guin2;ea;ad2;or;enmark,jibou4ominica3r con2;go;!n B;ti;aAentral african 9h7o4roat0u3yprQzech2; 8ia;ba,racao;c3lo2morPngo-brazzaville,okFsta r03te d'ivoiK;mb0;osD;i2ristmasF;le,na;republic;m2naTpe verde,yman9;bod0ero2;on;aFeChut00o8r4u2;lgar0r2;kina faso,ma,undi;azil,itish 2unei;virgin2; is2;lands;liv0nai4snia and herzegoviGtswaGuvet2; isl1;and;re;l2n7rmuF;ar2gium,ize;us;h3ngladesh,rbad2;os;am3ra2;in;as;fghaFlCmAn5r3ustr2zerbaijH;al0ia;genti2men0uba;na;dorra,g4t2;arct6igua and barbu2;da;o2uil2;la;er2;ica;b2ger0;an0;ia;ni2;st2;an|City¦a2Wb26c1Wd1Re1Qf1Og1Ih1Ai18jakar2Hk0Zl0Tm0Gn0Co0ApZquiYrVsLtCuBv8w3y1z0;agreb,uri1Z;ang1Te0okohama;katerin1Hrev34;ars3e2i0rocl3;ckl0Vn0;nipeg,terth0W;llingt1Oxford;aw;a1i0;en2Hlni2Z;lenc2Uncouv0Gr2G;lan bat0Dtrecht;a6bilisi,e5he4i3o2rondheim,u0;nVr0;in,ku;kyo,ronIulouC;anj23l13miso2Jra2A; haJssaloni0X;gucigalpa,hr2Ol av0L;i0llinn,mpe2Bngi07rtu;chu22n2MpT;a3e2h1kopje,t0ydney;ockholm,uttga12;angh1Fenzh1X;o0KvZ;int peters0Ul3n0ppo1F; 0ti1B;jo0salv2;se;v0z0Q;adU;eykjavik,i1o0;me,t25;ga,o de janei17;to;a8e6h5i4o2r0ueb1Qyongya1N;a0etor24;gue;rt0zn24; elizabe3o;ls1Grae24;iladelph1Znom pe07oenix;r0tah tik19;th;lerJr0tr10;is;dessa,s0ttawa;a1Hlo;a2ew 0is;delTtaip0york;ei;goya,nt0Upl0Uv1R;a5e4i3o1u0;mb0Lni0I;nt0scH;evideo,real;l1Mn01skolc;dellín,lbour0S;drid,l5n3r0;ib1se0;ille;or;chest0dalWi0Z;er;mo;a4i1o0vAy01;nd00s angel0F;ege,ma0nz,sbZverpo1;!ss0;ol; pla0Iusan0F;a5hark4i3laipeda,o1rak0uala lump2;ow;be,pavog0sice;ur;ev,ng8;iv;b3mpa0Kndy,ohsiu0Hra0un03;c0j;hi;ncheMstanb0̇zmir;ul;a5e3o0; chi mi1ms,u0;stI;nh;lsin0rakliG;ki;ifa,m0noi,va0A;bu0SiltD;alw4dan3en2hent,iza,othen1raz,ua0;dalaj0Gngzhou;bu0P;eUoa;sk;ay;es,rankfu0;rt;dmont4indhovU;a1ha01oha,u0;blRrb0Eshanbe;e0kar,masc0FugavpiJ;gu,je0;on;a7ebu,h2o0raioJuriti01;lo0nstanJpenhagNrk;gFmbo;enn3i1ristchur0;ch;ang m1c0ttagoL;ago;ai;i0lgary,pe town,rac4;ro;aHeBirminghWogoAr5u0;char3dap3enos air2r0sZ;g0sa;as;es;est;a2isba1usse0;ls;ne;silPtisla0;va;ta;i3lgrade,r0;g1l0n;in;en;ji0rut;ng;ku,n3r0sel;celo1ranquil0;la;na;g1ja lu0;ka;alo0kok;re;aBb9hmedabad,l7m4n2qa1sh0thens,uckland;dod,gabat;ba;k0twerp;ara;m5s0;terd0;am;exandr0maty;ia;idj0u dhabi;an;lbo1rh0;us;rg|Place¦aMbKcIdHeFfEgBhAi9jfk,kul,l7m5new eng4ord,p2s1the 0upJyyz;bronx,hamptons;fo,oho,under2yd;acifMek,h0;l,x;land;a0co,idDuc;libu,nhattK;a0gw,hr;s,x;ax,cn,ndianGst;arlem,kg,nd;ay village,re0;at 0enwich;britain,lak2;co,ra;urope,verglad0;es;en,fw,own1xb;dg,gk,hina0lt;town;cn,e0kk,rooklyn;l air,verly hills;frica,m5ntar1r1sia,tl0;!ant1;ct0;ic0; oce0;an;ericas,s|FemaleName¦0:G0;1:G4;2:FT;3:FF;4:FE;5:ER;6:FU;7:ET;8:GH;9:F1;A:GD;B:E7;C:EI;D:FQ;E:GA;F:FN;G:C8;aE4bD6cB9dAJe9Hf92g8Ih85i7Uj6Wk61l4Pm3An2Vo2Sp2Hqu2Fr1Ps0Rt05ursu7vVwPyMzH;aKeIoH;e,la,ra;lHna;da,ma;da,ra;as7GeIol1UvH;et5onBA;le0sen3;an9endBPhiB5iH;lJnH;if3BniHo0;e,f3A;a,helmi0lHma;a,ow;aNeKiH;cIviH;an9YenG4;kD1tor3;da,l8Wnus,rH;a,nHoniD4;a,iDE;leHnesEF;nDOrH;i1y;aTeQhOiNoKrHu7y4;acG6iHu0F;c3na,sH;h9Nta;nIrH;a,i;i9Kya;a5KffaCIna,s6;al3eHomasi0;a,l8Ho6Zres1;g7Vo6YrIssH;!a,ie;eCi,ri8;bOliNmLnJrIs6tHwa0;ia0um;a,yn;iHya;a,ka,s6;a4e4iHmCCra;!ka;a,t6;at6it6;a06carlet2Ze05hViTkye,oRtNuIyH;bFMlvi1;e,sIzH;an2Uet5ie,y;anHi8;!a,e,nH;aFe;aJeH;fHl3EphH;an2;cFBr73;f3nHphi1;d4ia,ja,ya;er4lv3mon1nHobh76;dy;aLeHirlBNo0y7;ba,e0i7lJrH;iHrBRyl;!d71;ia,lBX;ki4nJrIu0w0yH;la,na;i,leAon,ron;a,da,ia,nHon;a,on;l60re0;bNdMi9lLmJndIrHs6vannaF;aFi0;ra,y;aHi4;nt6ra;lBPome;e,ie;in1ri0;a03eYhWiUoIuH;by,thBM;bRcQlPnOsIwe0xH;an95ie,y;aIeHie,lE;ann8ll1marBHtB;!lHnn1;iHyn;e,nH;a,d7X;da,i,na;an9;hel55io;bin,erByn;a,cHkki,na,ta;helC2ki;ea,iannE0oH;da,n13;an0bJgi0i0nHta,y0;aHee;!e,ta;a,eH;cATkaF;chHe,i0mo0n5FquCGvDy0;aCFelHi9;!e,le;een2iH;a0nn;aNeMhKoJrH;iHudenAX;scil1Uyamva9;lly,rt3;ilome0oebe,ylH;is,lis;arl,ggy,nelope,r7t4;ige,m0Fn4Po7rvaBDtIulH;a,et5in1;ricHsy,tA9;a,e,ia;ctav3deIf86lHph86;a,ga,iv3;l3t5;aReQiKoHy7;eIrH;aFeDma;ll1mi;aLcJkHla,na,s6ta;iHki;!ta;hoB4k8ColH;a,eBJ;!mh;l7Una,risC;dJi5PnIo23taH;li1s6;cy,et5;eAiCQ;a01ckenz2eViLoIrignayani,uriBIyrH;a,na,tAV;i4ll9ZnH;a,iH;ca,ka,qB7;a,chPkaOlKmi,nJrHtzi;aHiam;!n9;a,dy,erva,h,n2;a,dJi9LlH;iHy;cent,e;red;!e7;ae7el3I;ag4LgLi,lIrH;edi62isCyl;an2iHliC;nHsAP;a,da;!an,han;b09c9Gd07e,g05i04l02n00rLtKuIv6TxGyHz2;a,bell,ra;de,rH;a,eD;h77il9t2;a,cTgPiKjor2l6Jn2s6tJyH;!aHbe5RjaAlou;m,n9V;a,ha,i0;!aJbAOeIja,lEna,sHt54;!a,ol,sa;!l07;!h,m,nH;!a,e,n1;arJeIie,oHr3Lueri5;!t;!ry;et3JiB;elHi62y;a,l1;dHon,ue7;akranBy;iHlo97;a,ka,n9;a,re,s2;daHg2;!l2Y;alEd2elHge,isBJon0;eiAin1yn;el,le;a0Je09iXoRuLyH;d3la,nH;!a,dIe9VnHsAT;!a,e9U;a,sAR;aB4cKelJiClIna,pHz;e,iB;a,u;a,la;iHy;a2Ce,l27n9;is,l1IrItt2uH;el7is1;aJeIi8na,rH;aGi8;lei,n1tB;!in1;aRbQd3lMnJsIv3zH;!a,be4Let5z2;a,et5;a,dH;a,sHy;ay,ey,i,y;a,iaJlH;iHy;a8Je;!n4G;b7Verty;!n5T;aOda,e0iMla,nLoJslAUtHx2;iHt2;c3t3;la,nHra;a,ie,o4;a,or1;a,gh,laH;!ni;!h,nH;a,d4e,n4O;cOdon7Ui7kes6na,rNtLurJvIxHy7;mi;ern1in3;a,eHie,yn;l,n;as6is6oH;nya,ya;a,isC;ey,ie,y;a01eWhadija,iOoNrJyH;lHra;a,ee,ie;isHy5D;!tH;a,en,iHy;!e,n48;ri,urtn9C;aNerMl9BmJrHzzy;a,stH;en,in;!berlH;eHi,y;e,y;a,stD;!na,ra;el6QiKlJnIrH;a,i,ri;d4na;ey,i,l9Ss2y;ra,s6;c8Yi5YlPma7nyakumari,rNss5MtKviByH;!e,lH;a,eH;e,i7A;a5FeIhHi3PlEri0y;arGerGie,leDr9Hy;!lyn75;a,en,iHl4Vyn;!ma,n31sC;ei74i,l2;a05eWilUoNuH;anLdKliHstG;aIeHsC;!nAt0W;!n8Z;e,i2Ry;a,iB;!anMcelEd5Wel73han6JlKni,sIva0yH;a,ce;eHie;fi0lEphG;eHie;en,n1;!a,e,n36;!i10lH;!i0Z;anMle0nJrIsH;i5Rsi5R;i,ri;!a,el6Rif1RnH;a,et5iHy;!e,f1P;a,e74iInH;a,e73iH;e,n1;cMd1mi,nIqueliAsmin2Uvie4yAzH;min8;a8eIiH;ce,e,n1s;!lHsCt06;e,le;inIk2lEquelH;in1yn;da,ta;da,lQmOnNo0rMsIvaH;!na;aIiHob6W;do4;!belHdo4;!a,e,l2G;en1i0ma;a,di4es,gr5T;el9ogH;en1;a,eAia0o0se;aNeKilIoHyacin1N;ll2rten1H;a5HdHla5H;a,egard;ath0XiIlHnrietBrmiAst0X;en25ga;di;il78lLnKrHtt2yl78z6G;iHmo4Hri4I;etH;!te;aFnaF;ey,l2;aZeUiPlNold13rJwH;enHyne19;!dolE;acIetHisel9;a,chD;e,ieH;!la;adys,enHor3yn1Z;a,da,na;aKgi,lIna,ov74selH;a,e,le;da,liH;an;!n0;mZnJorgIrH;aldGi,m2Utru76;et5i5W;a,eHna;s1Ovieve;briel3Hil,le,rnet,yle;aSePio0loNrH;anIe9iH;da,e9;!cH;esIiHoi0H;n1s3X;!ca;!rH;a,en45;lIrnH;!an9;ec3ic3;rItiHy8;ma;ah,rah;d0GileDkBl01mVn4DrSsNtMuLvH;aJelIiH;e,ta;in0Byn;!ngelG;geni1la,ni3T;h55ta;meral9peranKtH;eIhHrel7;er;l2Rr;za;iHma,nestGyn;cHka,n;a,ka;eKilJmH;aHie,y;!liA;ee,i1y;lHrald;da,y;aUeSiNlMma,no4oKsJvH;a,iH;na,ra;a,ie;iHuiH;se;a,en,ie,y;a0c3da,nKsHzaI;aHe;!beH;th;!a,or;anor,nH;!a;in1na;en,iHna,wi0;e,th;aXeLiKoHul2W;lor54miniq41n32rHtt2;a,eDis,la,othHthy;ea,y;an0AnaFonAx2;anQbPde,eOiMja,lJmetr3nHsir4X;a,iH;ce,se;a,iIla,orHphiA;es,is;a,l5M;dHrdH;re;!d4Pna;!b2EoraFra;a,d4nH;!a,e;hl3i0mNnLphn1rIvi1YyH;le,na;a,by,cIia,lH;a,en1;ey,ie;a,et5iH;!ca,el1Cka;arHia;is;a0Se0Oh06i04lWoKrIynH;di,th3;istHy06;al,i0;lQnNrIurH;tn1F;aKdJiHnJriA;!nH;a,e,n1;el3;!l1T;n2sH;tanHuelo;ce,za;eHleD;en,t5;aJeoIotH;il4D;!pat4;ir8rJudH;et5iH;a,ne;a,e,iH;ce,sY;a4er4ndH;i,y;aQeNloe,rH;isIyH;stal;sy,tH;aIen,iHy;!an1e,n1;!l;lseIrH;!i8yl;a,y;nMrH;isKlImH;aiA;a,eHot5;n1t5;!sa;d4el1RtH;al,el1Q;cIlH;es5i3H;el3ilH;e,ia,y;iZlYmilXndWrOsMtHy7;aKeJhHri0;erGleDrEy;in1;ri0;li0ri0;a2IsH;a2Hie;a,iNlLmeJolIrH;ie,ol;!e,in1yn;lHn;!a,la;a,eHie,y;ne,y;na,sC;a0Ei0E;a,e,l1;isBl2;tlH;in,yn;arb0DeZianYlWoUrH;andSeQiJoIyH;an0nn;nwEok8;an2PdgLg0KtH;n29tH;!aInH;ey,i,y;ny;etH;!t8;an0e,nH;da,na;i8y;bbi8nH;iBn2;ancHossom,ythe;a,he;ca;aScky,lin9niBrOssNtJulaFvH;!erlH;ey,y;hIsy,tH;e,i11y8;!anH;ie,y;!ie;nHt6yl;adIiH;ce;et5iA;!triH;ce,z;a4ie,ra;aliy2Bb26d1Ng1Ji1Bl0Um0Pn03rYsPthe0uLvJyH;anHes6;a,na;a,eHr27;ry;drJgusIrH;el3o4;ti0;a,ey,i,y;hItrH;id;aLlHt1Q;eIi8yH;!n;e,iHy;gh;!nH;ti;iJleIpiB;ta;en,n1t5;an1AelH;le;aZdXeVgRiPja,nItoHya;inet5n3;!aKeIiHmJ;e,ka;!mHt5;ar2;!belIliCmU;sa;!le;ka,sHta;a,sa;elHie;a,iH;a,ca,n1qH;ue;!t5;te;je7rea;la;!bImHstas3;ar3;el;aJberIel3iHy;e,na;!ly;l3n9;da;aUba,eOiLlJma,ta,yH;a,c3sH;a,on,sa;iHys0K;e,s0J;a,cIna,sHza;a,ha,on,sa;e,ia;c3is6jaJna,ssaJxH;aHia;!nd4;nd4;ra;ia;i0nIyH;ah,na;a,is,naF;c6da,leDmMnslLsH;haFlH;inHyX;g,n;!h;ey;ee;en;at6g2nH;es;ie;ha;aWdiTelMrH;eJiH;anMenH;a,e,ne;an0;na;aLeKiIyH;nn;a,n1;a,e;!ne;!iH;de;e,lEsH;on;yn;!lH;iAyn;ne;agaKbIiH;!gaJ;ey,i8y;!e;il;ah|Person¦a01bZcTdQeOfMgJhHinez,jFkEleDmAnettPo9p7r4s3t2uncle,v0womL;a0irgin maH;lentino rossi,n go3;heresa may,iger woods,yra banks;addam hussaQcarlett johanssRistZlobodan milosevic,omeone,tepGuC;ay romano,eese witherspoQo1ush limbau0;gh;d stewart,naldinho,sario;a0ipV;lmUris hiltM;prah winfrOra;an,essiaen,itt romnNo0ubarek;m0thR;!my;bron james,e;anye west,iefer sutherland,obe bryaN;aime,effersFk rowli0;ng;alle ber0itlLulk hog3;ry;astBentlem1irl,rand0uy;fa2mo2;an;a0ella;thF;ff0meril lagasse,zekiel;ie;a0enzel washingt4ick wolf,ude;d0lt3nte;!dy;ar2lint1ous0ruz;in;on;dinal wols1son0;! palm5;ey;arack obama,oy,ro0;!ck,th2;shton kutch1u0;nt;er|WeekDay¦fri4mon4s2t1wed0;!nesd4;hurs2ues2;at0un1;!urd1;!d0;ay0;!s|Date¦autumn,daylight9eom,one d8s5t2w0yesterd8;eek0int5;d6end;mr1o0;d4morrow;!w;ome 1tandard3umm0;er;d0point;ay; time|Time¦a6breakfast 5dinner5e3lunch5m2n0oclock,some5to7;i7o0;on,w;id4or1;od,ve0;ning;time;fternoon,go,ll day,t 0;ni0;ght|Holiday¦0:1Q;1:1P;a1Fb1Bc12d0Ye0Of0Kg0Hh0Di09june07kwanzaa,l04m00nYoVpRrPsFt9v6w4xm03y2;om 2ule;hasho16kippur;hit2int0Xomens equalit8; 0Ss0T;alentines3e2ictor1E;r1Bteran1;! 0;-0ax 0h6isha bav,rinityMu2; b3rke2;y 0;ish2she2;vat;a0Xe prophets birth0;a6eptember14h4imchat tor0Ut 3u2;kk4mmer T;a8p7s6valentines day ;avu2mini atzeret;ot;int 2mhain;a4p3s2valentine1;tephen1;atrick1;ndrew1;amadan,ememberanc0Yos2;a park1h hashana;a3entecost,reside0Zur2;im,ple heart 0;lm2ssovE; s04;rthodox 2stara;christma1easter2goOhoJn0C;! m07;ational 2ew years09;freedom 0nurse1;a2emorial 0lHoOuharram;bMr2undy thurs0;ch0Hdi gr2tin luther k0B;as;a2itRughnassadh;bour 0g baom2ilat al-qadr;er; 2teenth;soliU;d aJmbolc,n2sra and miraj;augurGd2;ependen2igenous people1;c0Bt1;a3o2;ly satur0;lloween,nukkUrvey mil2;k 0;o3r2;ito de dolores,oundhoW;odW;a4east of 2;our lady of guadalupe,the immaculate concepti2;on;ther1;aster8id 3lectYmancip2piphany;atX;al-3u2;l-f3;ad3f2;itr;ha;! 2;m8s2;un0;ay of the dead,ecemb3i2;a de muertos,eciseis de septiembre,wali;er sol2;stice;anad8h4inco de mayo,o3yber m2;on0;lumbu1mmonwealth 0rpus christi;anuk4inese n3ristmas2;! N;ew year;ah;a 0ian tha2;nksgiving;astillCeltaine,lack4ox2;in2;g 0; fri0;dvent,ll 9pril fools,rmistic8s6u2;stral4tum2;nal2; equinox;ia 0;cens2h wednes0sumption of mary;ion 0;e 0;hallows 6s2;ai2oul1t1;nt1;s 0;day;eve|Month¦aBdec9feb7j2mar,nov9oct1sep0;!t8;!o8;an3u0;l1n0;!e;!y;!u1;!ru0;ary;!em0;ber;pr1ug0;!ust;!il|Duration¦centur4d2hour3m0seconds,week3year3;i0onth2;llisecond1nute1;ay0ecade0;!s;ies,y|FirstName¦aEblair,cCdevBj8k6lashawn,m3nelly,re2sh0;ay,e0iloh;a,lby;g1ne;ar1el,org0;an;ion,lo;as8e0;ls7nyatta,rry;am0ess1;ie,m0;ie;an,on;as0heyenne;ey,sidy;lexis,ndra,ubr0;ey|LastName¦0:34;1:39;2:3B;3:2Y;4:2E;a3Ab30c2Nd2De2Af24g1Yh1Oi1Jj1Dk16l0Ym0Mn0Io0Fp04rXsLtGvEwBxAy7zh5;a5ou,u;ng,o;a5eun2Toshi1Jun;ma5ng;da,guc1Ymo26sh20zaQ;iao,u;a6eb0il5o3right,u;li3As1;gn0lk0ng,tanabe;a5ivaldi;ssilj36zqu2;a8h7i2Fo6r5sui,urn0;an,ynisI;lst0Orr1Tth;at1Tomps1;kah0Unaka,ylor;aDchCeBhimizu,iAmi9o8t6u5zabo;ar2lliv29zuD;a5ein0;l22rm0;sa,u3;rn4th;lva,mmo23ngh;mjon4rrano;midt,neid0ulz;ito,n6sa5to;ki;ch2dKtos,z;amAeag1Yi8o6u5;bio,iz,sC;b5dri1LgHj0Sme23osevelt,sZux;erts,ins1;c5ve0E;ci,hards1;ir2os;aDe9h7ic5ow1Z;as5hl0;so;a5illips;m,n1S;ders1Zet7r6t5;e0Mr4;ez,ry;ers;h20rk0t5vl4;el,te0I;baAg0Alivei00r5;t5w1N;ega,iz;a5eils1guy1Qix1owak,ym1D;gy,ka5var1J;ji5muV;ma;aDeBiAo7u5;ll0n5rr0Assolini,ñ5;oz;lina,oJr5zart;al0Le5r0T;au,no;hhail4ll0;rci0s5y0;si;eVmmad4r5tsu06;in5tin2;!o;aBe7i5op2uo;!n5u;coln,dholm;fe6n0Pr5w0I;oy;bv5v5;re;mmy,rs13u;aAennedy,imu9le0Ko7u6wo5;k,n;mar,znets4;bay5vacs;asX;ra;hn,rl8to,ur,zl4;a9en8ha3imen2o5u3;h5nXu3;an5ns1;ss1;ki0Ds0R;cks1nsse0C;glesi8ke7noue,shik6to,vano5;u,v;awa;da;as;aAe7itchcock,o6u5;!a3b0ghMynh;a3ffmann,rvat;mingw6nde5rM;rs1;ay;ns0ErrPs6y5;asCes;an4hi5;moI;a8il,o7r6u5;o,tierr2;ayli3ub0;m2nzal2;nd5o,rcia;hi;er9is8lor7o6uj5;ita;st0urni0;es;ch0;nand2;d6insteGsposi5vaK;to;is1wards;aBeAi8omin7u5;bo5rand;is;gu2;az,mitr4;ov;lgado,vi;nkula,rw6vi5;es,s;in;aEhAlark9o5;hKl5op0rbyn,x;em6li5;ns;an;!e;an7e6iu,o5ristensFu3we;i,ng,u3w,y;!n,on5u3;!g;mpb6rt0st5;ro;ell;aAe7ha3lanco,oyko,r5yrne;ooks,yant;ng;ck6ethov5nnett;en;er,ham;ch,h7iley,rn5;es,i0;er;k,ng;dCl8nd5;ers5r9;en,on,s1;on;eks6iy7var2;ez;ej5;ev;ams|MaleName¦0:CE;1:BK;2:C2;3:BS;4:B4;5:BZ;6:AT;7:9V;8:BC;9:AW;A:AO;B:8W;aB5bA9c98d88e7Hf6Zg6Hh5Wi5Ij4Lk4Bl3Rm2Pn2Eo28p22qu20r1As0Qt07u06v01wOxavi3yHzC;aCor0;cCh8Jne;hDkC;!a5Z;ar51e5Y;ass2i,oDuC;sEu25;nFsEusC;oCsD;uf;ef;at0g;aKeIiDoCyaAQ;lfgang,odrow;lCn1O;bEey,frBJlC;aA6iC;am,e,s;e8Aur;i,nde7sC;!l6t1;de,lDrr5yC;l1ne;lCt3;a94y;aFern1iC;cDha0nceCrg9Cva0;!nt;ente,t5B;lentin49n8Zughn;lyss4Msm0;aTeOhLiJoFrDyC;!l3ro8s1;av9ReCist0oy,um0;nt9Jv55y;bEd7YmCny;!as,mCoharu;aAYie,y;iBy;mCt9;!my,othy;adDeoCia7EomB;!do7O;!de9;dFrC;en8JrC;an8IeCy;ll,n8H;!dy;dgh,ic9Unn3req,ts46;aScotQeOhKiIoGpenc3tCur1Pylve8Jzym1;anEeCua7D;f0phAGvCwa7C;e59ie;!islaw,l6;lom1nA4uC;leyma8ta;dClBm1;!n6;aEeC;lCrm0;d1t1;h6Une,qu0Vun,wn,y8;aCbasti0k1Yl42rg41th,ymo9J;m9n;!tC;!ie,y;lDmCnti22q4Kul;!mAu4;ik,vato6X;aXeThe94iPoGuDyC;an,ou;b6NdDf9pe6SssC;!elAK;ol2Vy;an,bJcIdHel,geGh0landA4mFnEry,sDyC;!ce;coe,s;!a96nA;an,eo;l3Kr;e4Sg3n6oA5ri6A;co,ky;bAe9V;cCl6;ar5Qc5PhDkCo;!ey,ie,y;a87ie;gDid,ub5x,yCza;ansh,nT;g8XiC;na8Ts;ch60fa4lEmDndCpha4sh6Wul,ymo72;alA0ol2Cy;i9Jon;f,ph;ent2inC;cy,t1;aGeEhilDier64ol,reC;st1;!ip,lip;d9Crcy,tC;ar,e2W;b3Udra6Ht46ul;ctav2Wliv3m97rGsDtCum8Vw5;is,to;aDc8TvC;al54;ma;i,l4BvK;athKeIiEoC;aCel,l0ma0r2Y;h,m;cDg4i3KkC;h6Wola;holBkColB;!olB;al,d,il,ls1vC;il52;anCy;!a4i4;aXeUiLoGuDyC;l22r1;hamDr61staC;fa,p4I;ed,mG;dibo,e,hamEis1YntDsCussa;es,he;e,y;ad,ed,mC;ad,ed;cHgu4kFlEnDtchC;!e7;a7Aik;o04t1;e,olC;aj;ah,hCk6;a4eC;al,l;hDlv2rC;le,ri7v2;di,met;ck,hOlMmPnu4rIs1tEuricDxC;!imilian87we7;e,io;eo,hDiBtC;!eo,hew,ia;eCis;us,w;cEio,k81lDqu6Isha7tCv2;i2Jy;in,on;!el,oLus;achCcolm,ik;ai,y;amCdi,moud;adC;ou;aSeOiNlo2ToJuDyC;le,nd1;cFiEkCth3;aCe;!s;gi,s;as,iaC;no;g0nn6SrenEuCwe7;!iC;e,s;!zo;am,on4;a7Cevi,la4UnEoCst3vi;!nC;!a62el;!ny;mDnCr16ur4Vwr4V;ce,d1;ar,o4P;aJeEhaled,iCrist4Xu4Ay3D;er0p,rC;by,k,ollos;en0iFnCrmit,v2;!dDnCt5E;e10y;a7ri4P;r,th;na69rCthem;im,l;aZeRiPoEuC;an,liCst2;an,o,us;aqu2eKhnJnHrFsC;eDhCi7Due;!ua;!ph;dCge;an,i,on;!aCny;h,s,th4Z;!ath4Yie,nA;!l,sCy;ph;an,e,mC;!mA;d,ffHrEsC;sCus;!e;a5KemDmai8oCry;me,ni0Q;i6Wy;!e07rC;ey,y;cId5kHmGrEsDvi3yC;!d5s1;on,p3;ed,od,rCv4O;e51od;al,es,is1;e,ob,ub;k,ob,quC;es;aObrahNchika,gLkeKlija,nuJrHsEtCv0;ai,sC;uki;aCha0i6Hma4sac;ac,iaC;h,s;a,vinCw2;!g;k,nngu53;!r;nacCor;io;im;in,n;aLeGina4WoEuCyd57;be27gCmber4EsE;h,o;m3ra35sCwa3Z;se2;aFctEitEnDrC;be22m0;ry;or;th;bLlKmza,nJo,rEsDyC;a44d5;an,s0;lFo4FrEuCv6;hi41ki,tC;a,o;is1y;an,ey;k,s;!im;ib;aReNiMlenLoJrFuC;illerDsC;!tavo;mo;aEegCov3;!g,orC;io,y;dy,h58nt;nzaCrd1;lo;!n;lbe4Qno,ovan4S;ne,oErC;aCry;ld,rd4O;ffr6rge;bri4l5rCv2;la20r3Fth,y;aSeOiMlKorr0JrC;anEedCitz;!dAeCri25;ri24;cEkC;!ie,lC;in,yn;esKisC;!co,zek;etch3oC;yd;d4lConn;ip;deriEliDng,rnC;an02;pe,x;co;bi0di;ar00dVfrUit0lOmHnGo2rDsteb0th0uge8vCym5zra;an,ere2W;gi,iDnCrol,v2w2;est3Zie;c08k;och,rique,zo;aHerGiDmC;aGe2Q;lDrC;!h0;!io;s1y;nu4;be0Ad1iFliEmDt1viCwood;n,s;er,o;ot1Us;!as,j44sC;ha;a2en;!dAg32mFuDwC;a26in;arC;do;o0Tu0T;l,nC;est;aZePiMoFrEuDwCyl0;ay8ight;a8dl6nc0st2;ag0ew;minGnEri0ugDyC;le;!lB;!a29nCov0;e7ie,y;go,icC;!k;armuDeCll1on,rk;go;id;anJj0lbeImetri9nGon,rFsEvDwCxt3;ay8ey;en,in;hawn,mo09;ek,ri0G;is,nCv3;is,y;rt;!dC;re;lLmJnIrEvC;e,iC;!d;en,iEne7rCyl;eCin,yl;l2Wn;n,o,us;!e,i4ny;iCon;an,en,on;e,lB;as;a07e05hXiar0lMoHrFuDyrC;il,us;rtC;!is;aCistobal;ig;dy,lFnDrC;ey,neli9y;or,rC;ad;by,e,in,l2t1;aHeEiCyJ;fCnt;fo0Dt1;meDt9velaC;nd;nt;rEuDyC;!t1;de;enC;ce;aGeFrisDuC;ck;!tC;i0oph3;st3;d,rlCs;eCie;s,y;cCdric,s11;il;lFmer1rC;ey,lDro7y;ll;!os,t1;eb,v2;ar03eVilUlaToQrDuCyr1;ddy,rtJ;aKeFiEuDyC;an,ce,on;ce,no;an,ce;nDtC;!t;dDtC;!on;an,on;dDndC;en,on;!foCl6y;rd;bDrCyd;is;!by;i8ke;al,lA;nGrCshoi;at,nDtC;!r11;aCie;rd0M;!edict,iDjam2nA;ie,y;to;n6rCt;eCy;tt;ey;ar0Yb0Od0Kgust2hm0Hid5ja0FlZmXnPputsiOrFsaEuCya0ziz;gust9st2;us;hi;aJchIi4jun,maGnEon,tCy0;hCu07;ur;av,oC;ld;an,nd05;el;ie;ta;aq;dHgel00tC;hoFoC;i8nC;!iXy;ne;ny;reCy;!as,s,w;ir,mCos;ar;an,bePd5eJfGi,lFonEphonIt1vC;aNin;on;so,zo;an,en;onDrC;edK;so;c,jaFksandEssaFxC;!and3;er;ar,er;ndC;ro;rtC;!o;ni;en;ad,eC;d,t;in;aDoCri0vik;lfo;mCn;!a;dGeFraDuC;!bakr,lfazl;hCm;am;!l;allFel,oulaye,ulC;!lDrahm0;an;ah,o;ah;av,on|Verb¦awak9born,cannot,fr8g7h5k3le2m1s0wors9;e8h3;ake sure,sg;ngth6ss6;eep tabs,n0;own;as0e2;!t2;iv1onna;ight0;en|PhrasalVerb¦0:71;1:6P;2:7D;3:73;4:6I;5:7G;6:75;7:6O;8:6B;9:6C;A:5H;B:70;C:6Z;a7Gb62c5Cd59e57f45g3Nh37iron0j33k2Yl2Km2Bn29o27p1Pr1Es09tQuOvacuum 1wGyammerCzD;eroAip EonD;e0k0;by,up;aJeGhFiEorDrit52;d 1k2Q;mp0n49pe0r8s8;eel Bip 7K;aEiD;gh 06rd0;n Br 3C;it 5Jk8lk6rm 0Qsh 73t66v4O;rgeCsD;e 9herA;aRePhNiJoHrFuDype 0N;ckArn D;d2in,o3Fup;ade YiDot0y 32;ckle67p 79;ne66p Ds4C;d2o6Kup;ck FdEe Dgh5Sme0p o0Dre0;aw3ba4d2in,up;e5Jy 1;by,o6U;ink Drow 5U;ba4ov7up;aDe 4Hll4N;m 1r W;ckCke Elk D;ov7u4N;aDba4d2in,o30up;ba4ft7p4Sw3;a0Gc0Fe09h05i02lYmXnWoVpSquare RtJuHwD;earFiD;ngEtch D;aw3ba4o6O; by;ck Dit 1m 1ss0;in,up;aIe0RiHoFrD;aigh1LiD;ke 5Xn2X;p Drm1O;by,in,o6A;n2Yr 1tc3H;c2Xmp0nd Dr6Gve6y 1;ba4d2up;d2o66up;ar2Uell0ill4TlErDurC;ingCuc8;a32it 3T;be4Brt0;ap 4Dow B;ash 4Yoke0;eep EiDow 9;c3Mp 1;in,oD;ff,v7;gn Eng2Yt Dz8;d2o5up;in,o5up;aFoDu4E;ot Dut0w 5W;aw3ba4f36o5Q;c2EdeAk4Rve6;e Hll0nd GtD; Dtl42;d2in,o5upD;!on;aw3ba4d2in,o1Xup;o5to;al4Kout0rap4K;il6v8;at0eKiJoGuD;b 4Dle0n Dstl8;aDba4d2in52o3Ft2Zu3D;c1Ww3;ot EuD;g2Jnd6;a1Wf2Qo5;ng 4Np6;aDel6inAnt0;c4Xd D;o2Su0C;aQePiOlMoKrHsyc29uD;ll Ft D;aDba4d2in,o1Gt33up;p38w3;ap37d2in,o5t31up;attleCess EiGoD;p 1;ah1Gon;iDp 52re3Lur44wer 52;nt0;ay3YuD;gAmp 9;ck 52g0leCn 9p3V;el 46ncilA;c3Oir 2Hn0ss FtEy D;ba4o4Q; d2c1X;aw3ba4o11;pDw3J;e3It B;arrow3Serd0oD;d6te3R;aJeHiGoEuD;ddl8ll36;c16p 1uth6ve D;al3Ad2in,o5up;ss0x 1;asur8lt 9ss D;a19up;ke Dn 9r2Zs1Kx0;do,o3Xup;aOeMiHoDuck0;a16c36g 0AoDse0;k Dse34;aft7ba4d2forw2Ain3Vov7uD;nd7p;e GghtFnEsDv1T;ten 4D;e 1k 1; 1e2Y;ar43d2;av1Ht 2YvelD; o3L;p 1sh DtchCugh6y1U;in3Lo5;eEick6nock D;d2o3H;eDyA;l2Hp D;aw3ba4d2fSin,o05to,up;aFoEuD;ic8mpA;ke2St2W;c31zz 1;aPeKiHoEuD;nker2Ts0U;lDneArse2O;d De 1;ba4d2oZup;de Et D;ba4on,up;aw3o5;aDlp0;d Fr Dt 1;fDof;rom;in,oO;cZm 1nDve it;d Dg 27kerF;d2in,o5;aReLive Jloss1VoFrEunD; f0M;in39ow 23; Dof 0U;aEb17it,oDr35t0Ou12;ff,n,v7;bo5ft7hJw3;aw3ba4d2in,oDup,w3;ff,n,ut;a17ek0t D;aEb11d2oDr2Zup;ff,n,ut,v7;cEhDl1Pr2Xt,w3;ead;ross;d aEnD;g 1;bo5;a08e01iRlNoJrFuD;cDel 1;k 1;eEighten DownCy 1;aw3o2L;eDshe1G; 1z8;lFol D;aDwi19;bo5r2I;d 9;aEeDip0;sh0;g 9ke0mDrD;e 2K;gLlJnHrFsEzzD;le0;h 2H;e Dm 1;aw3ba4up;d0isD;h 1;e Dl 11;aw3fI;ht ba4ure0;eInEsD;s 1;cFd D;fDo1X;or;e B;dQl 1;cHll Drm0t0O;apYbFd2in,oEtD;hrough;ff,ut,v7;a4ehi1S;e E;at0dge0nd Dy8;o1Mup;o09rD;ess 9op D;aw3bNin,o15;aShPlean 9oDross But 0T;me FoEuntD; o1M;k 1l6;aJbIforGin,oFtEuD;nd7;ogeth7;ut,v7;th,wD;ard;a4y;pDr19w3;art;eDipA;ck BeD;r 1;lJncel0rGsFtch EveA; in;o16up;h Bt6;ry EvD;e V;aw3o12;l Dm02;aDba4d2o10up;r0Vw3;a0He08l01oSrHuD;bbleFcklTilZlEndlTrn 05tDy 10zz6;t B;k 9; ov7;anMeaKiDush6;ghHng D;aEba4d2forDin,o5up;th;bo5lDr0Lw3;ong;teD;n 1;k D;d2in,o5up;ch0;arKgJil 9n8oGssFttlEunce Dx B;aw3ba4;e 9; ar0B;k Bt 1;e 1;d2up; d2;d 1;aIeed0oDurt0;cFw D;aw3ba4d2o5up;ck;k D;in,oK;ck0nk0st6; oJaGef 1nd D;d2ov7up;er;up;r0t D;d2in,oDup;ff,ut;ff,nD;to;ck Jil0nFrgEsD;h B;ainCe B;g BkC; on;in,o5; o5;aw3d2o5up;ay;cMdIsk Fuction6; oD;ff;arDo5;ouD;nd;d D;d2oDup;ff,n;own;t D;o5up;ut|Modal¦c5lets,m4ought3sh1w0;ill,o5;a0o4;ll,nt;! to;ay,ight,ust;an,o0;uld|Adjective¦0:74;1:7J;2:7P;3:7I;4:7B;5:5B;6:4R;7:48;8:49;9:60;A:7G;B:5W;C:72;D:6Z;a6Hb63c5Pd55e4Rf48g3Zh3Oi33j31k30l2Pm2En25o1Pp19quack,r0Zs0Ft08uPvMwEyear5;arp0eIholeHiGoE;man5oEu6A;d6Czy;despr73s5E;!sa8;eFlEste24;co1Gl o4J;!k5;aFiEola4A;b7Rce versa,ol53;ca2gabo61nilla;ltVnIpFrb58su4tterE;!mo6Y; f32b1MpFsEti1F;ca8et,ide dLtairs;er,i3L;aObeco6Pconvin25deLeKfair,ivers4knJprecedXrHsFwE;iel1Yritt5X;i1TuE;pervis0specti3;eEu5;cognKgul6Fl6F;own;ndi3v5Rxpect0;cid0rE;!grou5MsE;iz0tood;b8ppeaKssu6EuthorE;iz0;i22ra;aIeGhough4NoFrE;i1oubl0;geth6p,rpD;en5OlEm4Yrr2Sst0;li3;boo,lEn;ent0;aWcVeThSiQmug,nobbi3DoOpNqueami3DtIuEymb62;bGi gener53pErprisi3;erEre0J;! dup6b,i27;du0seq4S;anda6SeHi0NrEy37;aightEip0; fEfE;or59;adfa60reotyp0;aBec2Eir1HlendDot on; call0le,mb6phist1VrEu0Vvi40;dDry;gnifica2nE;ceBg8;am2Oe6ocki3ut;cEda1em5lfi2Xni1Upa67re7;o1Er3U;at56ient26reec56;cr0me,ns serif;aLeHiFoE;bu5Ott4SuRy4;ghtEv4;!-27f9;ar,bel,condi1du61fres50lGpublic3UsEta2C;is46oE;lu1na2;e1Cuc44;bDciE;al,st;aOeMicayu7lacDopuli5FrFuE;bl58mp0;eIiFoE;!b08fuCmi30p6;mFor,sEva1;ti7;a4Ue;ciCmE;a0Gi5I;ac20rEti1;feAma2Tplexi3v33;rEst;allelGtE;-tiEi4;me;!ed;bPffNkMld fashion0nLpKrg1Gth6utJvE;al,erE;!aGniFt,wE;eiErouE;ght;ll;do0Uer,g2Lsi45;en,posi1; boa5Fg2Jli7;!ay; gua5DbEli7;eat;eGsE;cEer0Gole1;e7uB;d2Sse;ak0eLiKoEua4O;nIrFtE;ab8;thE;!eE;rn;chala2descri4Zstop;ght5;arby,cessa3Wighbor5xt;aMeKiHoEultip8;bi8derFlEnth5ot,st;dy;a1n;nEx0;iaEor;tuB;di4EnaEre;ci3;cEgenta,in,j02keshift,le,mmoth,ny,sculi7;abBho;aNeIiFoEu13;uti12vi3;mFteraE;l,te;it0;ftHgEth4;al,eFitiE;ma1;nda3C;!-0B;nguDst,tt6;ap1Sind5no09;agg0uE;niNstifi0veni8;de4gno4Blleg4mRnGpso 1VrE;a1releE;va2; MaLbr0corKdIfluenSiSnHsGtE;aAenCoxE;ic36;a7i2R;a1er,oce2;iFoE;or;reA;deq3Jppr2Y;fEsitu,vitro;ro2;mIpE;arGerfeAoErop6;li1rtE;a2ed;ti4;eEi0Q;d2QnC;aJelIiGoEumdr3B;ne2Zok0rrEs07ur5;if2S;ghfalut1OspE;an2Q;liZpf9;lHnGrE;d05roE;wi3;dy,gi3;f,low0;ainf9ener2Jiga22lLoKraHuE;aFilEng ho;ty;rd0;cFtE;ef9is;ef9;ne,od;ea2Cob4;aTeNinMlLoGrE;a1SeEoz1J;e2Cq11tf9;oGrE; keeps,eEm6tuna1;g03ign;liE;sh;ag2Yue2;al,i1;dImFrE;ti8;a8ini7;ne;le; up;bl0i2lCr Eux,vori1;oEreac1E;ff;aNfficie2lMmiLnJreAthere4veIxE;aAcess,peGtraFuE;be2Ll0H;!va1D;ct0rt;n,ryday; Ecouragi3tiB;rou1sui1;ne2;abo22dPe17i1;g6sE;t,ygE;oi3;er;aUeMiGoErea14ue;mina2ne,ubE;le,tf9;dact1Afficu1NsFvE;erC;creGeas0gruntl0hone1EordFtE;a2ress0;er5;et; KadpJfIgene1OliGrang0spe1OtFvoE;ut;ail0ermin0;be1Lca1ghE;tf9;ia2;an;facto;i5magEngeroYs0H;ed,i3;ly;ertaQhief,ivil,oGrE;aEowd0u0G;mp0v01z0;loMmKnFoi3rrEve0O;eAu1H;cre1grHsGtE;emEra0E;po0C;ta2;ue2;mer07pleE;te,x;ni4ss4;in;aOeKizarBlIoFrE;and new,isk,okO;gFna fiVttom,urgeoE;is;us;ank,iH;re;autif9hiFlov0nEst,yoF;eUt;nd;ul;ckFnkru0WrrE;en;!wards; priori,b0Mc0Jd09fraDg04h03lYma05ntiquXpTrNsLttracti06utheKvHwE;aFkE;wa0T;ke,re;ant garFerE;age;de;ntU;leep,tonisE;hi3;ab,bitHroGtiE;fiE;ci4;ga2;raE;ry;pEt;are2etiOrE;oprE;ia1;at0;arHcohFeEiLl,oof;rt;olE;ic;mi3;ead;ainGgressiFoniE;zi3;ve;st;id; LeJuIvE;aFerC;se;nc0;ed;lt;pt,qE;ua1;hoc,infinitE;um;cuFtu4u1;al;ra1;erOlNoLruKsFuE;nda2;e2oFtraA;ct;lu1rbi3;ng;te;pt;aEve;rd;aze,e;ra2;nt|Comparable¦0:41;1:4I;2:45;3:4B;4:2Y;5:3X;a4Ob44c3Od3De35f2Rg2Fh24i1Vj1Uk1Rl1Im1Cn16o14p0Tqu0Rr0IsRtKuIvFw7y6za12;ell27ou3;aBe9hi1Yi7r6;o3y;ck0Mde,l6n1ry,se;d,y;a6i4Mt;k,ry;n1Tr6sI;m,y;a7e6ulgar;nge5rda2xi3;gue,in,st;g0n6pco3Mse5;like0ti1;aAen9hi8i7ough,r6;anqu2Qen1ue;dy,g3Ume0ny,r09;ck,n,rs2R;d42se;ll,me,rt,s6wd47;te5;aVcarUeThRiQkin0GlMmKoHpGqua1HtAu7w6;eet,ift;b7dd15per0Hr6;e,re2J;sta2Ht4;aAe9iff,r7u6;pXr1;a6ict,o3;ig3Hn0W;a1ep,rn;le,rk;e24i3Hright0;ci2Aft,l7o6re,ur;n,thi3;emn,id;a6el0ooth;ll,rt;e8i6ow,y;ck,g37m6;!y;ek,nd3F;ck,l0mp4;a6iUort,rill,y;dy,ll0Zrp;cu0Tve0Txy;ce,ed,y;d,fe,int0l1Xv16;aBe9i8o6ude;mantic,o1Ksy,u6;gh,nd;ch,pe,tzy;a6d,mo0J;dy,l;gg7ndom,p6re,w;id;ed;ai2i6;ck,et;aFhoEi1SlCoBr8u6;ny,r6;e,p4;egna2ic7o6;fou00ud;ey,k0;li06or,te1D;a6easa2;in,nt;ny;in5le;dd,f6i0ld,ranR;fi11;aAe8i7o6;b4isy,rm16sy;ce,mb4;a6w;r,t;ive,rr02;aAe8ild,o7u6;nda1Ate;ist,o1;a6ek,llY;n,s0ty;d,tuR;aCeBi9o6ucky;f0Vn7o1Eu6ve0w18y0U;d,sy;e0g;g1Uke0tt4v6;e0i3;an,wd;me,r6te;ge;e7i6;nd;en;ol0ui1P;cy,ll,n6;sBt6;e6ima8;llege2r6;es7media6;te;ti3;ecu6ta2;re;aEeBiAo8u6;ge,m6ng1R;b4id;ll6me0t;ow;gh,l0;a6f04sita2;dy,v6;en0y;nd1Hppy,r6te5;d,sh;aGenFhDiClBoofy,r6;a9e8is0o6ue1E;o6ss;vy;at,en,y;nd,y;ad,ib,ooI;a2d1;a6o6;st0;t4uiY;u1y;aIeeb4iDlat,oAr8u6;ll,n6r14;!ny;aHe6iend0;e,sh;a7r6ul;get5mG;my;erce8n6rm,t;an6e;ciC;! ;le;ir,ke,n0Fr,st,t,ulA;aAerie,mp9sse7v6xtre0Q;il;nti6;al;ty;r7s6;tern,y;ly,th0;aFeCi9r7u6;ll,mb;u6y;nk;r7vi6;ne;e,ty;a6ep,nD;d6f,r;!ly;mp,pp03rk;aHhDlAo8r7u6;dd0r0te;isp,uel;ar6ld,mmon,ol,st0ward0zy;se;e6ou1;a6vW;n,r;ar8e6il0;ap,e6;sy;mi3;gey,lm8r6;e5i3;ful;!i3;aNiLlIoEr8u6;r0sy;ly;aAi7o6;ad,wn;ef,g7llia2;nt;ht;sh,ve;ld,r7un6;cy;ed,i3;ng;a7o6ue;nd,o1;ck,nd;g,tt6;er;d,ld,w1;dy;bsu9ng8we6;so6;me;ry;rd|Adverb¦a07by 05d01eYfShQinPjustOkinda,mMnJoEpCquite,r9s5t2up1very,w0Bye0;p,s; to,wards5;h1o0wiO;o,t6ward;en,us;everal,o0uch;!me1rt0; of;hXtimes,w07;a1e0;alS;ndomRthN;ar excellDer0oint blank; Mhaps;f3n0;ce0ly;! 0;ag00moU; courHten;ewJo0; longEt 0;onHwithstanding;aybe,eanwhiAore0;!ovB;! aboS;deed,steT;en0;ce;or2u0;l9rther0;!moH; 0ev3;examp0good,suF;le;n mas1v0;er;se;e0irect1; 1finite0;ly;ju7trop;far,n0;ow; CbroBd nauseam,gAl5ny2part,side,t 0w3;be5l0mo5wor5;arge,ea4;mo1w0;ay;re;l 1mo0one,ready,so,ways;st;b1t0;hat;ut;ain;ad;lot,posteriori|Ordinal¦bGeDf9hundredHmGnin7qu6s4t0zeroH;enGh1rFwe0;lfFn9;ir0ousandE;d,t4;e0ixt9;cond,ptAvent8xtA;adr9int9;et0th;e6ie8;i2o0;r0urt3;tie5;ft1rst;ight0lev1;e0h,ie2;en1;illion0;th|Cardinal¦bGeDf7hundred,mGnine9one,qu6s4t0zero;en,h2rFw0;e0o;lve,n7;irt8ousand,ree;e0ix4;ptAven3xtA;adr9int9;i3o0;r1ur0;!t2;ty;ft0ve;e2y;ight0lev1;!e0y;en;illion|Expression¦a02b01dXeVfuck,gShLlImHnGoDpBshAu7voi04w3y0;a1eLu0;ck,p;!a,hoo,y;h1ow,t0;af,f;e0oa;e,w;gh,h0;! 0h,m;huh,oh;eesh,hh,it;ff,hew,l0sst;ease,z;h1o0w,y;h,o,ps;!h;ah,ope;eh,mm;m1ol0;!s;ao,fao;a4e2i,mm,oly1urr0;ah;! mo6;e,ll0y;!o;ha0i;!ha;ah,ee,o0rr;l0odbye;ly;e0h,t cetera,ww;k,p;'oh,a0uh;m0ng;mit,n0;!it;ah,oo,ye; 1h0rgh;!em;la|Preposition¦'o,-,aKbHcGdFexcept,fEinDmidPnotwithstandiQoBpRqua,sAt6u3vi2w0;/o,hereMith0;!in,oQ;a,s-a-vis;n1p0;!on;like,til;h0ill,owards;an,r0;ough0u;!oI;ans,ince,o that;',f0n1ut;!f;!to;or,rom;espite,own,u3;hez,irca;ar1e0oAy;low,sides,tween;ri6;',bo7cross,ft6lo5m3propos,round,s1t0;!op;! long 0;as;id0ong0;!st;ng;er;ut|Conjunction¦aEbAcuz,how8in caDno7o6p4supposing,t1vers5wh0yet;eth8ile;h0o;eref9o0;!uC;l0rovided that;us;r,therwi6; matt1r;!ev0;er;e0ut;cau1f0;ore;se;lthou1nd,s 0;far as,if;gh|Determiner¦aAboth,d8e5few,l3mu7neiCown,plenty,some,th2various,wh0;at0ich0;evB;at,e3is,ose;a,e0;!ast,s;a1i6l0nough,very;!se;ch;e0u;!s;!n0;!o0y;th0;er","conjugations":":act,,,,|age:_,d,s,ing|aim:_,ed,,ing|ar:ise,ose,,,isen|babys:it,at|ban:_,ned,,ning|:be,was,is,am,been|beat:_,,,ing,en|become:_,,,,_|beg:in,an,,inning,un|:being,were,are,are|ben:d,,,,t|bet:_,,,,_|b:ind,ound|bit:e,_,,ing,ten|ble:ed,d,,,d|bl:ow,ew,,,own|:boil,,,,|br:ake,,,,oken|br:eak,oke|bre:ed,d|br:ing,ought,,,ought|broadcast:_,_|buil:d,t,,,t|burn:_,,,,ed|burst:_,,,,_|b:uy,ought,,,ought|:can,could,can,_|ca:tch,ught|cho:ose,se,,osing,sen|cl:ing,,,,ung|c:ome,ame,,,ome|compet:e,ed,,ing|cost:_,_|cre:ep,,,,pt|cut:_,,,,_|deal:_,t,,,t|develop:_,ed,,ing|d:ie,ied,,ying|d:ig,ug,,igging,ug|dive:_,,,,d|d:o,id,oes|dr:aw,ew,,,awn|dream:_,,,,t|dr:ink,ank,,,unk|dr:ive,ove,,iving,iven|drop:_,ped,,ping|:eat,ate,,eating,eaten|edit:_,,,ing|egg:_,ed|f:all,ell,,,allen|fe:ed,d,,,d|fe:el,lt|f:ight,ought,,,ought|f:ind,ound|fle:e,,,eing,d|fl:ing,,,,ung|fl:y,ew,,,own|forb:id,ade|forg:et,ot,,eting,otten|forg:ive,ave,,iving,iven|free:_,,,ing|fr:eeze,oze,,eezing,ozen|g:et,ot|g:ive,ave,,iving,iven|:go,went,goes,,gone|got:_,,,,ten|grow:_,,,,n|h:ang,ung,,,ung|ha:ve,d,s,ving,d|hear:_,d,,,d|hid:e,_,,,den|hit:_,,,,_|h:old,eld,,,eld|hurt:_,_,,,_|ic:e,ed,,ing|impl:y,ied,ies|:is,was,is,being|ke:ep,,,,pt|kne:el,,,,lt|know:_,,,,n|la:y,id,,,id|le:ad,d,,,d|leap:_,,,,t|le:ave,ft,,,ft|len:d,,,,t|l:ie,ay,,ying|li:ght,t,,,t|log:_,ged,,ging|lo:ose,,,,st|los:e,t,,ing|ma:ke,de,,,de|mean:_,t,,,t|me:et,t,,eting,t|miss:_,,_|pa:y,id,,,id|prove:_,,,,n|puk:e,,,ing|put:_,,,,_|quit:_,,,,_|read:_,_,,,_|rid:e,,,,den|r:ing,ang,,,ung|r:ise,ose,,ising,isen|rub:_,bed,,bing|r:un,an,,unning,un|sa:y,id,ys,,id|s:eat,,,,at|s:ee,aw,,eeing,een|s:eek,,,,ought|s:ell,old,,,old|sen:d,,,,t|set:_,,,,_|sew:_,,,,n|shake:_,,,,n|shave:_,,,,d|shed:_,_,s,ding|sh:ine,one,,,one|sho:ot,t,,,t|show:_,ed|shut:_,,,,_|s:ing,ang,,,ung|s:ink,ank|s:it,at|ski:_,ied|sla:y,,,,in|sle:ep,,,,pt|slid:e,_,,,_|smash:_,,es|sn:eak,,,,uck|sp:eak,oke,,,oken|spe:ed,,,,d|spen:d,,,,t|spil:l,t,,,led|sp:in,un,,inning,un|sp:it,,,,at|split:_,,,,_|spread:_,_|spr:ing,,,,ung|st:and,ood|st:eal,ole|st:ick,uck|st:ing,ung|st:ink,unk,,,unk|:stream,,,,|strew:_,,,,n|str:ike,uck,,iking|suit:_,ed,,ing|sw:are,,,,orn|sw:ear,ore|swe:ep,,,,pt|sw:im,am,,imming|sw:ing,ung|t:ake,ook|t:each,aught,eaches|t:ear,ore|t:ell,old|th:ink,ought|thrive:_,,,,d|t:ie,ied,,ying|undergo:_,,,,ne|underst:and,ood|upset:_,,,,_|wait:_,ed,,ing|w:ake,oke|w:ear,ore|w:eave,,,,oven|we:ep,,,,pt|w:in,on,,inning|w:ind,,,,ound|withdr:aw,ew|wr:ing,,,,ung|wr:ite,ote,,iting,itten","plurals":"addend|um|a,alga|e,alumna|e,alumn|us|i,analys|is|es,appendi|x|ces,avocado|s,bacill|us|i,barracks|,beau|x,bus|es,cact|us|i,chateau|x,child|ren,circus|es,clothes|,corp|us|ora,criteri|on|a,curricul|um|a,database|s,deer|,diagnos|is|es,echo|es,embargo|es,epoch|s,f|oot|eet,gen|us|era,g|oose|eese,halo|s,hippopotam|us|i,ind|ex|ices,larva|e,lea|f|ves,librett|o|i,loa|f|ves,m|an|en,matri|x|ces,memorand|um|a,modul|us|i,mosquito|es,move|s,op|us|era,ov|um|a,ox|en,parenthes|is|es,pe|rson|ople,phenomen|on|a,prognos|is|es,quiz|zes,radi|us|i,referend|um|a,rodeo|s,sex|es,shoe|s,sombrero|s,stomach|s,syllab|us|i,synops|is|es,tableau|x,thes|is|es,thie|f|ves,t|ooth|eeth,tornado|s,tuxedo|s,zero|s"}`;

//list of inconsistent parts-of-speech
var conflicts = [
  //top-level pos are all inconsistent
  [
    'Noun',
    'Verb',
    'Adjective',
    'Adverb',
    'Determiner',
    'Conjunction',
    'Preposition',
    'QuestionWord',
    'Expression',
    'Url',
    'PhoneNumber',
    'Email',
    'Emoji',
  ],
  //exlusive-nouns
  ['Person', 'Organization', 'Value', 'Place', 'Actor', 'Demonym', 'Pronoun'],
  //acronyms
  ['Acronym', 'Pronoun', 'Actor', 'Unit', 'Address'],
  ['Acronym', 'Plural'],
  //things that can't be plural
  ['Plural', 'Singular'],
  //exlusive-people
  ['MaleName', 'FemaleName'],
  ['FirstName', 'LastName', 'Honorific'],
  //adjectives
  ['Comparative', 'Superlative'],
  //values
  ['Value', 'Verb', 'Adjective'],
  ['Ordinal', 'Cardinal'],
  ['TextValue', 'NumericValue'],
  ['NiceNumber', 'TextValue'],
  ['Ordinal', 'Currency'], //$5.50th
  //verbs
  ['PastTense', 'PresentTense', 'FutureTense'],
  [
    'Pluperfect',
    'Copula',
    'Modal',
    'Participle',
    'Infinitive',
    'Gerund',
    'FuturePerfect',
    'PerfectTense',
  ],
  ['Auxiliary', 'Noun', 'Value'],
  //date
  ['Month', 'WeekDay', 'Year', 'Duration', 'Holiday'],
  ['Particle', 'Conjunction', 'Adverb', 'Preposition'],
  ['Date', 'Verb', 'Adjective', 'Person'],
  ['Date', 'Money', 'RomanNumeral', 'Fraction'],
  //a/an -> 1
  ['Value', 'Determiner'],
  ['Url', 'Value', 'HashTag', 'PhoneNumber', 'Emoji'],
  //roman numerals
  ['RomanNumeral', 'Fraction', 'NiceNumber'],
  ['RomanNumeral', 'Money'],
  //cases
  ['UpperCase', 'TitleCase', 'CamelCase'],
  //phrases
  ['VerbPhrase', 'Noun', 'Adjective', 'Value'],
  //QuestionWord
  ['QuestionWord', 'VerbPhrase'],
  //acronyms
  ['Acronym', 'VerbPhrase'],
];

var nouns = {
  Noun: {
    isA: 'NounPhrase',
  },
  // - singular
  Singular: {
    isA: 'Noun',
  },
  //a specific thing that's capitalized
  ProperNoun: {
    isA: 'Noun',
  },

  // -- people
  Person: {
    isA: 'Singular',
  },
  FirstName: {
    isA: 'Person',
  },
  MaleName: {
    isA: 'FirstName',
  },
  FemaleName: {
    isA: 'FirstName',
  },
  LastName: {
    isA: 'Person',
  },
  Honorific: {
    isA: 'Noun',
  },
  Place: {
    isA: 'Singular',
  },

  // -- places
  Country: {
    isA: 'Place',
  },
  City: {
    isA: 'Place',
  },
  Region: {
    isA: 'Place',
  },
  Address: {
    isA: 'Place',
  },
  Organization: {
    isA: 'Singular',
  },
  SportsTeam: {
    isA: 'Organization',
  },
  Company: {
    isA: 'Organization',
  },
  School: {
    isA: 'Organization',
  },

  // - plural
  Plural: {
    isA: 'Noun',
  },
  Uncountable: {
    //(not plural or singular)
    isA: 'Noun',
  },
  Pronoun: {
    isA: 'Noun',
  },
  //a word for someone doing something -'plumber'
  Actor: {
    isA: 'Noun',
  },
  //a gerund-as-noun - 'swimming'
  Activity: {
    isA: 'Noun',
  },
  //'kilograms'
  Unit: {
    isA: 'Noun',
  },
  //'Canadians'
  Demonym: {
    isA: 'Noun',
  },
  //`john's`
  Possessive: {
    isA: 'Noun',
  },
};

var verbs = {
  Verb: {
    isA: 'VerbPhrase',
  },
  PresentTense: {
    isA: 'Verb',
  },
  Infinitive: {
    isA: 'PresentTense',
  },
  Gerund: {
    isA: 'PresentTense',
  },
  PastTense: {
    isA: 'Verb',
  },
  PerfectTense: {
    isA: 'Verb',
  },
  FuturePerfect: {
    isA: 'Verb',
  },
  Pluperfect: {
    isA: 'Verb',
  },
  Copula: {
    isA: 'Verb',
  },
  Modal: {
    isA: 'Verb',
  },
  Participle: {
    isA: 'Verb',
  },
  Particle: {
    isA: 'Verb',
  },
  PhrasalVerb: {
    isA: 'Verb',
  },
};

var values = {
  Value: {},
  Ordinal: {
    isA: 'Value',
  },
  Cardinal: {
    isA: 'Value',
  },
  Multiple: {
    isA: 'Value',
  },
  RomanNumeral: {
    isA: 'Cardinal',
  },
  Fraction: {
    isA: 'Value',
  },
  TextValue: {
    isA: 'Value',
  },
  NumericValue: {
    isA: 'Value',
  },
  NiceNumber: {
    isA: 'Value',
  },
  Money: {
    //isA: 'Cardinal'
  },
  Percent: {
    isA: 'Value',
  },
};

var dates = {
  Date: {
    isA: 'NounPhrase',
  }, //not a noun, but usually is
  Month: {
    isA: 'Date',
    also: 'Singular',
  },
  WeekDay: {
    isA: 'Date',
    also: 'Noun',
  },
  RelativeDay: {
    isA: 'Date',
  },
  Year: {
    isA: 'Date',
  },
  Duration: {
    isA: 'Date',
    also: 'Noun',
  },
  Time: {
    isA: 'Date',
    also: 'Noun',
  },
  Holiday: {
    isA: 'Date',
    also: 'Noun',
  },
};

var misc = {
  Adjective: {},
  Comparable: {
    isA: 'Adjective',
  },
  Comparative: {
    isA: 'Adjective',
  },
  Superlative: {
    isA: 'Adjective',
  },

  NumberRange: {
    isA: 'Contraction',
  },
  Adverb: {},

  Currency: {
    isA: 'NounPhrase',
  },
  //glue
  Determiner: {
    isA: 'NounPhrase',
  },
  Conjunction: {},
  Preposition: {},
  QuestionWord: {},
  RelativeProunoun: {
    isA: 'Pronoun',
  },
  Expression: {},
  Abbreviation: {},
  Url: {},
  PhoneNumber: {},
  HashTag: {},
  AtMention: {
    isA: 'Noun',
  },
  Emoji: {},
  Email: {},

  //non-exclusive
  Condition: {},
  VerbPhrase: {},
  NounPhrase: {},
  Auxiliary: {},
  Negative: {},
  Contraction: {},

  TitleCase: {},
  CamelCase: {},
  UpperCase: {},
  Hyphenated: {},
  Acronym: {},
  ClauseEnd: {},

  // Quotes
  Quotation: {},
  StartQuotation: {
    isA: 'Quotation',
  },
  EndQuotation: {
    isA: 'Quotation',
  },
  //parentheses
  Parentheses: {},
  EndBracket: {
    isA: 'Parentheses',
  },
  StartBracket: {
    isA: 'Parentheses',
  },
};

//add 'downward' tags (that immediately depend on this one)
const addDownword = function(tags) {
  const keys = Object.keys(tags);
  keys.forEach(k => {
    tags[k].downward = [];
    //look for tags with this as parent
    for (let i = 0; i < keys.length; i++) {
      if (tags[keys[i]].isA && tags[keys[i]].isA === k) {
        tags[k].downward.push(keys[i]);
      }
    }
  });
};
var addDownward = addDownword;

//used for pretty-printing on the server-side
const colors = {
  Noun: 'blue',
  NounPhrase: 'blue',
  Date: 'red',
  Value: 'red',
  Verb: 'green',
  Auxiliary: 'green',
  Negative: 'green',
  VerbPhrase: 'green',
  Preposition: 'cyan',
  Condition: 'cyan',
  Conjunction: 'cyan',
  Determiner: 'cyan',
  Adjective: 'magenta',
  Adverb: 'cyan',
};

//extend tagset with new tags
const addIn = function(obj, tags) {
  Object.keys(obj).forEach(k => {
    tags[k] = obj[k];
  });
};

//add tags to remove when tagging this one
const addConflicts = function(tags) {
  Object.keys(tags).forEach(k => {
    tags[k].notA = {};
    for (let i = 0; i < conflicts.length; i++) {
      let arr = conflicts[i];
      if (arr.indexOf(k) !== -1) {
        arr = arr.filter(a => a !== k);
        arr.forEach(e => {
          tags[k].notA[e] = true;
        });
      }
    }
    tags[k].notA = Object.keys(tags[k].notA);
  });
};

const addColors = function(tags) {
  Object.keys(tags).forEach(k => {
    if (colors[k]) {
      tags[k].color = colors[k];
      return
    }
    if (tags[k].isA && colors[tags[k].isA]) {
      tags[k].color = colors[tags[k].isA];
      return
    }
    if (tags[k].isA && tags[tags[k].isA].color) {
      tags[k].color = tags[tags[k].isA].color;
    }
  });
};

const build = () => {
  let tags = {};
  addIn(nouns, tags);
  addIn(verbs, tags);
  addIn(values, tags);
  addIn(dates, tags);
  addIn(misc, tags);
  //downstream
  addDownward(tags);
  //add enemies
  addConflicts(tags);
  //for nice-logging
  addColors(tags);
  return tags
};
var tags = build();

/** patterns for turning 'bus' to 'buses'*/
const suffixes = {
  a: [[/(antenn|formul|nebul|vertebr|vit)a$/i, '$1ae'], [/([ti])a$/i, '$1a']],

  e: [
    [/(kn|l|w)ife$/i, '$1ives'],
    [/(hive)$/i, '$1s'],
    [/([m|l])ouse$/i, '$1ice'],
    [/([m|l])ice$/i, '$1ice'],
  ],

  f: [
    [/^(dwar|handkerchie|hoo|scar|whar)f$/i, '$1ves'],
    [/^((?:ca|e|ha|(?:our|them|your)?se|she|wo)l|lea|loa|shea|thie)f$/i, '$1ves'],
  ],

  i: [[/(octop|vir)i$/i, '$1i']],

  m: [[/([ti])um$/i, '$1a']],

  n: [[/^(oxen)$/i, '$1']],

  o: [[/(al|ad|at|er|et|ed|ad)o$/i, '$1oes']],

  s: [
    [/(ax|test)is$/i, '$1es'],
    [/(alias|status)$/i, '$1es'],
    [/sis$/i, 'ses'],
    [/(bu)s$/i, '$1ses'],
    [/(sis)$/i, 'ses'],
    [/^(?!talis|.*hu)(.*)man$/i, '$1men'],
    [/(octop|vir|radi|nucle|fung|cact|stimul)us$/i, '$1i'],
  ],

  x: [[/(matr|vert|ind|cort)(ix|ex)$/i, '$1ices'], [/^(ox)$/i, '$1en']],

  y: [[/([^aeiouy]|qu)y$/i, '$1ies']],

  z: [[/(quiz)$/i, '$1zes']],
};

var _01Suffixes = suffixes;

const addE = /(x|ch|sh|s|z)$/;

const trySuffix = function(str) {
  let c = str[str.length - 1];
  if (_01Suffixes.hasOwnProperty(c) === true) {
    for (let i = 0; i < _01Suffixes[c].length; i += 1) {
      let reg = _01Suffixes[c][i][0];
      if (reg.test(str) === true) {
        return str.replace(reg, _01Suffixes[c][i][1])
      }
    }
  }
  return null
};

/** Turn a singular noun into a plural
 * assume the given string is singular
 */
const pluralize = function(str = '') {
  //we have some rules to try-out
  let plural = trySuffix(str);
  if (plural !== null) {
    return plural
  }
  //like 'church'
  if (addE.test(str)) {
    return str + 'es'
  }
  // ¯\_(ツ)_/¯
  return str + 's'
};
var inflect = pluralize;

const endsWith = {
  b: [
    {
      reg: /([^aeiou][aeiou])b$/i,
      repl: {
        pr: '$1bs',
        pa: '$1bbed',
        gr: '$1bbing',
      },
    },
  ],
  d: [
    {
      reg: /(end)$/i,
      repl: {
        pr: '$1s',
        pa: 'ent',
        gr: '$1ing',
        ar: '$1er',
      },
    },
    {
      reg: /(eed)$/i,
      repl: {
        pr: '$1s',
        pa: '$1ed',
        gr: '$1ing',
        ar: '$1er',
      },
    },
    {
      reg: /(ed)$/i,
      repl: {
        pr: '$1s',
        pa: '$1ded',
        ar: '$1der',
        gr: '$1ding',
      },
    },
    {
      reg: /([^aeiou][ou])d$/i,
      repl: {
        pr: '$1ds',
        pa: '$1dded',
        gr: '$1dding',
      },
    },
  ],
  e: [
    {
      reg: /(eave)$/i,
      repl: {
        pr: '$1s',
        pa: '$1d',
        gr: 'eaving',
        ar: '$1r',
      },
    },
    {
      reg: /(ide)$/i,
      repl: {
        pr: '$1s',
        pa: 'ode',
        gr: 'iding',
        ar: 'ider',
      },
    },
    {
      reg: /(ake)$/i,
      repl: {
        pr: '$1s',
        pa: 'ook',
        gr: 'aking',
        ar: '$1r',
      },
    },
    {
      reg: /(a[tg]|i[zn]|ur|nc|gl|is)e$/i,
      repl: {
        pr: '$1es',
        pa: '$1ed',
        gr: '$1ing',
        prt: '$1en',
      },
    },
    {
      reg: /([bd]l)e$/i,
      repl: {
        pr: '$1es',
        pa: '$1ed',
        gr: '$1ing',
      },
    },
    {
      reg: /(om)e$/i,
      repl: {
        pr: '$1es',
        pa: 'ame',
        gr: '$1ing',
      },
    },
  ],

  g: [
    {
      reg: /([^aeiou][ou])g$/i,
      repl: {
        pr: '$1gs',
        pa: '$1gged',
        gr: '$1gging',
      },
    },
  ],
  h: [
    {
      reg: /(..)([cs]h)$/i,
      repl: {
        pr: '$1$2es',
        pa: '$1$2ed',
        gr: '$1$2ing',
      },
    },
  ],
  k: [
    {
      reg: /(ink)$/i,
      repl: {
        pr: '$1s',
        pa: 'unk',
        gr: '$1ing',
        ar: '$1er',
      },
    },
  ],

  m: [
    {
      reg: /([^aeiou][aeiou])m$/i,
      repl: {
        pr: '$1ms',
        pa: '$1mmed',
        gr: '$1mming',
      },
    },
  ],

  n: [
    {
      reg: /(en)$/i,
      repl: {
        pr: '$1s',
        pa: '$1ed',
        gr: '$1ing',
      },
    },
  ],
  p: [
    {
      reg: /(e)(ep)$/i,
      repl: {
        pr: '$1$2s',
        pa: '$1pt',
        gr: '$1$2ing',
        ar: '$1$2er',
      },
    },
    {
      reg: /([^aeiou][aeiou])p$/i,
      repl: {
        pr: '$1ps',
        pa: '$1pped',
        gr: '$1pping',
      },
    },
    {
      reg: /([aeiu])p$/i,
      repl: {
        pr: '$1ps',
        pa: '$1p',
        gr: '$1pping',
      },
    },
  ],

  r: [
    {
      reg: /([td]er)$/i,
      repl: {
        pr: '$1s',
        pa: '$1ed',
        gr: '$1ing',
      },
    },
    {
      reg: /(er)$/i,
      repl: {
        pr: '$1s',
        pa: '$1ed',
        gr: '$1ing',
      },
    },
  ],
  s: [
    {
      reg: /(ish|tch|ess)$/i,
      repl: {
        pr: '$1es',
        pa: '$1ed',
        gr: '$1ing',
      },
    },
  ],

  t: [
    {
      reg: /(ion|end|e[nc]t)$/i,
      repl: {
        pr: '$1s',
        pa: '$1ed',
        gr: '$1ing',
      },
    },
    {
      reg: /(.eat)$/i,
      repl: {
        pr: '$1s',
        pa: '$1ed',
        gr: '$1ing',
      },
    },
    {
      reg: /([aeiu])t$/i,
      repl: {
        pr: '$1ts',
        pa: '$1t',
        gr: '$1tting',
      },
    },
    {
      reg: /([^aeiou][aeiou])t$/i,
      repl: {
        pr: '$1ts',
        pa: '$1tted',
        gr: '$1tting',
      },
    },
  ],

  w: [
    {
      reg: /(..)(ow)$/i,
      repl: {
        pr: '$1$2s',
        pa: '$1ew',
        gr: '$1$2ing',
        prt: '$1$2n',
      },
    },
  ],
  y: [
    {
      reg: /([i|f|rr])y$/i,
      repl: {
        pr: '$1ies',
        pa: '$1ied',
        gr: '$1ying',
      },
    },
  ],

  z: [
    {
      reg: /([aeiou]zz)$/i,
      repl: {
        pr: '$1es',
        pa: '$1ed',
        gr: '$1ing',
      },
    },
  ],
};

var suffixes$1 = endsWith;

const posMap = {
  pr: 'PresentTense',
  pa: 'PastTense',
  gr: 'Gerund',
  prt: 'Participle',
  ar: 'Actor',
};

const doTransform = function(str, obj) {
  let found = {};
  let keys = Object.keys(obj.repl);
  for (let i = 0; i < keys.length; i += 1) {
    let pos = keys[i];
    found[posMap[pos]] = str.replace(obj.reg, obj.repl[pos]);
  }
  return found
};

//look at the end of the word for clues
const checkSuffix = function(str = '') {
  let c = str[str.length - 1];
  if (suffixes$1.hasOwnProperty(c) === true) {
    for (let r = 0; r < suffixes$1[c].length; r += 1) {
      const reg = suffixes$1[c][r].reg;
      if (reg.test(str) === true) {
        return doTransform(str, suffixes$1[c][r])
      }
    }
  }
  return {}
};
var _01Suffixes$1 = checkSuffix;

//non-specifc, 'hail-mary' transforms from infinitive, into other forms
const hasY = /[bcdfghjklmnpqrstvwxz]y$/;

const generic = {
  Gerund: inf => {
    if (inf.charAt(inf.length - 1) === 'e') {
      return inf.replace(/e$/, 'ing')
    }
    return inf + 'ing'
  },

  PresentTense: inf => {
    if (inf.charAt(inf.length - 1) === 's') {
      return inf + 'es'
    }
    if (hasY.test(inf) === true) {
      return inf.slice(0, -1) + 'ies'
    }
    return inf + 's'
  },

  PastTense: inf => {
    if (inf.charAt(inf.length - 1) === 'e') {
      return inf + 'd'
    }
    if (inf.substr(-2) === 'ed') {
      return inf
    }
    if (hasY.test(inf) === true) {
      return inf.slice(0, -1) + 'ied'
    }
    return inf + 'ed'
  },
};

var _02Generic = generic;

//we run this on every verb in the lexicon, so please keep it fast
//we assume the input word is a proper infinitive
const fastConjucate = function(str = '') {
  let found = _01Suffixes$1(str);
  //'buzzing'
  if (found.Gerund === undefined) {
    found.Gerund = _02Generic.Gerund(str);
  }
  //'buzzed'
  if (found.PastTense === undefined) {
    found.PastTense = _02Generic.PastTense(str);
  }
  //'buzzes'
  if (found.PresentTense === undefined) {
    found.PresentTense = _02Generic.PresentTense(str);
  }
  return found
};
var conjugate = fastConjucate;

//takes a basic wordlist and expands it into more words, using science
const doOneWord = function(str, pos, world) {
  //sort words into singular/compound
  if (str.indexOf(' ') === -1) {
    world.lexicon[str] = pos;
  } else {
    let w = str.split(' ')[0];
    world.hasCompound[w] = true; //cache for quick-lookups
    world.compounds[str] = pos;
  }
  //pluralize singular nouns
  if (pos === 'Singular') {
    let plural = inflect(str);
    doOneWord(plural, 'Plural', world);
    return
  }
  if (pos === 'Infinitive') {
    let conj = conjugate(str);
    doOneWord(conj.Gerund, 'Gerund', world);
    doOneWord(conj.PastTense, 'PastTense', world);
    doOneWord(conj.PresentTense, 'PresentTense', world);
    return
  }
};

//one does not simply add a world to the lexicon..
const addWords = function(world, obj) {
  const words = Object.keys(obj);
  for (let i = 0; i < words.length; i += 1) {
    doOneWord(words[i], obj[words[i]], world);
  }
};
var _01AddWords = addWords;

//supported verb forms:
const forms = [null, 'PastTense', 'PresentTense', 'Gerund', 'Participle'];

//simply put these words in our lexicon
const addWords$1 = function(obj, lex) {
  let keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i += 1) {
    let k = keys[i];
    //add infinitive
    lex[k] = 'Infinitive';
    //add other forms
    for (let f = 1; f < forms.length; f += 1) {
      if (obj[k][forms[f]] !== undefined) {
        lex[obj[k][forms[f]]] = forms[f];
      }
    }
  }
};

//unpack this ad-hoc compression format for our verbs
const unpackVerbs = function(str) {
  let verbs = str.split('|');
  return verbs.reduce((h, s) => {
    let parts = s.split(':');
    let prefix = parts[0];
    let ends = parts[1].split(',');
    //grab the infinitive
    let inf = prefix + ends[0];
    if (ends[0] === '_') {
      inf = prefix;
    }
    h[inf] = {};
    //we did the infinitive, now do the rest:
    for (let i = 1; i < forms.length; i++) {
      let word = parts[0] + ends[i];
      if (ends[i] === '_') {
        word = parts[0];
      }
      if (ends[i]) {
        h[inf][forms[i]] = word;
      }
    }
    return h
  }, {})
};

// automatically conjugate the non-irregular verbs
const bulkUp = function(conjugations) {
  const keys = Object.keys(conjugations);
  for (let i = 0; i < keys.length; i += 1) {
    let inf = keys[i];
    let conj = conjugations[inf];
    //do we need to add the rest ourselves?
    if (
      conj.PastTense === undefined ||
      conj.PresentTense === undefined ||
      conj.Gerund === undefined
    ) {
      //this is a little redundant, when we have some forms already
      let auto = conjugate(inf);
      conjugations[inf] = Object.assign(auto, conj);
    }
  }
  return conjugations
};

//bulk-up our irregular verb list
const addVerbs = function(str, lexicon) {
  let conjugations = unpackVerbs(str);
  //ensure all the conjugations are there..
  conjugations = bulkUp(conjugations);
  //add them all to the lexicon
  addWords$1(conjugations, lexicon);
  return conjugations
};
var _02Conjugations = addVerbs;

//put them in our lexicon
const addWords$2 = function(plurals, lex) {
  let keys = Object.keys(plurals);
  for (let i = 0; i < keys.length; i += 1) {
    let k = keys[i];
    lex[k] = 'Singular';
    lex[plurals[k]] = 'Plural';
  }
};

//pull-apart our ad-hoc compression format for irregular plurals
const unpackPlurals = function(str, lexicon) {
  const plurals = str.split(/,/g).reduce((h, s) => {
    let arr = s.split(/\|/g);
    if (arr.length === 3) {
      h[arr[0] + arr[1]] = arr[0] + arr[2];
    } else if (arr.length === 2) {
      h[arr[0]] = arr[0] + arr[1];
    } else {
      h[arr[0]] = arr[0];
    }
    return h
  }, {});
  //add them both to our lexicon..
  addWords$2(plurals, lexicon);
  return plurals
};
var _03Plurals = unpackPlurals;

//add 'downward' tags (that immediately depend on this one)


//extend our known tagset with these new ones
const addTags$1 = function(tags) {
  let out = {};
  Object.keys(tags).forEach(tag => {
    let obj = tags[tag];
    obj.notA = obj.notA || [];
    obj.downward = obj.downward || [];
    out.tags[tag] = obj;
  });
  addDownward(out.tags);
  return out
};
var _04AddTags = addTags$1;

//words that can't be compressed, for whatever reason
var misc$1 = {
  '20th century fox': 'Organization',
  '3m': 'Organization',
  '7 eleven': 'Organization',
  '7-eleven': 'Organization',
  g8: 'Organization',
  'motel 6': 'Organization',
  vh1: 'Organization',
  q1: 'Date',
  q2: 'Date',
  q3: 'Date',
  q4: 'Date',
  //misc
  records: 'Plural',
  '&': 'Conjunction',
};

//nouns that also signal the title of an unknown organization
//todo remove/normalize plural forms
const orgWords = [
  'academy',
  'administration',
  'agence',
  'agences',
  'agencies',
  'agency',
  'airlines',
  'airways',
  'army',
  'assoc',
  'associates',
  'association',
  'assurance',
  'authority',
  'autorite',
  'aviation',
  'bank',
  'banque',
  'board',
  'boys',
  'brands',
  'brewery',
  'brotherhood',
  'brothers',
  'building society',
  'bureau',
  'cafe',
  'caisse',
  'capital',
  'care',
  'cathedral',
  'center',
  'central bank',
  'centre',
  'chemicals',
  'choir',
  'chronicle',
  'church',
  'circus',
  'clinic',
  'clinique',
  'club',
  'co',
  'coalition',
  'coffee',
  'collective',
  'college',
  'commission',
  'committee',
  'communications',
  'community',
  'company',
  'comprehensive',
  'computers',
  'confederation',
  'conference',
  'conseil',
  'consulting',
  'containers',
  'corporation',
  'corps',
  'corp',
  'council',
  'crew',
  'daily news',
  'data',
  'departement',
  'department',
  'department store',
  'departments',
  'design',
  'development',
  'directorate',
  'division',
  'drilling',
  'education',
  'eglise',
  'electric',
  'electricity',
  'energy',
  'ensemble',
  'enterprise',
  'enterprises',
  'entertainment',
  'estate',
  'etat',
  'evening news',
  'faculty',
  'federation',
  'financial',
  'fm',
  'foundation',
  'fund',
  'gas',
  'gazette',
  'girls',
  'government',
  'group',
  'guild',
  'health authority',
  'herald',
  'holdings',
  'hospital',
  'hotel',
  'hotels',
  'inc',
  'industries',
  'institut',
  'institute',
  'institute of technology',
  'institutes',
  'insurance',
  'international',
  'interstate',
  'investment',
  'investments',
  'investors',
  'journal',
  'laboratory',
  'labs',
  // 'law',
  'liberation army',
  'limited',
  'local authority',
  'local health authority',
  'machines',
  'magazine',
  'management',
  'marine',
  'marketing',
  'markets',
  'media',
  'memorial',
  'mercantile exchange',
  'ministere',
  'ministry',
  'military',
  'mobile',
  'motor',
  'motors',
  'musee',
  'museum',
  // 'network',
  'news',
  'news service',
  'observatory',
  'office',
  'oil',
  'optical',
  'orchestra',
  'organization',
  'partners',
  'partnership',
  // 'party',
  "people's party",
  'petrol',
  'petroleum',
  'pharmacare',
  'pharmaceutical',
  'pharmaceuticals',
  'pizza',
  'plc',
  'police',
  'polytechnic',
  'post',
  'power',
  'press',
  'productions',
  'quartet',
  'radio',
  'regional authority',
  'regional health authority',
  'reserve',
  'resources',
  'restaurant',
  'restaurants',
  'savings',
  'school',
  'securities',
  'service',
  'services',
  'social club',
  'societe',
  'society',
  'sons',
  'standard',
  'state police',
  'state university',
  'stock exchange',
  'subcommittee',
  'syndicat',
  'systems',
  'telecommunications',
  'telegraph',
  'television',
  'times',
  'tribunal',
  'tv',
  'union',
  'university',
  'utilities',
  'workers',
];

var orgWords_1 = orgWords.reduce(function(h, str) {
  h[str] = 'Noun';
  return h
}, {});

// here, we grab things from around the repo.
// these are words that aren't packed with efrt, in ../_data.js
// (for whatever reasons)

//words with numbers


//period-abbreviations, like 'blvd'


//organization forms, like 'academy'


//irregular adjective conjugations
// const adjectives = require('../../01-doc/selections/adjectives/irregulars').lexicon;

const result = Object.assign({}, misc$1, abbreviations_1, orgWords_1);
var misc_1 = result;

let isVerbose = false;

/** all configurable linguistic data */
class World {
  constructor() {
    this.lexicon = misc_1;
    this.plurals = {};
    this.conjugations = {};
    this.hasCompound = {};
    this.compounds = {};
    this.tags = Object.assign({}, tags);
    this.plugin(_data);
  }
  /** more logs for debugging */
  verbose(bool) {
    isVerbose = bool;
    return this
  }
  isVerbose() {
    return isVerbose
  }

  /** augment our lingustic data with new data */
  plugin(x) {
    let obj = x;
    if (typeof x === 'string') {
      obj = JSON.parse(x);
    }
    if (obj.words) {
      let words = efrtUnpack(obj.words);
      _01AddWords(this, words);
    }
    if (obj.plurals) {
      let plurals = _03Plurals(obj.plurals, this.lexicon);
      this.plurals = Object.assign(this.plurals, plurals);
    }
    if (obj.conjugations) {
      let conjugations = _02Conjugations(obj.conjugations, this.lexicon);
      this.conjugations = Object.assign(this.conjugations, conjugations); //merge this one properly
    }
    if (obj.tags) {
      let tags = _04AddTags(obj.tags);
      this.tags = Object.assign(this.tags, tags);
    }
  }
  /** helper method for logging + debugging */
  stats() {
    return {
      words: Object.keys(this.lexicon).length,
      plurals: Object.keys(this.plurals).length,
      conjugations: Object.keys(this.conjugations).length,
      compounds: Object.keys(this.compounds).length,
    }
  }
}

//  ¯\_(:/)_/¯
const clone$1 = function(obj) {
  return JSON.parse(JSON.stringify(obj))
};

/** produce a deep-copy of all lingustic data */
World.prototype.clone = function() {
  let w2 = new World();
  //who really knows about this one:
  w2.lexicon = clone$1(this.lexicon);
  w2.plurals = clone$1(this.plurals);
  w2.conjugations = clone$1(this.conjugations);
  w2.tags = clone$1(this.tags);
  return w2
};
var world = World;

/** Give all terms the given tag */
var tag$1 = function(tag, why) {
  this.list.forEach(p => {
    p.terms().forEach(t => t.tag(tag, why, this.world));
  });
  return this
};

/** Remove this term from the given terms */
var untag = function(tag, why) {
  this.list.forEach(p => {
    p.terms().forEach(t => t.unTag(tag, why, this.world));
  });
  return this
};

/** turn on logging for decision-debugging */
var verbose = function(bool) {
  if (bool === undefined) {
    bool = true;
  }
  this.world.verbose = bool;
};
/** create a Doc from the first Term of each phrase */
var term = function(n) {
  let list = this.list.map(p => {
    let term = p.terms(n);
    return p.buildFrom([term])
  });
  return this.buildFrom(list)
};
/** create a Doc from the first Term of each phrase */
var firstTerm = function() {
  let list = this.list.map(p => {
    let term = p.terms(0);
    return p.buildFrom([term])
  });
  return this.buildFrom(list)
};
/** create a Doc from the last Term of each phrase */
var lastTerm$1 = function() {
  let list = this.list.map(p => {
    let term = p.lastTerm();
    return p.buildFrom([term])
  });
  return this.buildFrom(list)
};

var _01Utils$1 = {
	tag: tag$1,
	untag: untag,
	verbose: verbose,
	term: term,
	firstTerm: firstTerm,
	lastTerm: lastTerm$1
};

const eachTerm = function(doc, fn) {
  doc.list.forEach(p => {
    p.terms().forEach(t => t[fn]());
  });
  return doc
};
const eachPhrase = function(doc, fn) {
  doc.list = doc.list.map(p => p[fn]());
  return doc
};

/** turn every letter of every term to lower-cse */
var toLowerCase$1 = function() {
  return eachTerm(this, 'toLowerCase')
};

/** turn every letter of every term to upper case */
var toUpperCase$1 = function() {
  return eachTerm(this, 'toUpperCase')
};

/** upper-case the first letter of each term */
var toTitleCase$1 = function() {
  return eachTerm(this, 'toTitleCase')
};
/** remove start and end whitespace */
var trim$1 = function() {
  return eachPhrase(this, 'trim')
};

/**  */
var wordCount = function() {
  return this.terms().length //TODO: remove implicit terms
};
/**  */
var firstTerm$1 = function() {
  return this.match('^.')
};
/**  */
var lastTerm$2 = function() {
  return this.match('.$')
};
/** use only the first result(s) */
var first = function(n) {
  if (n === undefined) {
    return this.get(n)
  }
  return this.slice(0, n)
};
/** use only the last result(s) */
var last = function(n) {
  if (n === undefined) {
    return this.get(this.list.length - 1)
  }
  let end = this.list.length;
  return this.slice(end - n, end)
};

/** grab a subset of the results*/
var slice = function(start, end) {
  let list = this.list.slice(start, end);
  return this.buildFrom(list)
};
/** use only the nth result*/
var get = function(n) {
  //return an empty result
  if ((!n && n !== 0) || !this.list[n]) {
    return this.buildFrom([])
  }
  let list = [this.list[n]];
  return this.buildFrom(list)
};

/** sample a subset of the results */
var random = function(n) {
  if (!this.found) {
    return this
  }
  let r = Math.floor(Math.random() * this.list.length);
  if (n === undefined) {
    let list = [this.list[r]];
    return this.buildFrom(list)
  }
  //prevent it from going over the end
  if (r + n > this.length) {
    r = this.length - n;
    r = r < 0 ? 0 : r;
  }
  return this.slice(r, r + n)
};

/** remove whitespace and title-case each term */
var toCamelCase = function() {
  this.toTitleCase();
  this.list.forEach(p => {
    //remove whitespace
    p.terms().forEach((t, i) => {
      if (i !== 0) {
        t.preText = '';
      }
      t.postText = '';
    });
  });
  this.tag('#CamelCase', 'toCamelCase');
  return this
};

/** return a flat array of term objects */
var termList = function() {
  return this.list.reduce((arr, p) => {
    let terms = p.terms();
    arr = arr.concat(terms);
    return arr
  }, [])
};

var _02Misc = {
	toLowerCase: toLowerCase$1,
	toUpperCase: toUpperCase$1,
	toTitleCase: toTitleCase$1,
	trim: trim$1,
	wordCount: wordCount,
	firstTerm: firstTerm$1,
	lastTerm: lastTerm$2,
	first: first,
	last: last,
	slice: slice,
	get: get,
	random: random,
	toCamelCase: toCamelCase,
	termList: termList
};

/** add these new terms to the front*/
var prepend$1 = function(str) {
  let phrase = tokenizer.fromText(str, this.pool())[0]; //assume it's one sentence, for now
  this.list.forEach(p => {
    p.prepend(phrase, this);
  });
  return this
};

/** add these new terms to the end*/
var append$1 = function(str) {
  let phrase = tokenizer.fromText(str, this.pool())[0]; //assume it's one sentence, for now
  this.list.forEach(p => {
    p.append(phrase, this);
  });
  return this
};

/** add these new things to the end*/
var concat = function() {
  let list = this.list.slice(0);
  //repeat for any number of params
  for (let i = 0; i < arguments.length; i++) {
    let arg = arguments[i];
    //support a fresh string
    if (typeof arg === 'string') {
      let arr = tokenizer.fromText(arg);
      //TODO: phrase.tagger()?
      list = list.concat(arr);
    } else if (arg.isA === 'Doc') {
      list = list.concat(arg.list);
    } else if (arg.isA === 'Phrase') {
      list.push(arg);
    }
  }
  return this.buildFrom(list)
};

var _03Split$1 = {
	prepend: prepend$1,
	append: append$1,
	concat: concat
};

var _debug = createCommonjsModule(function (module) {
// https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
const reset = '\x1b[0m';

const padEnd = function(str, width) {
  str = str.toString();
  while (str.length < width) {
    str += ' ';
  }
  return str
};

//cheaper than requiring chalk
const colors = {
  green: function(str) {
    return '\x1b[32m' + str + reset
  },
  red: function(str) {
    return '\x1b[31m' + str + reset
  },
  blue: function(str) {
    return '\x1b[34m' + str + reset
  },
  magenta: function(str) {
    return '\x1b[35m' + str + reset
  },
  cyan: function(str) {
    return '\x1b[36m' + str + reset
  },
  yellow: function(str) {
    return '\x1b[33m' + str + reset
  },
  black: function(str) {
    return '\x1b[30m' + str + reset
  },
};

const tagString = function(tags$1) {
  tags$1 = tags$1.map(tag => {
    if (!tags.hasOwnProperty(tag)) {
      return tag
    }
    const c = tags[tag].color || 'blue';
    return colors[c](tag)
  });
  return tags$1.join(', ')
};

//output some helpful stuff to the console
const debug = function(doc) {
  console.log(colors.blue('====='));
  doc.list.forEach(p => {
    console.log(colors.blue('  -----'));
    p.terms().forEach(t => {
      let tags = Object.keys(t.tags);
      let text = t.text || '-';
      if (t.implicit) {
        text = '[' + t.implicit + ']';
      }
      {
        text = colors.yellow(text);
      }
      let word = "'" + text + "'";
      word = padEnd(word, 18);
      let str = colors.blue('  ｜ ') + word + '  - ' + tagString(tags);
      console.log(str);
    });
  });
  console.log('');
  return doc
};
module.exports = debug;
});

// output
var text = function(options = {}) {
  return this.list.reduce((str, p) => str + p.out(options), '')
};
var normal = function(options = {}) {
  options.normal = true;
  return this.list.map(p => p.out(options)).join(' ')
};
var json$2 = function(options = {}) {
  return this.list.map(p => p.json(options))
};
var array = function(options = {}) {
  return this.list.map(p => p.out(options).trim())
};
var debug_1 = function() {
  _debug(this);
  return this
};
//in v7-style - doc.out('text')
var out$2 = function(method) {
  if (method === 'text') {
    return this.text()
  }
  if (method === 'normal') {
    return this.normal()
  }
  if (method === 'json') {
    return this.json()
  }
  if (method === 'array') {
    return this.array()
  }
  if (method === 'debug') {
    _debug(this);
    return this
  }
  return this.text()
};

var _04Output = {
	text: text,
	normal: normal,
	json: json$2,
	array: array,
	debug: debug_1,
	out: out$2
};

var methods$2 = Object.assign(
  {},
  _01Utils$1,
  _02Misc,
  _03Split$1,
  _04Output
);

/** return a new Doc, with this one as a parent */
var match_1$1 = function(reg) {
  //parse-up the input expression
  let regs = syntax_1(reg);
  //try expression on each phrase
  let matches = this.list.reduce((arr, p) => {
    return arr.concat(p.match(regs))
  }, []);
  return this.buildFrom(matches)
};

/** return all results except for this */
var not$2 = function(reg) {
  //parse-up the input expression
  let regs = syntax_1(reg);
  //try expression on each phrase
  let matches = this.list.reduce((arr, p) => {
    return arr.concat(p.not(regs))
  }, []);
  return this.buildFrom(matches)
};

/** return only the first match */
var matchOne = function(reg) {
  let regs = syntax_1(reg);
  let found = this.list.find(p => p.match(regs).length > 0);
  return this.buildFrom([found])
};

/** return a Document with three parts for every match
 * seperate everything before the word, as a new phrase
 */
var split = function(reg) {
  let regs = syntax_1(reg);
  let matches = [];
  this.list.forEach(p => {
    let allFound = p.match(regs);
    //no match, keep it going
    if (allFound.length === 0) {
      matches.push(p);
    }
    allFound.forEach(found => {
      // do it again, at the end
      let last = matches.pop() || p;
      let results = last.splitOn(found); //splits into three parts
      if (results.before) {
        matches.push(results.before);
      }
      if (results.match) {
        matches.push(results.match);
      }
      if (results.after) {
        matches.push(results.after);
      }
    });
  });
  return this.buildFrom(matches)
};

/** return a Document with two parts for every match
 * seperate everything after the word, as a new phrase
 */
var splitAfter = function(reg) {
  let regs = syntax_1(reg);
  let matches = [];
  this.list.forEach(p => {
    let allFound = p.match(regs);
    //no match, return whole phrase
    if (allFound.length === 0) {
      matches.push(p);
    }
    allFound.forEach(found => {
      // apply it to the end, recursively
      let last = matches.pop() || p;
      let results = last.splitOn(found); //splits into three parts
      //merge first and second parts
      if (results.before && results.match) {
        results.before.length += results.match.length;
        matches.push(results.before);
      } else if (results.match) {
        matches.push(results.match);
      }
      // add third part, if it exists
      if (results.after) {
        matches.push(results.after);
      }
    });
  });
  return this.buildFrom(matches)
};

/** return a Document with two parts for every match */
var splitBefore = function(reg) {
  let regs = syntax_1(reg);
  let matches = [];
  this.list.forEach(p => {
    let allFound = p.match(regs);
    //no match, keep it going
    if (allFound.length === 0) {
      matches.push(p);
    }
    allFound.forEach(found => {
      // do it again, at the end
      let last = matches.pop() || p;
      let results = last.splitOn(found); //splits into three parts
      //support multiple-matches per phrase
      if (results.before) {
        matches.push(results.before);
      }
      //merge 'match' and 'after'
      if (results.match && results.after) {
        results.match.length += results.after.length;
        matches.push(results.match);
      } else if (results.match) {
        matches.push(results.match);
      }
    });
  });
  return this.buildFrom(matches)
};

/**Return a boolean if this match exists */
var has = function(reg) {
  let regs = syntax_1(reg);
  let found = this.list.find(p => p.match(regs).length > 0);
  return found !== undefined
};

/** return each current phrase, only if it contains this match */
var if_1 = function(reg) {
  let regs = syntax_1(reg);
  let found = this.list.filter(p => p.match(regs).length > 0);
  return this.buildFrom(found)
};

/** Filter-out any current phrases that have this match*/
var ifNo = function(reg) {
  let regs = syntax_1(reg);
  let found = this.list.filter(p => p.match(regs).length === 0);
  return this.buildFrom(found)
};

/** return only the terms that can be this tag*/
var canBe$2 = function(tag) {
  let world = this.world;
  let matches = this.list.reduce((arr, p) => {
    return arr.concat(p.canBe(tag, world))
  }, []);
  return this.buildFrom(matches)
};

//aliases
// methods.splitOn = methods.split

var match$1 = {
	match: match_1$1,
	not: not$2,
	matchOne: matchOne,
	split: split,
	splitAfter: splitAfter,
	splitBefore: splitBefore,
	has: has,
	if: if_1,
	ifNo: ifNo,
	canBe: canBe$2
};

//these are selections that don't require their own subclasses/methods

/** split-up results by each term */
var terms$1 = function(n) {
  let r = this.match('.');
  if (typeof n === 'number') {
    r = r.get(n);
  }
  return r
};
/** split-up results into multi-term phrases */
var clauses = function(n) {
  let r = this.splitAfter('#ClauseEnd');
  if (typeof n === 'number') {
    r = r.get(n);
  }
  return r
};
/** return anything tagged as a hashtag*/
var hashTags = function(n) {
  let r = this.match('#HashTag').terms();
  if (typeof n === 'number') {
    r = r.get(n);
  }
  return r
};
/** return anything tagged as an organization*/
var organizations = function(n) {
  let r = this.splitAfter('#Comma');
  r = r.match('#Organization+');
  if (typeof n === 'number') {
    r = r.get(n);
  }
  return r
};
/** return anything tagged as a phone number */
var phoneNumbers = function(n) {
  let r = this.splitAfter('#Comma');
  r = r.match('#PhoneNumber+');
  if (typeof n === 'number') {
    r = r.get(n);
  }
  return r
};
/** return anything tagged as a Place*/
var places = function(n) {
  let r = this.splitAfter('#Comma');
  r = r.match('#Place+');
  if (typeof n === 'number') {
    r = r.get(n);
  }
  return r
};
/** return places, people, and organizations*/
var topics = function(n) {
  let r = this.clauses();
  // Find people, places, and organizations
  let yup = r.people();
  yup.concat(r.places());
  yup.concat(r.organizations());
  let ignore = ['someone', 'man', 'woman', 'mother', 'brother', 'sister', 'father'];
  yup = yup.not(ignore);
  //return them to normal ordering
  yup.sort('chronological');
  // yup.unique() //? not sure
  if (typeof n === 'number') {
    yup = yup.get(n);
  }
  return yup
};
/** return anything tagged as a URL*/
var urls = function(n) {
  let r = this.match('#Url');
  if (typeof n === 'number') {
    r = r.get(n);
  }
  return r
};
/** return anything inside parentheses */
var parentheses = function(n) {
  let r = this.match('#Parentheses+');
  //split-up consecutive ones
  r = r.splitAfter('#EndBracket');
  if (typeof n === 'number') {
    r = r.get(n);
  }
  return r
};

/** return any sentences that ask a question */
var questions = function(doc) {
  let list = doc.sentences().list.filter(p => {
    return p.lastTerm().hasQuestionMark()
  });
  return doc.buildFrom(list)
};

/** return any sentences that are not a question */
var statements = function(doc) {
  let list = doc.sentences().list.filter(p => {
    return p.lastTerm().hasQuestionMark() === false
  });
  return doc.buildFrom(list)
};

var find = {
	terms: terms$1,
	clauses: clauses,
	hashTags: hashTags,
	organizations: organizations,
	phoneNumbers: phoneNumbers,
	places: places,
	topics: topics,
	urls: urls,
	parentheses: parentheses,
	questions: questions,
	statements: statements
};

var selections = Object.assign({}, find);

//match 'super bowl' etc. in the lexicon
const tryMultiple = function(terms, t, world) {
  let compounds = world.compounds;
  //try a two-word version
  let txt = terms[t].normal + ' ' + terms[t + 1].normal;
  if (compounds[txt] !== undefined && compounds.hasOwnProperty(txt) === true) {
    terms[t].tag(compounds[txt], 'lexicon-two', world);
    terms[t + 1].tag(compounds[txt], 'lexicon-two', world);
    return true
  }
  //try a three-word version?
  if (t + 2 < terms.length) {
    txt += ' ' + terms[t + 2].normal;
    if (compounds[txt] !== undefined && compounds.hasOwnProperty(txt) === true) {
      terms[t].tag(compounds[txt], 'lexicon-three', world);
      terms[t + 1].tag(compounds[txt], 'lexicon-three', world);
      terms[t + 2].tag(compounds[txt], 'lexicon-three', world);
      return true
    }
  }
  return false
};

//
const checkLexicon = function(terms, world) {
  let lex = world.lexicon;
  let hasCompound = world.hasCompound;

  //go through each term, and check the lexicon
  for (let t = 0; t < terms.length; t += 1) {
    let str = terms[t].normal;
    //is it the start of a compound word, like 'super bowl'?
    if (hasCompound[str] === true && t + 1 < terms.length) {
      let found = tryMultiple(terms, t, world);
      if (found === true) {
        continue
      }
    }
    //try one-word lexicon
    if (lex[str] !== undefined && lex.hasOwnProperty(str) === true) {
      terms[t].tag(lex[str], 'lexicon', world);
    }
  }
  return terms
};
var _01Lexicon = checkLexicon;

const titleCase$1 = /^[A-Z][a-z']/;
const romanNum = /^[IVXCM]+$/;

const oneLetters = {
  a: true,
  i: true,
  //internet-slang
  u: true,
  r: true,
  c: true,
  k: true,
};

//
const checkPunctuation = function(terms, i, world) {
  let t = terms[i];
  let str = t.text;
  //check titlecase (helpful)
  if (titleCase$1.test(str) === true) {
    t.tag('TitleCase', 'punct-rule', world);
  }
  //check hyphenation
  if (t.postText.indexOf('-') !== -1 && terms[i + 1] && terms[i + 1].preText === '') {
    t.tag('Hyphenated', 'has-hyphen', world);
  }
  //check one-letter acronyms like 'john E rockefeller'
  if (str.length === 1 && terms[i + 1] && /[A-Z]/.test(str) && !oneLetters[str.toLowerCase()]) {
    t.tag('Acronym', 'one-letter-acronym', world);
  }
  //roman numerals (not so clever right now)
  if (t.text.length > 1 && romanNum.test(t.text) === true && t.canBe('RomanNumeral')) {
    t.tag('RomanNumeral', 'is-roman-numeral', world);
  }
  //'100+'
  if (/[0-9]\+$/.test(t.text) === true) {
    t.tag('NumericValue', 'number-plus', world);
  }
};
var _02Punctuation$1 = checkPunctuation;

//yep,
//https://github.com/mathiasbynens/emoji-regex/blob/master/index.js
var regex = /(?:0\u20E3\n1\u20E3|2\u20E3|3\u20E3|4\u20E3|5\u20E3|6\u20E3|7\u20E3|8\u20E3|9\u20E3|#\u20E3|\*\u20E3|\uD83C(?:\uDDE6\uD83C(?:\uDDE8|\uDDE9|\uDDEA|\uDDEB|\uDDEC|\uDDEE|\uDDF1|\uDDF2|\uDDF4|\uDDF6|\uDDF7|\uDDF8|\uDDF9|\uDDFA|\uDDFC|\uDDFD|\uDDFF)|\uDDE7\uD83C(?:\uDDE6|\uDDE7|\uDDE9|\uDDEA|\uDDEB|\uDDEC|\uDDED|\uDDEE|\uDDEF|\uDDF1|\uDDF2|\uDDF3|\uDDF4|\uDDF6|\uDDF7|\uDDF8|\uDDF9|\uDDFB|\uDDFC|\uDDFE|\uDDFF)|\uDDE8\uD83C(?:\uDDE6|\uDDE8|\uDDE9|\uDDEB|\uDDEC|\uDDED|\uDDEE|\uDDF0|\uDDF1|\uDDF2|\uDDF3|\uDDF4|\uDDF5|\uDDF7|\uDDFA|\uDDFB|\uDDFC|\uDDFD|\uDDFE|\uDDFF)|\uDDE9\uD83C(?:\uDDEA|\uDDEC|\uDDEF|\uDDF0|\uDDF2|\uDDF4|\uDDFF)|\uDDEA\uD83C(?:\uDDE6|\uDDE8|\uDDEA|\uDDEC|\uDDED|\uDDF7|\uDDF8|\uDDF9|\uDDFA)|\uDDEB\uD83C(?:\uDDEE|\uDDEF|\uDDF0|\uDDF2|\uDDF4|\uDDF7)|\uDDEC\uD83C(?:\uDDE6|\uDDE7|\uDDE9|\uDDEA|\uDDEB|\uDDEC|\uDDED|\uDDEE|\uDDF1|\uDDF2|\uDDF3|\uDDF5|\uDDF6|\uDDF7|\uDDF8|\uDDF9|\uDDFA|\uDDFC|\uDDFE)|\uDDED\uD83C(?:\uDDF0|\uDDF2|\uDDF3|\uDDF7|\uDDF9|\uDDFA)|\uDDEE\uD83C(?:\uDDE8|\uDDE9|\uDDEA|\uDDF1|\uDDF2|\uDDF3|\uDDF4|\uDDF6|\uDDF7|\uDDF8|\uDDF9)|\uDDEF\uD83C(?:\uDDEA|\uDDF2|\uDDF4|\uDDF5)|\uDDF0\uD83C(?:\uDDEA|\uDDEC|\uDDED|\uDDEE|\uDDF2|\uDDF3|\uDDF5|\uDDF7|\uDDFC|\uDDFE|\uDDFF)|\uDDF1\uD83C(?:\uDDE6|\uDDE7|\uDDE8|\uDDEE|\uDDF0|\uDDF7|\uDDF8|\uDDF9|\uDDFA|\uDDFB|\uDDFE)|\uDDF2\uD83C(?:\uDDE6|\uDDE8|\uDDE9|\uDDEA|\uDDEB|\uDDEC|\uDDED|\uDDF0|\uDDF1|\uDDF2|\uDDF3|\uDDF4|\uDDF5|\uDDF6|\uDDF7|\uDDF8|\uDDF9|\uDDFA|\uDDFB|\uDDFC|\uDDFD|\uDDFE|\uDDFF)|\uDDF3\uD83C(?:\uDDE6|\uDDE8|\uDDEA|\uDDEB|\uDDEC|\uDDEE|\uDDF1|\uDDF4|\uDDF5|\uDDF7|\uDDFA|\uDDFF)|\uDDF4\uD83C\uDDF2|\uDDF5\uD83C(?:\uDDE6|\uDDEA|\uDDEB|\uDDEC|\uDDED|\uDDF0|\uDDF1|\uDDF2|\uDDF3|\uDDF7|\uDDF8|\uDDF9|\uDDFC|\uDDFE)|\uDDF6\uD83C\uDDE6|\uDDF7\uD83C(?:\uDDEA|\uDDF4|\uDDF8|\uDDFA|\uDDFC)|\uDDF8\uD83C(?:\uDDE6|\uDDE7|\uDDE8|\uDDE9|\uDDEA|\uDDEC|\uDDED|\uDDEE|\uDDEF|\uDDF0|\uDDF1|\uDDF2|\uDDF3|\uDDF4|\uDDF7|\uDDF8|\uDDF9|\uDDFB|\uDDFD|\uDDFE|\uDDFF)|\uDDF9\uD83C(?:\uDDE6|\uDDE8|\uDDE9|\uDDEB|\uDDEC|\uDDED|\uDDEF|\uDDF0|\uDDF1|\uDDF2|\uDDF3|\uDDF4|\uDDF7|\uDDF9|\uDDFB|\uDDFC|\uDDFF)|\uDDFA\uD83C(?:\uDDE6|\uDDEC|\uDDF2|\uDDF8|\uDDFE|\uDDFF)|\uDDFB\uD83C(?:\uDDE6|\uDDE8|\uDDEA|\uDDEC|\uDDEE|\uDDF3|\uDDFA)|\uDDFC\uD83C(?:\uDDEB|\uDDF8)|\uDDFD\uD83C\uDDF0|\uDDFE\uD83C(?:\uDDEA|\uDDF9)|\uDDFF\uD83C(?:\uDDE6|\uDDF2|\uDDFC)))|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267B\u267F\u2692-\u2694\u2696\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD79\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED0\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3]|\uD83E[\uDD10-\uDD18\uDD80-\uDD84\uDDC0]/g;

//just some of the most common emoticons
//faster than
//http://stackoverflow.com/questions/28077049/regex-matching-emoticons
var list = {
  ':(': true,
  ':)': true,
  ':P': true,
  ':p': true,
  ':O': true,
  ':3': true,
  ':|': true,
  ':/': true,
  ':\\': true,
  ':$': true,
  ':*': true,
  ':@': true,
  ':-(': true,
  ':-)': true,
  ':-P': true,
  ':-p': true,
  ':-O': true,
  ':-3': true,
  ':-|': true,
  ':-/': true,
  ':-\\': true,
  ':-$': true,
  ':-*': true,
  ':-@': true,
  ':^(': true,
  ':^)': true,
  ':^P': true,
  ':^p': true,
  ':^O': true,
  ':^3': true,
  ':^|': true,
  ':^/': true,
  ':^\\': true,
  ':^$': true,
  ':^*': true,
  ':^@': true,
  '):': true,
  '(:': true,
  '$:': true,
  '*:': true,
  ')-:': true,
  '(-:': true,
  '$-:': true,
  '*-:': true,
  ')^:': true,
  '(^:': true,
  '$^:': true,
  '*^:': true,
  '<3': true,
  '</3': true,
  '<\\3': true,
};

//for us, there's three types -
// * ;) - emoticons
// * 🌵 - unicode emoji
// * :smiling_face: - asci-represented emoji

//test for forms like ':woman_tone2:‍:ear_of_rice:'
//https://github.com/Kikobeats/emojis-keywords/blob/master/index.js
const isCommaEmoji = t => {
  if (t.raw.charAt(0) === ':') {
    //end comma can be last or second-last ':haircut_tone3:‍♀️'
    if (t.raw.match(/:.?$/) === null) {
      return false
    }
    //ensure no spaces
    if (t.raw.match(' ')) {
      return false
    }
    //reasonably sized
    if (t.raw.length > 35) {
      return false
    }
    return true
  }
  return false
};

//check against emoticon whitelist
const isEmoticon = t => {
  let str = t.raw.replace(/^[:;]/, ':'); //normalize the 'eyes'
  return list.hasOwnProperty(str)
};

//these are somewhat popular.
const tagEmoji = (term, world) => {
  //test for :keyword: emojis
  if (isCommaEmoji(term) === true) {
    term.tag('Emoji', 'comma-emoji', world);
    term.text = term.raw;
    term.normalizeWhitespace();
  }
  //test for unicode emojis
  if (term.text.match(regex)) {
    term.tag('Emoji', 'unicode-emoji', world);
    term.text = term.raw;
    term.normalizeWhitespace();
  }
  //test for emoticon ':)' emojis
  if (isEmoticon(term) === true) {
    term.tag('Emoji', 'emoticon-emoji', world);
    term.text = term.raw;
    term.normalizeWhitespace();
  }
};
var _03Emoji = tagEmoji;

//these are regexes applied to t.text, instead of t.normal
var startsWith = [
  //#funtime
  [/^#[a-z]+/, 'HashTag'],
  //chillin'
  [/^[a-z]+n[\'’]$/, 'Gerund'],
  //589-3809
  [/^[0-9]{3}-[0-9]{4}$/, 'PhoneNumber'],
  //632-589-3809
  [/^[0-9]{3}[ -]?[0-9]{3}-[0-9]{4}$/, 'PhoneNumber'],

  //dates/times
  [/^[012]?[0-9](:[0-5][0-9])(:[0-5][0-9])$/, 'Time'], //4:32:32
  [/^[012]?[0-9](:[0-5][0-9])?(:[0-5][0-9])? ?(am|pm)$/, 'Time'], //4pm
  [/^[012]?[0-9](:[0-5][0-9])(:[0-5][0-9])? ?(am|pm)?$/, 'Time'], //4:00pm
  [/^[PMCE]ST$/, 'Time'], //PST, time zone abbrevs
  [/^utc ?[+-]?[0-9]+?$/, 'Time'], //UTC 8+
  [/^[a-z0-9]*? o\'?clock$/, 'Time'], //3 oclock
  [/^[0-9]{1,4}-[0-9]{1,2}-[0-9]{1,4}$/, 'Date'], // 03-02-89
  [/^[0-9]{1,4}\/[0-9]{1,2}\/[0-9]{1,4}$/, 'Date'], // 03/02/89

  //money
  [/^[-+]?[$€¥£][0-9]+(.[0-9]{1,2})?$/, ['Money', 'Value']], //like $5.30
  [/^[-+]?[$€¥£][0-9]{1,3}(,[0-9]{3})+(.[0-9]{1,2})?$/, ['Money', 'Value']], //like $5,231.30

  //values
  [/^[0-9\.]{1,4}(st|nd|rd|th)?[-–][0-9\.]{1,4}(st|nd|rd|th)?$/, 'NumberRange'], //5-7
  // '^[0-9]{1,4}[-–][0-9]{1,4}$/, 'NumberRange'], //5-7
  [/^[-+]?[0-9.,]{1,3}(,[0-9.,]{3})+(.[0-9]+)?$/, 'NiceNumber'], //like 5,999.0
  [/^[-+]?[0-9]+(.[0-9]+)?$/, 'NumericValue'], //like +5.0
  [/^.?[0-9]+([0-9,.]+)?%$/, ['Percent', 'Cardinal', 'NumericValue']], //7%  ..
  [/^[0-9]{1,4}\/[0-9]{1,4}$/, 'Fraction'], //3/2ths
  [/^[0-9\.]{1,2}[-–][0-9]{1,2}$/, ['Value', 'NumberRange']], //7-8
  //mc'adams
  [/^ma?c\'.*/, 'LastName'],
  //o'douggan
  [/^o\'[drlkn].*/, 'LastName'],
  //web tags
  [/^\w+@\w+\.[a-z]{2,3}$/, 'Email'], //not fancy
  [/^#[a-z0-9_]{2,}$/, 'HashTag'],
  [/^@\w{2,}$/, 'AtMention'],
  [/^(https?:\/\/|www\.)\w+\.[a-z]{2,3}/, 'Url'], //with http/www
  [/^[\w\.\/]+\.(com|net|gov|org|ly|edu|info|biz|ru|jp|de|in|uk|br)/, 'Url'], //http://mostpopularwebsites.net/top-level-domain

  //slang things
  [/^(lol)+[sz]$/, 'Expression'], //lol
  [/^ma?cd[aeiou]/, 'LastName'], //macdonell - Last patterns https://en.wikipedia.org/wiki/List_of_family_name_affixes
  //starting-ones
  [/^[\-\+]?[0-9][0-9,]*(\.[0-9])*$/, 'Cardinal'], //like 5
  [/^(un|de|re)\\-[a-z]../, 'Verb'],
  [/^[\-\+]?[0-9]+(\.[0-9])*$/, 'NumericValue'],
  [/^https?\:?\/\/[a-z0-9]/, 'Url'], //the colon is removed in normalisation
  [/^www\.[a-z0-9]/, 'Url'],
  [/^(over|under)[a-z]{2,}/, 'Adjective'],
  [/^[0-9]{1,4}\.[0-9]{1,2}\.[0-9]{1,4}$/, 'Date'], // 03-02-89
  //ending-ones
  [/^[0-9]+([a-z]{1,2})$/, 'Value'], //like 5kg
  [/^[0-9][0-9,\.]*(st|nd|rd|r?th)$/, ['NumericValue', 'Ordinal']], //like 5th
];

//regex suffix patterns and their most common parts of speech,
//built using wordnet, by spencer kelly.
//this mapping shrinks-down the uglified build
const Adj = 'Adjective';
const Inf = 'Infinitive';
const Pres = 'PresentTense';
const Sing = 'Singular';
const Past = 'PastTense';
const Adverb = 'Adverb';
const Exp = 'Expression';
const Actor = 'Actor';
const Verb = 'Verb';
const Noun = 'Noun';
const Last = 'LastName';
//the order here matters.

//regexes indexed by mandated last-character
var endsWith$1 = {
  a: [
    [/.[aeiou]na$/, Noun],
    [/.[oau][wvl]ska$/, Last], //polish (female)
    [/.[^aeiou]ica$/, Sing],
    [/^([hyj]a)+$/, Exp], //hahah
  ],
  c: [[/.[^aeiou]ic$/, Adj]],
  d: [
    [/.[ia]sed$/, Adj],
    [/.[gt]led$/, Adj],
    [/.[aeiou][td]ed$/, Past],
    [/.[^aeiou]led$/, Past], //rumbled
    [/[^aeiou]ard$/, Sing],
    [/[aeiou][^aeiou]id$/, Adj],
    [/[aeiou]c?ked$/, Past], //hooked
    [/[^aeiou][aeiou][tvx]ed$/, Past], //boxed
    [/.[vrl]id$/, Adj],
  ],
  e: [
    [/.[lnr]ize$/, Inf],
    [/.[^aeiou]ise$/, Inf],
    [/.[aeiou]te$/, Inf],
    [/.[^aeiou][ai]ble$/, Adj],
    [/.[^aeiou]eable$/, Adj],
    [/.[^aeiou]ive$/, Adj],
  ],
  h: [
    [/.[^aeiouf]ish$/, Adj],
    [/.v[iy]ch$/, Last], //east-europe
    [/^ug?h+$/, Exp], //uhh
    [/^uh[ -]?oh$/, Exp], //uhoh
  ],
  i: [
    [/.[oau][wvl]ski$/, Last], //polish (male)
  ],
  k: [
    [/^(k)+$/, Exp], //kkkk
  ],
  l: [
    [/.[gl]ial$/, Adj],
    [/.[^aeiou]ful$/, Adj],
    [/.[nrtumcd]al$/, Adj],
    [/.[^aeiou][ei]al$/, Adj],
  ],
  m: [
    [/.[^aeiou]ium$/, Sing],
    [/[^aeiou]ism$/, Sing],
    [/^h*u*m+$/, Exp], //mmmmmmm / ummmm / huuuuuummmmmm
    [/^\d+ ?[ap]m$/, 'Date'],
  ],
  n: [[/.[lsrnpb]ian$/, Adj], [/[^aeiou]ician$/, Actor]],
  o: [
    [/^no+$/, Exp], //noooo
    [/^(yo)+$/, Exp], //yoyo
    [/^woo+[pt]?$/, Exp], //woo
  ],
  r: [
    [/.[ilk]er$/, 'Comparative'],
    [/[aeiou][pns]er$/, Sing],
    [/[^i]fer$/, Inf],
    [/.[^aeiou][ao]pher$/, Actor],
  ],
  t: [
    [/.[di]est$/, 'Superlative'],
    [/.[icldtgrv]ent$/, Adj],
    [/[aeiou].*ist$/, Adj],
    [/^[a-z]et$/, Verb],
  ],
  s: [
    [/.[rln]ates$/, Pres],
    [/.[^z]ens$/, Verb],
    [/.[lstrn]us$/, Sing],
    [/[aeiou][^aeiou]is$/, Sing],
    [/[a-z]\'s$/, Noun],
    [/^yes+$/, Exp], //yessss
  ],
  v: [
    [/.[^aeiou][ai][kln]ov$/, Last], //east-europe
  ],
  y: [
    [/.[cts]hy$/, Adj],
    [/.[st]ty$/, Adj],
    [/.[gk]y$/, Adj],
    [/.[tnl]ary$/, Adj],
    [/.[oe]ry$/, Sing],
    [/[rdntkbhs]ly$/, Adverb],
    [/...lly$/, Adverb],
    [/[bszmp]{2}y$/, Adj],
    [/.(gg|bb|zz)ly$/, Adj],
    [/.[aeiou]my$/, Adj],
    [/[ea]{2}zy$/, Adj],
    [/.[^aeiou]ity$/, Sing],
  ],
};

//just a foolish lookup of known suffixes
const Adj$1 = 'Adjective';
const Inf$1 = 'Infinitive';
const Pres$1 = 'PresentTense';
const Sing$1 = 'Singular';
const Past$1 = 'PastTense';
const Avb = 'Adverb';
const Plrl = 'Plural';
const Actor$1 = 'Actor';
const Vb = 'Verb';
const Noun$1 = 'Noun';
const Last$1 = 'LastName';
const Modal = 'Modal';

var suffixList = [
  null, //0
  null, //1
  {
    //2-letter
    ea: Sing$1,
    ia: Noun$1,
    ic: Adj$1,
    ly: Avb,
    "'n": Vb,
    "'t": Vb,
  },
  {
    //3-letter
    que: Adj$1,
    lar: Adj$1,
    ike: Adj$1,
    ffy: Adj$1,
    nny: Adj$1,
    rmy: Adj$1,
    azy: Adj$1,
    oid: Adj$1,
    mum: Adj$1,
    ous: Adj$1,
    end: Vb,
    sis: Sing$1,
    rol: Sing$1,
    ize: Inf$1,
    ify: Inf$1,
    zes: Pres$1,
    nes: Pres$1,
    ing: 'Gerund', //likely to be converted to Adj after lexicon pass
    ' so': Avb,
    "'ll": Modal,
    "'re": 'Copula',
  },
  {
    //4-letter
    teen: 'Value',
    tors: Noun$1,
    amed: Past$1,
    ched: Past$1,
    ends: Vb,
    oses: Pres$1,
    fies: Pres$1,
    ects: Pres$1,
    nded: Past$1,
    cede: Inf$1,
    tage: Inf$1,
    gate: Inf$1,
    vice: Sing$1,
    tion: Sing$1,
    cted: Past$1,
    ette: Sing$1,
    some: Adj$1,
    llen: Adj$1,
    ried: Adj$1,
    gone: Adj$1,
    made: Adj$1,
    fore: Avb,
    less: Avb,
    ices: Plrl,
    ions: Plrl,
    ints: Plrl,
    aped: Past$1,
    lked: Past$1,
    ould: Modal,
    tive: Actor$1,
    sson: Last$1, //swedish male
    czyk: Last$1, //polish (male)
    chuk: Last$1, //east-europe
    enko: Last$1, //east-europe
    akis: Last$1, //greek
    nsen: Last$1, //norway
  },
  {
    //5-letter
    fully: Avb,
    where: Avb,
    wards: Avb,
    urned: Past$1,
    tized: Past$1,
    eased: Past$1,
    ances: Plrl,
    tures: Plrl,
    ports: Plrl,
    ettes: Plrl,
    ities: Plrl,
    rough: Adj$1,
    bound: Adj$1,
    tieth: 'Ordinal',
    ishes: Pres$1,
    tches: Pres$1,
    nssen: Last$1, //norway
    marek: Last$1, //polish (male)
  },
  {
    //6-letter
    keeper: Actor$1,
    logist: Actor$1,
    auskas: Last$1, //lithuania
    teenth: 'Value',
  },
  {
    //7-letter
    sdottir: Last$1, //swedish female
    opoulos: Last$1, //greek
  },
];

//try each of the ^regexes in our list
const tagPrefix = function(term, world) {
  let str = term.normal;
  for (let r = 0; r < startsWith.length; r += 1) {
    if (startsWith[r][0].test(str) === true) {
      term.tag(startsWith[r][1], 'startsWith #' + r, world);
      break
    }
  }
};

const tagSuffix = function(term, world) {
  let str = term.normal;
  let char = str[str.length - 1];
  if (endsWith$1.hasOwnProperty(char) === true) {
    let regs = endsWith$1[char];
    for (let r = 0; r < regs.length; r += 1) {
      if (regs[r][0].test(str) === true) {
        term.tag(regs[r][1], 'endsWith #' + r, world);
        break
      }
    }
  }
};

//sweep-through all suffixes
const knownSuffixes = function(term, world) {
  const len = term.normal.length;
  let max = 7;
  if (len <= max) {
    max = len - 1;
  }
  for (let i = max; i > 1; i -= 1) {
    let str = term.normal.substr(len - i, len);
    if (suffixList[str.length].hasOwnProperty(str) === true) {
      let tag = suffixList[str.length][str];
      term.tag(tag, 'suffix -' + str, world);
      break
    }
  }
};

//all-the-way-down!
const checkRegex = function(term, world) {
  tagPrefix(term, world);
  tagSuffix(term, world);
  knownSuffixes(term, world);
};
var _04Regex = checkRegex;

//'lookups' look at a term by itself
const lookups = function(doc) {
  let terms = doc.termList();
  let world = doc.world;
  //our list of known-words
  _01Lexicon(terms, world);

  //try these other methods
  for (let i = 0; i < terms.length; i += 1) {
    let term = terms[i];
    //or maybe some helpful punctuation
    _02Punctuation$1(terms, i, world);
    // ¯\_(ツ)_/¯
    _03Emoji(term, world);

    //don't overwrite existing tags
    if (Object.keys(term.tags).length > 0) {
      continue
    }
    //maybe we can guess
    _04Regex(term, world);
  }
  return doc
};
var _01Lookups = lookups;

//
const fallbacks = function(doc) {
  let terms = doc.termList();
  let world = doc.world;

  //fallback to a noun...
  doc.list.forEach(p => {
    p.terms().forEach(t => {
      if (t.isKnown() === false) {
        t.tag('Noun', 'noun-fallback');
      }
    });
  });
  return doc
};
var _02Fallbacks = fallbacks;

const hasNegative = /n't$/;

const irregulars = {
  "won't": ['will', 'not'],
  wont: ['will', 'not'],

  "can't": ['can', 'not'],
  cant: ['can', 'not'],
  cannot: ['can', 'not'],

  "shan't": ['should', 'not'],

  //("ain't" has is/was ambiguity)
};

const getRoot = function(str) {
  return str.replace(/n't$/, '')
};

const checkNegative = function(term) {
  //check named-ones
  if (irregulars.hasOwnProperty(term.normal) === true) {
    return irregulars[term.normal]
  }
  //try it normally
  if (hasNegative.test(term.normal) === true) {
    let main = getRoot(term.normal);
    return [main, 'not']
  }
  return null
};
var _01Negative = checkNegative;

//
const checkApostrophe = function(term) {
  return null
};
var _02ApostropheS = checkApostrophe;

//
const irregulars$1 = function(term) {
  return null
};
var _03Irregulars = irregulars$1;

//stitch these words into our sentence
const addContraction = function(phrase, term, arr) {
  //apply the first word to our term
  let first = arr.shift();
  term.implicit = first;
  //add the second one
  // let str = arr.slice(1).join(' ');

  // let find = phrase.fromId(term.id);
  // console.log(find);
  // find.append(str);
};

const contractions = function(doc) {
  doc.list.forEach(p => {
    let terms = p.terms();
    for (let i = 0; i < terms.length; i += 1) {
      let term = terms[i];
      let found = _01Negative(term);
      found = found || _02ApostropheS();
      found = found || _03Irregulars();
      //add them in
      if (found !== null) {
        addContraction(p, term, found);
      }
    }
  });
  return doc
};
var _03Contractions = contractions;

//could this word be an organization
const maybeOrg = function(t) {
  //must be a noun
  if (!t.tags.Noun) {
    return false
  }
  //can't be these things
  if (t.tags.Pronoun || t.tags.Comma || t.tags.Possessive) {
    return false
  }
  //must be one of these
  if (t.tags.TitleCase || t.tags.Organization || t.tags.Acronym || t.tags.Place) {
    return true
  }
  return false
};

const tagOrgs = function(doc, termArr) {
  termArr.forEach(terms => {
    for (let i = 0; i < terms.length; i += 1) {
      let t = terms[i];
      if (orgWords_1[t.normal] !== undefined && orgWords_1.hasOwnProperty(t.normal) === true) {
        // look-backward - eg. 'Toronto University'
        let lastTerm = terms[i - 1];
        if (lastTerm !== undefined && maybeOrg(lastTerm) === true) {
          lastTerm.tag('Organization', 'org-word-1');
          t.tag('Organization', 'org-word-2');
          continue
        }
        //look-forward - eg. University of Toronto
        let nextTerm = terms[i + 1];
        if (nextTerm !== undefined && nextTerm.normal === 'of') {
          if (terms[i + 2] && maybeOrg(terms[i + 2])) {
            t.tag('Organization', 'org-of-word-1');
            nextTerm.tag('Organization', 'org-of-word-2');
            terms[i + 2].tag('Organization', 'org-of-word-3');
            continue
          }
        }
      }
    }
  });
  if (doc.has('#Acronym')) {
    doc
      .match('the [#Acronym]')
      .not('(iou|fomo|yolo|diy|dui|nimby)')
      .tag('Organization', 'the-acronym');
    doc
      .match('#Acronym')
      .match('#Possessive')
      .tag('Organization', 'possessive-acronym');
  }
  // let matches = doc.match(orgWords);
  // console.log(matches);
  return doc
};
var organizations$1 = tagOrgs;

//
const tagAcronyms = function(doc, termArr) {
  termArr.forEach(terms => {
    terms.forEach(t => {
      if (t.isAcronym()) {
        t.tag(['Acronym', 'Noun'], 'acronym-step');
      }
    });
  });
  return doc
};
var acronyms = tagAcronyms;

const apostrophes = /[\'‘’‛‵′`´]/;
//decide if an apostrophe s is a contraction or not
// 'spencer's nice' -> 'spencer is nice'
// 'spencer's house' -> 'spencer's house'

//these are always contractions
const blacklist = ["it's", "that's"];
//
const tagPossessive = function(doc, termArr) {
  termArr.forEach(terms => {
    for (let i = 0; i < terms.length; i += 1) {
      let t = terms[i];

      //known false-positives
      if (blacklist.hasOwnProperty(t.text) === true) {
        continue
      }
      //an end-tick (trailing apostrophe) - flanders', or Carlos'
      if (apostrophes.test(t.postText)) {
        t.tag(['Possessive', 'Noun'], 'end-tick');
        continue
      }
    }
  });
  return doc
};
var possessives = tagPossessive;

//some 'deeper' tagging, based on some basic word-knowledge
const inference = function(doc) {
  let termArr = doc.list.map(p => p.terms());
  acronyms(doc, termArr);
  organizations$1(doc, termArr);
  possessives(doc, termArr);
  return doc
};
var _04Inference = inference;

//mostly pos-corections here
const miscCorrection = function(doc) {
  //ambig prepositions/conjunctions
  if (doc.has('so')) {
    //so funny
    doc
      .match('so #Adjective')
      .match('so')
      .tag('Adverb', 'so-adv');
    //so the
    doc
      .match('so #Noun')
      .match('so')
      .tag('Conjunction', 'so-conj');
    //do so
    doc
      .match('do so')
      .match('so')
      .tag('Noun', 'so-noun');
  }
  if (doc.has('all')) {
    //all students
    doc.match('[all] #Determiner? #Noun').tag('Adjective', 'all-noun');
    //it all fell apart
    doc.match('[all] #Verb').tag('Adverb', 'all-verb');
  }
  //the ambiguous word 'that' and 'which'
  if (doc.has('(that|which)')) {
    //remind john that
    doc
      .match('#Verb #Adverb? #Noun (that|which)')
      .lastTerm()
      .tag('Preposition', 'that-prep');
    //that car goes
    doc
      .match('that #Noun #Verb')
      .firstTerm()
      .tag('Determiner', 'that-determiner');
    //work, which has been done.
    doc.match('#Comma [which] (#Pronoun|#Verb)').tag('Preposition', 'which-copula');
    //things that provide
    // doc.match('#Plural (that|which) #Adverb? #Verb').term(1).tag('Preposition', 'noun-that');
  }
  //like
  if (doc.has('like')) {
    doc.match('just [like]').tag('Preposition', 'like-preposition');
    //folks like her
    doc.match('#Noun [like] #Noun').tag('Preposition', 'noun-like');
    //look like
    doc.match('#Verb [like]').tag('Adverb', 'verb-like');
    //exactly like
    doc
      .match('#Adverb like')
      .not('(really|generally|typically|usually|sometimes|often) like')
      .lastTerm()
      .tag('Adverb', 'adverb-like');
  }

  if (doc.has('#TitleCase')) {
    //FitBit Inc
    doc.match('#TitleCase (ltd|co|inc|dept|assn|bros)').tag('Organization', 'org-abbrv');
    //Foo District
    doc
      .match(
        '#TitleCase+ (district|region|province|county|prefecture|municipality|territory|burough|reservation)'
      )
      .tag('Region', 'foo-district');
    //District of Foo
    doc
      .match('(district|region|province|municipality|territory|burough|state) of #TitleCase')
      .tag('Region', 'district-of-Foo');
  }

  if (doc.has('#Hyphenated')) {
    //air-flow
    doc
      .match('#Hyphenated #Hyphenated')
      .match('#Noun #Verb')
      .tag('Noun', 'hyphen-verb');
    let hyphen = doc.match('#Hyphenated+');
    if (hyphen.has('#Expression')) {
      //ooh-wee
      hyphen.tag('Expression', 'ooh-wee');
    }
  }

  if (doc.has('#Place')) {
    //West Norforlk
    doc
      .match('(west|north|south|east|western|northern|southern|eastern)+ #Place')
      .tag('Region', 'west-norfolk');
    //some us-state acronyms (exlude: al, in, la, mo, hi, me, md, ok..)
    doc
      .match('#City [#Acronym]')
      .match('(al|ak|az|ar|ca|ct|dc|fl|ga|id|il|nv|nh|nj|ny|oh|or|pa|sc|tn|tx|ut|vt|pr)')
      .tag('Region', 'us-state');
  }
  //misc:
  //foot/feet
  doc.match('(foot|feet)').tag('Noun', 'foot-noun');
  doc
    .match('#Value (foot|feet)')
    .term(1)
    .tag('Unit', 'foot-unit');
  //'u' as pronoun
  doc.match('#Conjunction [u]').tag('Pronoun', 'u-pronoun-2');
  //'a/an' can mean 1 - "a hour"
  doc
    .match(
      '(a|an) (#Duration|hundred|thousand|million|billion|trillion|quadrillion|quintillion|sextillion|septillion)'
    )
    .ifNo('#Plural')
    .term(0)
    .tag('Value', 'a-is-one');
  //swear-words as non-expression POS
  //nsfw
  doc.match('holy (shit|fuck|hell)').tag('Expression', 'swears-expression');
  doc
    .match('#Determiner (shit|damn|hell)')
    .term(1)
    .tag('Noun', 'swears-noun');
  doc
    .match('(shit|damn|fuck) (#Determiner|#Possessive|them)')
    .term(0)
    .tag('Verb', 'swears-verb');
  doc
    .match('#Copula fucked up?')
    .not('#Copula')
    .tag('Adjective', 'swears-adjective');
  //6 am
  doc.match('#Holiday (day|eve)').tag('Holiday', 'holiday-day');
  //timezones
  doc
    .match('(standard|daylight|summer|eastern|pacific|central|mountain) standard? time')
    .tag('Time', 'timezone');
  //canadian dollar, Brazilian pesos
  doc.match('#Demonym #Currency').tag('Currency', 'demonym-currency');
  //about to go
  doc
    .match('about to #Adverb? #Verb')
    .match('about to')
    .tag(['Auxiliary', 'Verb'], 'about-to');
  //Doctor john smith jr
  doc.match('#Honorific #Person').tag('Person', 'honorific-person');
  doc.match('#Person (jr|sr|md)').tag('Person', 'person-honorific');
  //right of way
  doc.match('(right|rights) of .').tag('Noun', 'right-of');
  return doc
};

var fixMisc = miscCorrection;

//Determiner-signals
const fixThe = function(doc) {
  if (doc.has('#Determiner')) {
    //the wait to vote
    doc.match('(the|this) [#Verb] #Preposition .').tag('Noun', 'correction-determiner1');
    //the swim
    doc
      .match('(the|those|these) (#Infinitive|#PresentTense|#PastTense)')
      .term(1)
      .tag('Noun', 'correction-determiner2');
    //a staggering cost
    doc.match('(a|an) [#Gerund]').tag('Adjective', 'correction-a|an');
    doc
      .match('(a|an) #Adjective (#Infinitive|#PresentTense)')
      .term(2)
      .tag('Noun', 'correction-a|an2');
    //some pressing issues
    doc.match('some [#Verb] #Plural').tag('Noun', 'correction-determiner6');
    //the test string
    doc.match('#Determiner [#Infinitive] #Noun').tag('Noun', 'correction-determiner7');
    //the orange.
    doc
      .match('#Determiner #Adjective$')
      .not('(#Comparative|#Superlative)')
      .term(1)
      .tag('Noun', 'the-adj-1');
    //the orange is
    doc.match('#Determiner [#Adjective] (#Copula|#PastTense|#Auxiliary)').tag('Noun', 'the-adj-2');
    //the nice swim
    doc.match('(the|this|those|these) #Adjective [#Verb]').tag('Noun', 'the-adj-verb');
    //the truly nice swim
    doc
      .match('(the|this|those|these) #Adverb #Adjective [#Verb]')
      .tag('Noun', 'correction-determiner4');
    //a stream runs
    doc.match('(the|this|a|an) [#Infinitive] #Adverb? #Verb').tag('Noun', 'correction-determiner5');
    //a sense of
    doc.match('#Determiner [#Verb] of').tag('Noun', 'the-verb-of');
    //the threat of force
    doc.match('#Determiner #Noun of [#Verb]').tag('Noun', 'noun-of-noun');
    //a close
    doc.match('#Determiner #Adverb? [close]').tag('Adjective', 'a-close');
    //did a 900, paid a 20
    doc.match('#Verb (a|an) [#Value]').tag('Singular', 'a-value');
    //a tv show
    doc.match('(a|an) #Noun [#Infinitive]').tag('Noun', 'a-noun-inf');
  }
  return doc
};
var fixThe_1 = fixThe;

//
const fixNouns = function(doc) {
  //'more' is not always an adverb
  doc.match('more #Noun').tag('Noun', 'more-noun');
  //the word 'second'
  doc
    .match('[second] #Noun')
    .not('#Honorific')
    .unTag('Unit')
    .tag('Ordinal', 'second-noun');
  //he quickly foo
  doc.match('#Noun #Adverb [#Noun]').tag('Verb', 'correction');
  //fix for busted-up phrasalVerbs
  doc.match('#Noun [#Particle]').tag('Preposition', 'repair-noPhrasal');
  //John & Joe's
  doc.match('#Noun (&|n) #Noun').tag('Organization', 'Noun-&-Noun');
  //Aircraft designer
  doc.match('#Noun #Actor').tag('Actor', 'thing-doer');
  //this rocks
  doc.match('(this|that) [#Plural]').tag('PresentTense', 'this-verbs');
  //by a bear.
  doc
    .match('#Determiner #Infinitive$')
    .lastTerm()
    .tag('Noun', 'a-inf');
  //the western line
  doc
    .match('#Determiner [(western|eastern|northern|southern|central)] #Noun')
    .tag('Noun', 'western-line');
  doc
    .match(
      '(#Determiner|#Value) [(linear|binary|mobile|lexical|technical|computer|scientific|formal)] #Noun'
    )
    .tag('Noun', 'technical-noun');
  //organization
  if (doc.has('#Organization')) {
    doc.match('#Organization of the? #TitleCase').tag('Organization', 'org-of-place');
    doc.match('#Organization #Country').tag('Organization', 'org-country');
    doc
      .match('(world|global|international|national|#Demonym) #Organization')
      .tag('Organization', 'global-org');
  }
  if (doc.has('#Possessive')) {
    //my buddy
    doc.match('#Possessive [#FirstName]').unTag('Person', 'possessive-name');
    //spencer kelly's
    doc
      .match('#FirstName #Acronym? #Possessive')
      .ifNo('#Comma')
      .match('#FirstName #Acronym? #LastName')
      .tag('Possessive');
    //Super Corp's fundraiser
    doc
      .match('#Organization+ #Possessive')
      .ifNo('#Comma')
      .tag('Possessive');
    //Los Angeles's fundraiser
    doc
      .match('#Place+ #Possessive')
      .ifNo('#Comma')
      .tag('Possessive');
  }
  return doc
};
var fixNouns_1 = fixNouns;

//
const fixVerb = function(doc) {
  //still make
  doc.match('[still] #Verb').tag('Adverb', 'still-verb');
  //'u' as pronoun
  doc.match('[u] #Verb').tag('Pronoun', 'u-pronoun-1');
  //is no walk
  doc.match('is no [#Verb]').tag('Noun', 'is-no-verb');
  //different views than
  doc.match('[#Verb] than').tag('Noun', 'correction');
  //her polling
  doc.match('#Possessive [#Verb]').tag('Noun', 'correction-possessive');
  //there are reasons
  doc.match('there (are|were) #Adjective? [#PresentTense]').tag('Plural', 'there-are');
  //jack seems guarded
  doc.match('#Singular (seems|appears) #Adverb? [#PastTense$]').tag('Adjective', 'seems-filled');

  if (doc.has('(who|what|where|why|how|when)')) {
    //the word 'how'
    doc
      .match('^how')
      .tag('QuestionWord', 'how-question')
      .tag('QuestionWord', 'how-question');
    doc
      .match('how (#Determiner|#Copula|#Modal|#PastTense)')
      .term(0)
      .tag('QuestionWord', 'how-is');
    // //the word 'which'
    doc
      .match('^which')
      .tag('QuestionWord', 'which-question')
      .tag('QuestionWord', 'which-question');
    doc
      .match('which . (#Noun)+ #Pronoun')
      .term(0)
      .tag('QuestionWord', 'which-question2');
    doc.match('which').tag('QuestionWord', 'which-question3');
    //where

    //how he is driving
    let word = doc.match('#QuestionWord #Noun #Copula #Adverb? (#Verb|#Adjective)').firstTerm();
    word.unTag('QuestionWord').tag('Conjunction', 'how-he-is-x');
    //when i go fishing
    word = doc.match('#QuestionWord #Noun #Adverb? #Infinitive not? #Gerund').firstTerm();
    word.unTag('QuestionWord').tag('Conjunction', 'when i go fishing');
  }

  if (doc.has('#Copula')) {
    //is eager to go
    doc
      .match('#Copula #Adjective to #Verb')
      .match('#Adjective to')
      .tag('Verb', 'correction');
    //is mark hughes
    doc.match('#Copula [#Infinitive] #Noun').tag('Noun', 'is-pres-noun');

    doc.match('[#Infinitive] #Copula').tag('Noun', 'infinitive-copula');
    //sometimes adverbs - 'pretty good','well above'
    doc
      .match('#Copula (pretty|dead|full|well) (#Adjective|#Noun)')
      .ifNo('#Comma')
      .tag('#Copula #Adverb #Adjective', 'sometimes-adverb');
    //sometimes not-adverbs
    doc.match('#Copula [(just|alone)$]').tag('Adjective', 'not-adverb');
    //jack is guarded
    doc.match('#Singular is #Adverb? [#PastTense$]').tag('Adjective', 'is-filled');
  }
  //went to sleep
  // doc.match('#Verb to #Verb').lastTerm().tag('Noun', 'verb-to-verb');
  //support a splattering of auxillaries before a verb
  let advb = '(#Adverb|not)+?';
  if (doc.has(advb)) {
    //had walked
    doc
      .match(`(has|had) ${advb} #PastTense`)
      .not('#Verb$')
      .tag('Auxiliary', 'had-walked');
    //was walking
    doc
      .match(`#Copula ${advb} #Gerund`)
      .not('#Verb$')
      .tag('Auxiliary', 'copula-walking');
    //been walking
    doc
      .match(`(be|been) ${advb} #Gerund`)
      .not('#Verb$')
      .tag('Auxiliary', 'be-walking');
    //would walk
    doc
      .match(`(#Modal|did) ${advb} #Verb`)
      .not('#Verb$')
      .tag('Auxiliary', 'modal-verb');
    //would have had
    doc
      .match(`#Modal ${advb} have ${advb} had ${advb} #Verb`)
      .not('#Verb$')
      .tag('Auxiliary', 'would-have');
    //would be walking
    doc
      .match(`(#Modal) ${advb} be ${advb} #Verb`)
      .not('#Verb$')
      .tag('Auxiliary', 'would-be');
    //would been walking
    doc
      .match(`(#Modal|had|has) ${advb} been ${advb} #Verb`)
      .not('#Verb$')
      .tag('Auxiliary', 'would-be');
    //infinitive verbs suggest plural nouns - 'XYZ walk to the store'
    // r.match(`#Singular+ #Infinitive`).match('#Singular+').tag('Plural', 'infinitive-make-plural');
  }
  //fall over
  doc
    .match('#PhrasalVerb #PhrasalVerb')
    .lastTerm()
    .tag('Particle', 'phrasal-particle');
  if (doc.has('#Gerund')) {
    //walking is cool
    doc
      .match('#Gerund #Adverb? not? #Copula')
      .firstTerm()
      .tag('Activity', 'gerund-copula');
    //walking should be fun
    doc
      .match('#Gerund #Modal')
      .firstTerm()
      .tag('Activity', 'gerund-modal');
    //running-a-show
    doc.match('#Gerund #Determiner [#Infinitive]').tag('Noun', 'running-a-show');
    //setting records
    // doc.match('#Gerund [#PresentTense]').tag('Plural', 'setting-records');
  }
  //will be cool -> Copula
  if (doc.has('will #Adverb? not? #Adverb? be')) {
    //will be running (not copula
    if (doc.has('will #Adverb? not? #Adverb? be #Gerund') === false) {
      //tag it all
      doc.match('will not? be').tag('Copula', 'will-be-copula');
      //for more complex forms, just tag 'be'
      doc
        .match('will #Adverb? not? #Adverb? be #Adjective')
        .match('be')
        .tag('Copula', 'be-copula');
    }
  }
  return doc
};
var fixVerb_1 = fixVerb;

//
const fixAdjective = function(doc) {
  //still good
  doc
    .match('still #Adjective')
    .match('still')
    .tag('Adverb', 'still-advb');
  //big dreams, critical thinking
  doc.match('#Adjective [#PresentTense]').tag('Noun', 'adj-presentTense');
  //will secure our
  doc.match('will [#Adjective]').tag('Verb', 'will-adj');
  //cheering hard - dropped -ly's
  doc
    .match('#PresentTense (hard|quick|long|bright|slow)')
    .lastTerm()
    .tag('Adverb', 'lazy-ly');
  //his fine
  doc.match('(his|her|its) [#Adjective]').tag('Noun', 'his-fine');
  //
  doc.match('#Noun #Adverb? [left]').tag('PastTense', 'left-verb');
  return doc
};
var fixAdjective_1 = fixAdjective;

//
const fixValue = function(doc) {
  //half a million
  doc.match('half a? #Value').tag('Value', 'half-a-value'); //quarter not ready
  doc.match('#Value and a (half|quarter)').tag('Value', 'value-and-a-half');
  //all values are either ordinal or cardinal
  // doc.match('#Value').match('!#Ordinal').tag('#Cardinal', 'not-ordinal');
  //money
  doc
    .match('#Value+ #Currency')
    .tag('Money', 'value-currency')
    .lastTerm()
    .tag('Unit', 'money-unit');
  doc.match('#Money and #Money #Currency?').tag('Money', 'money-and-money');
  //1 800 PhoneNumber
  doc.match('1 #Value #PhoneNumber').tag('PhoneNumber', '1-800-Value');
  //(454) 232-9873
  doc.match('#NumericValue #PhoneNumber').tag('PhoneNumber', '(800) PhoneNumber');
  //two hundredth
  doc
    .match('#TextValue+')
    .match('#Cardinal+ #Ordinal')
    .tag('Ordinal', 'two-hundredth');
  return doc
};
var fixValue_1 = fixValue;

//sequence of match-tag statements to correct mis-tags
const corrections = function(doc) {
  if (doc.has('#Determiner')) {
    fixThe_1(doc);
  }
  if (doc.has('#Noun')) {
    fixNouns_1(doc);
  }
  if (doc.has('#Verb')) {
    fixVerb_1(doc);
  }
  if (doc.has('#Adjective')) {
    fixAdjective_1(doc);
  }
  if (doc.has('#Value')) {
    fixValue_1(doc);
  }
  fixMisc(doc);
  return doc
};
var _05Correction = corrections;

/** POS-tag all terms in this document */
const tagger = function(doc) {
  // check against any known-words
  doc = _01Lookups(doc);

  // gotta be something. ¯\_(:/)_/¯
  doc = _02Fallbacks(doc);

  //support "didn't" & "spencer's"
  doc = _03Contractions(doc);

  //tag singular/plurals/quotations...
  doc = _04Inference(doc);

  // wiggle-around the tags, so they make more sense
  doc = _05Correction(doc);
  return doc
};
var tagger_1 = tagger;

const addMethod = function(Doc) {
  /**  */
  class Acronyms extends Doc {
    // stripPeriods() {//TODO:finish
    //   return this
    // }
    // addPeriods() {
    //   return this
    // }
  }

  Doc.prototype.acronyms = function(n) {
    let match = this.match('#Acronym');
    if (typeof n === 'number') {
      match = match.get(n);
    }
    return new Acronyms(match.list, this, this.world)
  };
  return Doc
};
var acronyms$1 = addMethod;

const addMethod$1 = function(Doc) {
  /**  */
  class Contractions extends Doc {
    constructor(list, from, world) {
      super(list, from, world);
      this.contracted = null;
    }
    // expand() {}
    // contract() {}
    // expanded() {}
    // contracted() {}
  }

  //find contractable, expanded-contractions
  const findExpanded = r => {
    let remain = r.not('#Contraction');
    let m = remain.match('(#Noun|#QuestionWord) (#Copula|did|do|have|had|could|would|will)');
    m.concat(remain.match('(they|we|you|i) have'));
    m.concat(remain.match('i am'));
    m.concat(remain.match('(#Copula|#Modal|do|does|have|has|can|will) not'));
    return m
  };

  Doc.prototype.acronyms = function(n) {
    //find currently-contracted
    let found = this.match('#Contraction #Contraction #Contraction?');
    found.list = found.list.map(ts => {
      let c = new Contractions(ts.terms, ts.world, ts.refText, ts.refTerms);
      c.contracted = true;
      return c
    });
    //find currently-expanded
    let expanded = findExpanded(this);
    expanded.list.forEach(ts => {
      let c = new Contractions(ts.terms, ts.world, ts.refText, ts.refTerms);
      c.contracted = false;
      found.list.push(c);
    });
    found.sort('chronological');
    //get nth element
    if (typeof n === 'number') {
      found = found.get(n);
    }
    return new Contractions(found.list, this, this.world)
  };
  return Doc
};
var contractions$1 = addMethod$1;

const selections$1 = [acronyms$1, contractions$1];

const extend = function(Doc) {
  selections$1.forEach(addFn => addFn(Doc));
  return Doc
};
var extend_1 = extend;

const methods$3 = {
  misc: methods$2,
  match: match$1,
  selections: selections,
};



/** a parsed text object */
class Doc {
  constructor(list, from, world) {
    this.list = list;
    //quiet these properties in console.logs
    Object.defineProperty(this, 'from', {
      enumerable: false,
      value: from,
    });
    //borrow some missing data from parent
    if (world === undefined && from !== undefined) {
      world = from.world;
    }
    //'world' getter
    Object.defineProperty(this, 'world', {
      enumerable: false,
      value: world,
    });
    //'found' getter
    Object.defineProperty(this, 'found', {
      get: () => this.list.length > 0,
    });
    //'length' getter
    Object.defineProperty(this, 'length', {
      get: () => this.list.length,
    });
    // this is way easier than .constructor.name...
    Object.defineProperty(this, 'isA', {
      get: () => 'Doc',
    });
  }

  /** run part-of-speech tagger on all results*/
  tagger() {
    return tagger_1(this)
  }

  /** pool is stored on phrase objects */
  pool() {
    if (this.list.length > 0) {
      return this.list[0].pool
    }
    return this.all().list[0].pool
  }

  /** return the previous result */
  parent() {
    if (this.from) {
      return this.from
    }
    return this
  }

  /**  return a list of all previous results */
  parents() {
    let arr = [];
    const addParent = function(doc) {
      if (doc.from) {
        arr.push(doc.from);
        addParent(doc.from);
      }
    };
    addParent(this);
    return arr.reverse()
  }

  /** return the root, first document */
  all() {
    return this.parents()[0]
  }
}

/** create a new Document object */
Doc.prototype.buildFrom = function(list) {
  return new Doc(list, this, this.world)
};
/** add new subclass methods */
Doc.prototype.extend = function(fn) {
  fn(this);
  return this
};

Object.assign(Doc.prototype, methods$3.match);
Object.assign(Doc.prototype, methods$3.selections);
Object.assign(Doc.prototype, methods$3.misc);

//add sub-classes
extend_1(Doc);

//aliases
const aliases$1 = {
  unTag: 'untag',
  and: 'match',
  notIf: 'ifNo',
  only: 'if',
  onlyIf: 'if',
};
Object.keys(aliases$1).forEach(k => (Doc.prototype[k] = Doc.prototype[aliases$1[k]]));
var Doc_1 = Doc;

var pkg = getCjsExportFromNamespace(_package$1);

var src = createCommonjsModule(function (module) {
/* global define */





//blast-out our word-lists, just once
let world$1 = new world();

/** parse and tag text into a compromise object  */
const nlp = function(text = '') {
  let list = tokenizer.fromText(text);
  let doc = new Doc_1(list, null, world$1);
  doc.tagger();
  return doc
};

/** uncompress and apply a user-submitted lexicon */
nlp.plugin = function(plugin) {
  world$1.plugin(plugin);
};
nlp.extend = function(fn) {
  fn(Doc_1);
};

/** make a deep-copy of the library state */
nlp.clone = function() {
  world$1 = world$1.clone();
  return this
};

/** re-generate a Doc object from .json() results */
nlp.fromJSON = function(json) {
  let list = tokenizer.fromJSON(json);
  return new Doc_1(list, null, world$1)
};

/** log our decision-making for debugging */
nlp.verbose = function(bool = true) {
  world$1.verbose(bool);
};

/** current version of the library */
nlp.version = pkg.version;

//and then all the exports..
if (typeof self !== 'undefined') {
  self.nlp = nlp; // Web Worker
} else if (typeof window !== 'undefined') {
  window.nlp = nlp; // Browser
} else if (typeof commonjsGlobal !== 'undefined') {
  commonjsGlobal.nlp = nlp; // NodeJS
}
{
  module.exports = nlp;
}
});

export default src;
