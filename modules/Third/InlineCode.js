
const Path = require('@definejs/path');
const File = require('@definejs/file');

module.exports = {
    //读取第三方库的代码，仅适用于整个库只有主文件的情况。
    get(node_modules, id) {
        const home = `${node_modules}${id}/`;
        const pkg = File.readJSON(`${home}package.json`);

        let main = pkg.main;
        
        if (!main) {
            return false;
        }

        main = Path.join(home, main);

        return File.read(main);
    },
};