//match 'super bowl' etc. in the lexicon
const tryMultiple = function(terms, t, world) {
  let compounds = world.compounds;
  //try a two-word version
  let txt = terms[t].normal + ' ' + terms[t + 1].normal;
  if (compounds[txt] !== undefined && compounds.hasOwnProperty(txt) === true) {
    terms[t].tag(compounds[txt], world, 'lexicon-two');
    terms[t + 1].tag(compounds[txt], world, 'lexicon-two');
    return true;
  }
  //try a three-word version?
  if (t + 2 < terms.length) {
    txt += ' ' + terms[t + 2].normal;
    if (compounds[txt] !== undefined && compounds.hasOwnProperty(txt) === true) {
      terms[t].tag(compounds[txt], 'lexicon-three');
      terms[t + 1].tag(compounds[txt], world, 'lexicon-three');
      terms[t + 2].tag(compounds[txt], world, 'lexicon-three');
      return true;
    }
  }
  return false;
};

//
const checkLexicon = function(doc) {
  let lex = doc.world.lexicon;
  let hasCompound = doc.world.hasCompound;
  let terms = doc.termList();

  //go through each term, and check the lexicon
  for (let t = 0; t < terms.length; t += 1) {
    let str = terms[t].normal;
    //is it the start of a compound word, like 'super bowl'?
    if (hasCompound[str] === true && t + 1 < terms.length) {
      let found = tryMultiple(terms, t, doc.world);
      if (found === true) {
        continue;
      }
    }
    //try one-word lexicon
    if (lex[str] !== undefined && lex.hasOwnProperty(str) === true) {
      terms[t].tag(lex[str], doc.world, 'lexicon');
    }
  }
  return doc;
};
module.exports = checkLexicon;
