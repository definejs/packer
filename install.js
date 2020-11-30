
const File = require('@definejs/file');
const Directory = require('@definejs/directory');
const { exec, } = require('child_process');
const ora = require('ora');


//使用 `npm insall` 命令安装相应的包。
function install(tempDir, dependencies, next) {
    const loading = ora("downloading...");
    const pkg = require('./data/package.sample.json');

    pkg.dependencies = dependencies;


    Directory.clear(tempDir);   //先清空。
    File.writeJSON(`${tempDir}package.json`, pkg);


    console.log('npm install'.green, `${tempDir}package.json`.cyan);

    //出现加载图标
    loading.start();

    exec(`npm install`, { 'cwd': tempDir, }, function (error, stdout, stderr) {
        if (error) {
            loading.fail();
            return;
        }

        loading.succeed();
        next();

    });


}

module.exports = install;
