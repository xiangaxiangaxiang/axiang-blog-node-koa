const Client = require('ftp');
const fs = require('fs');

const ftp = new Client();

// 上传文件到ftp服务器
function upload(pathlist) {
    ftp.connect(global.config.ftp)

    console.log(pathlist)
    ftp.on('ready', function() {
        for (let i in pathlist) {
            ftp.put(pathlist[i].filePath, pathlist[i].savePath,function(err) {
                if (err) {
                    ftp.end();
                    throw err
                }
            });
        }
        ftp.end()
    });
}

module.exports = {
    upload
}