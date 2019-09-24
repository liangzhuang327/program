var fs = require('fs');
var path = require('path');
var log4js = require('log4js');

fs.existsSync('logs') || fs.mkdirSync('logs');
log4js.configure(path.resolve(__dirname, 'default.json'));
var DEFAULT_FORMAT = ':remote-addr - -' +
    ' ":method :url HTTP/:http-version"' +
    ' :status :response-timems ":referrer"' +
    ' ":user-agent"';
var logger = log4js.getLogger('domain');
logger.setLevel('INFO');
exports.logger = logger;
exports.use = function (app) {
    app.use(log4js.connectLogger(logger, { level: 'auto', format: DEFAULT_FORMAT }));
}