//list of inconsistent parts-of-speech
module.exports = [
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
  ['Pluperfect', 'Copula', 'Modal', 'Participle', 'Infinitive', 'Gerund', 'FuturePerfect', 'PerfectTense'],
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
  ['RomanNumeral', 'Money', 'Acronym'],
  //cases
  ['UpperCase', 'TitleCase', 'CamelCase'],
  //phrases
  ['Verb', 'Noun', 'Adjective', 'Value'], //VerbPhrase',
  //QuestionWord
  ['QuestionWord', 'Verb'],
  //acronyms
  ['Acronym', 'Verb'],
]
