
const path = require('path');
const Directory = require('@definejs/directory');

const Less = require('./modules/Less');
const Manager = require('./modules/Manager');
const Third = require('./modules/Third');
const UglifyJS = require('./modules/UglifyJS');
const MetaInfo = require('./modules/MetaInfo');


//打包指定的 package，生成最终的文件和一堆元数据。
function render(config, dependencies) {
    const {
        tempDir,
        outputDir,
        copyDir,
        scope,
        globalExports,
        moduleManager,
        thirds,
    } = config;

    const dataDir = path.join(__dirname, './data/');
    const homeDir = `${outputDir}definejs/`;
    const distDir = `${homeDir}dist/`;
    const metaDir = `${homeDir}meta/`;
    const srcDir = `${homeDir}src/`;
    const node_modules = `${tempDir}node_modules/`;


    //过滤出 `@definejs/` 的包。
    const packages = Object.keys(dependencies).filter((name) => {
        return name.startsWith(scope);
    });

    Directory.clear(outputDir);

    Manager.parse(packages, {
        scope,
        dir: node_modules,
    });

    Manager.render({
        dest: `${srcDir}{name}/{id}{ext}`,

        name$sample: {
            '*': `${dataDir}InnerMM.define.sample.js`,
            [`@definejs/${moduleManager}`]: `${dataDir}BaseMM.define.sample.js`,
        },
    });

    Third.parse({
        'id$version': Manager.third$version,
        'id$name': thirds,
        'node_modules': node_modules,
    });

    let thirdFiles = Third.wrapDefine({
        sample: `${dataDir}third.define.sample.js`,
        dest: `${srcDir}{id}.js`,
    });

    Third.copy(outputDir);

    let content = Manager.concat({
        moduleManager,
        globalExports,
        begins: [
            `${dataDir}partial.begin.js`,
            `${dataDir}BaseMM.js`,
            `${dataDir}InnerMM.js`,
        ],
        ends: [
            ...thirdFiles,

            `${dataDir}BaseMM.each.js`,
            `${dataDir}GlobalExports.js`,
            `${dataDir}partial.end.js`,
        ],
        dest: `${distDir}definejs.debug.js`,
    });



    UglifyJS.minify({
        content: content,
        dest: `${distDir}definejs.min.js`,
        error: `${distDir}all.error.debug.js`,
    });


    Less.render({
        minify: false,
        patterns: [`${srcDir}**/*.less`,],
        sample: `${dataDir}sample.debug.css`,
        dest: `${distDir}definejs.debug.css`,
    });

    Less.render({
        minify: true,
        patterns: [`${srcDir}**/*.less`,],
        sample: `${dataDir}sample.min.css`,
        dest: `${distDir}definejs.min.css`,
    });


    //生成元数据，以便查阅和参考。
    MetaInfo.render({
        'id$info': Manager.id$info,
        'name$id': Manager.name$id,
        'name$requires': Manager.name$requires,
        'thirds': thirds,
        'dir': metaDir,
    });




    if (copyDir) {
        Directory.copy(homeDir, `${copyDir}definejs/`);

        Third.each((id, name) => {
            //指定了名称，说明不内联，即把第三方库文件单独出来，此时则要复制。
            if (name) {
                Directory.copy(`${outputDir}${id}/`, `${copyDir}${id}/`);
            }
        });
    }


}

module.exports = render;