var config = require('./config');
var _ = require('underscore');

var
    http = require('http'),
    https = require('https'),
    fs = require('fs-extra');

var
    privateKey = fs.readFileSync('./cert/private/server.key'),
    certificate = fs.readFileSync('./cert/certs/server.crt');

var creditentials = {
    key: privateKey,
    cert: certificate
};

var public_folder = '../client';


var
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    path = require('path'),
    formidable = require('formidable'),
    unzip = require('unzip'),
    Q = require('q'),
    rmdir = require('rimraf'),
    spawn = require('child_process').spawn;

var UPLOAD_DIR = './models';

var checkUploadDir = function() {
    fs.exists(UPLOAD_DIR, function(exists) {
        if (!exists) {
            fs.mkdir(UPLOAD_DIR, 0775);
        }
    });
}();

var listModels = function() {
    var
        models = [],
        defer = Q.defer();

    fs.readdir(UPLOAD_DIR, function(err, files) {
        if(err) {
            defer.reject(err);
            console.log(err);
            return;
        }

        if (files) {
            console.log(files);
            files.forEach(function(file) {
                if (file.slice(-4) !== '.zip') {
                    if (fs.statSync(UPLOAD_DIR + '/' + file).isDirectory()) {
                        models.push(file);
                    }
                }
            });
        }

        defer.resolve(models);
    });
    return defer.promise;
};

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', ['X-Requested-With', 'Content-Type', 'Access-Control-Allow-Methods']);
    next();
});

app.get('/', function(req, res) {
    var template = fs.readFileSync(public_folder + '/index.tpl.html');
    var indexHTML = _.template( template.toString());

    //res.send('Make a post to /fileUpload to upload file');
    res.setHeader('Content-Type', 'text/html');
    res.write(indexHTML({
        templates: fs.readFileSync(public_folder + '/templates.tpl.html').toString(),
        scripts: fs.readFileSync(public_folder + '/scripts.tpl.html').toString(),
        withCube: typeof req.query['cube'] != 'undefined'
    }));

    res.end();
});

app.get('/listModels', function (req, res) {
    listModels().then(function (data) {
        res.send(data);
        res.end();
        console.log('models list send');
    });
});



app.post('/fileUpload', function(req, res) {
    var form = new formidable.IncomingForm();
    //Formidable uploads to operating systems tmp dir by default
    form.uploadDir = UPLOAD_DIR;       //set upload directory
    form.keepExtensions = true;     //keep file extension

    form.parse(req, function(err, fields, files) {

        var
        counter = 0,
        keys = Object.keys(files),
        total = keys.length;

        keys.forEach(function (key) {
            if(files[key].name.slice(-3) === 'zip') {
                //Unzip the uploaded model
                fs.createReadStream(files[key].path)
                .on('end', function () {
                    console.log('extracting complete');
                    if (++counter === total) {
                        res.end();
                    }
                })
                .pipe(unzip.Extract({ path: UPLOAD_DIR }));
                fs.unlink(files[key].path, function () {
                    console.log('zip file removed');
                });
            } else {
                fs.rename(files[key].path, UPLOAD_DIR + '/' + files[key].name, function (err) {
                    if (err) {
                        throw err;
                    }
                    console.log('renamed complete');
                });
            }
        });
    });
});

app.use(express.static( public_folder ));

app.use('/server/models', express.static(process.cwd() + '/models' ));
app.use('/models', express.static(process.cwd() + '/models' ));


app.post('/deleteModel/:name', function(req, res) {
    rmdir('models/' + req.params.name, function(err) {
        if(err) {
            console.error(err);
            res.status(500);
        }
        else {
            console.log('deleted: ' + req.params.name);
            res.send({
                status: 'deleted'
            });
        }
        res.end();
    });
});

if (config.http) {
    var httpServer = http.createServer(app);
    httpServer.listen(config.httpPort);
}

if (config.https) {
    var httpsServer = https.createServer(creditentials, app);
    httpsServer.listen(config.httpsPort);
}
