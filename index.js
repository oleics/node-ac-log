
var pino = require('pino');

var LOG_LEVEL = process.env.LOG_LEVEL || 'info';

var log;

var LOG_LEVEL_ENV_VAR = 'LOG_LEVEL';
var DEFAULT_LOG_LEVEL = 'info';

module.exports = initLog;

function initLog(options) {
  if(log != null) {
    if(typeof options === 'string' || options instanceof String) {
      options = {
        name: options
      };
    }
    return log.child(options);
  }

  if(options == null) options = {};
  if(options.levelEnvVar == null) options.levelEnvVar = LOG_LEVEL_ENV_VAR;
  if(options.level == null) options.level = process.env[options.levelEnvVar] || DEFAULT_LOG_LEVEL;
  if(options.pretty == null) options.pretty = false;
  if(options.timestamp == null) options.timestamp = true;
  if(options.name == null) options.name = 'stdlog';

  if(options.pretty) {
    var pretty = pino.pretty({});
    pretty.pipe(process.stdout);
    log = pino({
      name: options.name,
      safe: true,
      level: options.level,
      timestamp: options.timestamp
    }, pretty);
  } else {
    log = pino({
      name: options.name,
      safe: true,
      level: options.level,
      timestamp: options.timestamp
    });
  }

  var key;
  for(key in log) {
    if(log.hasOwnProperty(key) && typeof log[key] === 'function') {
      initLog[key] = log[key].bind(log);
    }
  }
  if(initLog.child == null) initLog.child = log.child.bind(log);

  return log;
}
