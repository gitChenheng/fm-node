const defaultConfig = './config-dev.js';
const prodConfig = './config-prod.js';

let config;
console.log('process.env.NODE_ENV',process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
    config = require(defaultConfig);
} else {
    config = require(prodConfig);
}

module.exports = config;
