var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var childProcess = require('child_process');

var conf = require('./conf');

var parseJson = function (content) {
    // Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
    // because the buffer-to-string conversion in `fs.readFileSync()`
    // translates it to FEFF, the UTF-16 BOM.
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
    }
    try {
        return JSON.parse(content);
    } catch (e) {
        return null;
    }
};

var reserved = [];
var userFilePath = path.join(process.cwd(), 'routes', 'data', 'user.json');
var users = null;
fs.readFile(userFilePath, 'utf8', function (err, result) {
    if (result)
        users = parseJson(result);
});

/* GET home page. */
router.get('/', function (req, res, next) {
    fs.readFile(path.join(process.cwd(), 'views', 'index.html'), 'utf8', function (err, result) {
        if (err) {
            res.status(404).end(err.message);
            return;
        }
        res.send(result);
    });
});

router.get('/client/getDomain', function (req, res) {
    var name = req.query.name;
    if (reserved.indexOf(name) > -1) {
        res.json({ code: 900, message: '用户名被占用' });
        return;
    }
    var password = req.query.password;
    if (users[name] && users[name].password !== password) {
        res.json({ code: 900, message: '密码不对' });
        return;
    }
    var iport = 'http://' + req.query.iport + '/';
    var domain = name + 'liangliang.com';
    var resDomain = 'http://' + domain + '/';
    if (!users[name]) {
        users[name] = {
            password: password,
            iport: iport
        };
    } else {
        users[name].iport = iport;
    }
    var config = conf(domain, iport);
    var stream = fs.createWriteStream('/etc/nginx/conf.d/' + name + '.conf');
    stream.end(config, function (err, result) {
        if (err) {
            res.json({ code: 900, message: err.message });
            return;
        }
        res.json({ code: 200, data: { domain: resDomain } });
        fs.writeFile(userFilePath, JSON.stringify(users, null, '\t'));
        try {
            childProcess.execSync('systemctl reload nginx');
        } catch (e) {
            console.log(e.message);
        }
    });
});

module.exports = router;
