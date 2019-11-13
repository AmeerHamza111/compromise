const units = '(hundred|thousand|million|billion|trillion|quadrillion|quintillion|sextillion|septillion)'

//
const fixValue = function(doc) {
  let val = doc.if('#Value')
  if (val.found === true) {
    //1 800 PhoneNumber
    val.match('1 #Value #PhoneNumber').tag('PhoneNumber', '1-800-Value')
    //(454) 232-9873
    val.match('#NumericValue #PhoneNumber').tag('PhoneNumber', '(800) PhoneNumber')
    //three trains
    val.match('#Value [#PresentTense]').tag('Plural', 'value-presentTense')
    //money
    val
      .match('#Value+ #Currency')
      .tag('Money', 'value-currency')
      .lastTerm()
      .tag('Unit', 'money-unit')
  }
  //5 kg.
  val.match('#Value #Abbreviation').tag('Value', 'value-abbr')
  //seven point five
  val.match('#Value (point|decimal) #Value').tag('Value', 'value-point-value')
  //minus 7
  val.match('(minus|negative) #Value').tag('Value', 'minus-value')
  // ten grand
  val.match('#Value grand').tag('Value', 'value-grand')
  //quarter million
  val.match('(a|the) [(half|quarter)] #Ordinal').tag('Value', 'half-ordinal')
  //eg 'trillion'
  let mult = val.if(units)
  if (mult.found === true) {
    mult.match('a #Value').tag('Value', 'a-value') //?
    // mult.match('#Ordinal (half|quarter)').tag('Value', 'ordinal-half');//not ready
    mult.match(`${units} and #Value`).tag('Value', 'magnitude-and-value')
  }
  return doc
}
module.exports = fixValue
