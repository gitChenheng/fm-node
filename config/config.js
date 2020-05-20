const defaultConfig = './config-dev.js';
const overrideConfig = './config-prod.js';
const fs = require('fs');

let config = null;
console.log('process.env.NODE_ENV',process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
    config = require(defaultConfig);
} else {
    config = require(defaultConfig);
    try {
        if (fs.statSync(overrideConfig).isFile()) {
            config = Object.assign(config, require(overrideConfig));
        }
    } catch (err) {
        console.log(`Cannot load ${overrideConfig}.`);
    }
}

module.exports = config;
