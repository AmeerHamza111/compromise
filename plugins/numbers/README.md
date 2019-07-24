<div align="center">
  <img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" />

  <div>parse and format numbers in text</div>
  <div>a plugin for <a href="https://github.com/spencermountain/compromise/">compromise</a></div>
  
  <!-- npm version -->
  <a href="https://npmjs.org/package/compromise-values">
    <img src="https://img.shields.io/npm/v/compromise-numbers.svg?style=flat-square" />
  </a>
  
  <!-- file size -->
  <a href="https://unpkg.com/spacetime/builds/compromise-numbers.min.js">
    <img src="https://badge-size.herokuapp.com/spencermountain/compromise-values/master/builds/compromise-numbers.min.js" />
  </a>
   <hr/>
</div>

<div align="center">
  <code>npm install compromise-numbers</code>
</div>

```js
const nlp = require('compromise')
nlp.extend(require('compromise-numbers'))

let doc = nlp('I’d like to request seventeen dollars for a push broom rebristling')
doc.numbers().debug()
// 17
```


MIT