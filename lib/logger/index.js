/* eslint-disable no-console */
/* global console */
import { flatten, invert, map, tail } from 'lodash';
import chalk from 'chalk';

/**
 * Output data with a certain color
 *
 * @param {any} originalArguments - Data to be logged
 * @param {any} color - Color to be used for output
 * @return {void}
 */
const outputWithColor = function(originalArguments, color) {
  const args = flatten(originalArguments);
  const argValues = map(tail(args), (value) => chalk[color](value)).join('\n');
  const value = chalk.bold[color](args[0]) + '\n' + argValues;
  console.log(value.trim());
};

const orderedLoglevels = [
  'debug',
  'info',
  'success',
  'warn',
  'error',
  'silent',
];

const loglevel = invert(orderedLoglevels);

/**
 * Create a logger service
 *
 * @export
 * @param {any} [currentLoglevel={}] - Logger options
 * @returns {Logger} A new logger instance
 */
export default function(currentLoglevel = {}) {
  const  loglevelSeverity = loglevel[currentLoglevel] || loglevel.info;
  const isLogHidden = (currentLevel) => loglevelSeverity > currentLevel;

  return {
    debug() {
      if (isLogHidden(loglevel.debug)) return;
      const args = flatten(arguments);
      console.log(`[DEBUG][${new Date()}]`, args.join('\n').trim());
    },

    newline() {
      if (isLogHidden(loglevel.info)) return;
      console.log('');
    },

    info() {
      if (isLogHidden(loglevel.info)) return;
      const args = flatten(arguments);
      console.log(args.join('\n').trim());
    },

    success() {
      if (isLogHidden(loglevel.success)) return;
      outputWithColor.call(this, arguments, 'green');
    },

    warn() {
      if (isLogHidden(loglevel.warn)) return;
      outputWithColor.call(this, arguments, 'yellow');
    },

    error() {
      if (isLogHidden(loglevel.error)) return;
      outputWithColor.call(this, arguments, 'red');
    }
  }
}
