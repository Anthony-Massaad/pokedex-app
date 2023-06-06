import chalk from "chalk";

const error = chalk.bold.red;
const warning = chalk.bold.hex("#FFA500");
const info = chalk.bold.green; 

const log = ([...msg], type) => {
    console.log(`${type}: `, ...msg);
}

export const logger = {
    info: (...msg) => {
        log(msg, info("[Info]"))
    },
    warn: (...msg) => {
        log(msg, warning("[Warn]"))
    },
    error: (...msg) => {
        log(msg, error("[Error]"))
    }
};