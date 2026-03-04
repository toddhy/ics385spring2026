const zodiac = require('zodiac-signs')('en');
console.log(zodiac.getSignByName('leo'));   // <-- find the bug
console.log(zodiac.getNames());
