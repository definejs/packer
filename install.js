
const File = require('@definejs/file');
const Directory = require('@definejs/directory');
const { exec, } = require('child_process');
const ora = require('ora');


//使用 `npm insall` 命令安装相应的包。
function install({ tempDir, outputDir, }, next) {
    const loading = ora("downloading...");


    //先清理。
    Directory.clear(`${tempDir}node_modules/`);
    File.delete(`${tempDir}package-lock.json`);
    Directory.clear(outputDir);


    console.log('npm install'.green, `${tempDir}package.json`.cyan);

    //出现加载图标
    loading.start();

    exec(`npm install`, { 'cwd': tempDir, }, function (error, stdout, stderr) {
        if (error) {
            loading.fail();
            return;
        }

        console.log(stdout);
        loading.succeed();
        
        next();

    });


}

module.exports = install;
