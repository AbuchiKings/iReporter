require('babel-polyfill')
const bcrypt = require('bcrypt')

let pass = 'qwerty';
(async () => {
    const result = await bcrypt.hash(pass, 10);
    console.log(result);
})()