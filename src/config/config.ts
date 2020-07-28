import defaultConfig from "./config-dev";
import prodConfig from "./config-prod";

let config;
console.log(`current env is ${process.env.NODE_ENV}`)

if (process.env.NODE_ENV === "development") {
    config = defaultConfig;
} else {
    config = prodConfig;
}

export default config;
