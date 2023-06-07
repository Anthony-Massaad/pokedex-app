import chalk from "chalk";
import { chain } from "lodash";

const error = chalk.bold.red;
const warning = chalk.bold.hex("#FFA500");
const info = chalk.bold.green;

const log = (type, msg) => {
  const logMessage = chain(msg)
    .map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : arg))
    .join("")
    .value();
  console.log(`${type}: `, logMessage);
};

export const logger = {
  info: (...msg) => {
    log(info("[Info]"), msg);
  },
  warn: (...msg) => {
    log(warning("[Warn]"), msg);
  },
  error: (...msg) => {
    log(error("[Error]"), msg);
  },
};
