

const Path = require('@definejs/path');
const $Object = require('@definejs/object');
const File = require('@definejs/file');
const Fn = require('@definejs/fn');



function read(file) {
    if (!File.exists(file)) {
        return {};
    }

    let content = File.read(file);

    let packer = Fn.exec(`
            var module = {};
            var exports = {};
            ${content}
            return module.exports;
        `);

    return packer;
}

function normalize(dir, packer = {}) {
    let file$id = packer.file$id || {};
    let id = packer.id;

    //针对如 { id: 'Mobile.Dialog', } 简写。
    if (id) {
        let file = packer.file || 'index.js';
        file$id[file] = id;
    }

    let fullfile$id = {}; //用完整的路径。

    $Object.each(file$id, (file, id) => {
        file = Path.join(dir, file);
        fullfile$id[file] = id;
    })


    //标准化的 packer 的格式：
    return {
        'file$id': fullfile$id,
    };

}


module.exports = {


    get(dir) { 
        let file = Path.join(dir, 'packer.js');
        let packer = read(file);

        packer = normalize(dir, packer);

        return packer;
    },
};