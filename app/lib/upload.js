const Client = require('ftp');
const fs = require('fs');

const c = new Client();

function upload(file_path, save_path) {
    c.connect(global.config.ftp)

    c.on('ready', function() {
        c.put(file_path, save_path,function(err) {
            if (err) throw err;
            c.end();
        });
    });
}

module.exports = {
    upload
}