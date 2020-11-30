# @definejs/packer

这是一个打包工具，不属于 `@definejs` 中的某个模块。

把 npm 上的 `@definejs/` 域内的其它模块打包成适用于浏览器端的模块或单一的库。


## 安装
``` bash
npm install @definejs/packer
```

## 运行打包
### 配置文件
根目录下有三个配置文件，它们是互相独立的。
 - `config.default.js` 默认的配置。
 - `config.mobile.js` 针对移动端的配置，打包出来的库文件适用于移动端开发。 可以根据需要自行修改。
 - `config.pc.js` 针对 PC 端的配置，打包出来的库文件适用于PC 端开发。 可以根据需要自行修改。

### 使用默认配置
``` bash
npm start

或 

npm run default
```

### 使用移动端的配置
会加载 `config.mobile.js` 文件中的配置，打包后的库文件可用于移动端开发。
``` bash
npm run mobile
```

### 使用 PC 端的配置
会加载 `config.pc.js` 文件中的配置，打包后的库文件可用于 PC 端开发。
``` bash
npm run pc
```
## 简介

> `@definejs/` 域内的模块都是在 npm 上面的，符合 CommonJS 规范，可以直接用于 node 端，也可以通过 webpack 打包工具用于浏览器端。

如果想把相关的模块打包成一个库，以用于浏览器端的页面中，则需要使用其它的打包方式，本工具则是为了解决此问题而诞生的。通过本工具打包成一个单一的库文件 `definejs.debug.js` 和 `definejs.min.js` 后，可以直接用于浏览器端的页面中。

用于开发环境：
``` html
<link rel="stylesheet" href="definejs.debug.css" />
<script src="definejs.debug.js"></script>
```

用于生产环境：
``` html
<link rel="stylesheet" href="definejs.min.css" />
<script src="definejs.min.js"></script>
```

由于 `@definejs/` 域内的模块都是通过 npm 进行管理的，只需要指定要打包的种子包名，本工具即可自动分析出依赖关系，把所有相关的依赖包都一起打包成一个文件。 例如用户指定要对 `@definejs/emitter` 进行打包，由于它还依赖了 `@definejs/object`、`@definejs/tree`，则工具会把它们三个都一起打包，用户只需要指定`@definejs/emitter` 作为要打包的种子 package 即可，无需关心它依赖的 package `@definejs/object`、`@definejs/tree`。

每个 package 内包含多个模块文件，一个 package 内只能包含一个主模块文件，package 内的其它模块文件则服务于主模块。为了把 node 端的模块打包成浏览器端的模块，需要对它进行 `define()` 函数的包裹：

``` js
define('API', function (require, module, exports) {
	const Ajax = module.require('Ajax');
	//module.exports = ....
});
```

同一个 package 内，主模块与其它模块之间形成一棵树的关系，在用 `define()` 函数包裹后，它们的内在关系也会形成形成一棵树：

``` js
define('API/Ajax', function (require, module, exports) {
	//module.exports = ....
});
```
上面的 `API` 模块与 `Ajax` 模块是上下级关系，只有直接上级能调用直接下级，即只有 `API` 模块能加载 `Ajax` 模块：在 `API` 模块里通过 `module.require('Ajax')` 的方式。

##配置项 config.default.js

``` js


//默认的配置。
module.exports = {
    //必选，是否需要通过 `npm install` 进行安装包。
    //在某些情况下，为了加快打包速度，可以避免重复下载和安装包。
    //指定为 true，则会删除之前的包（如果存在），并且重新下载和安装包。
    //指定为 false，可以复用之前已安装下好的包，请确保 tempDir 目录中的包已存在。
    install: true,

    //必选，需要打包的种子 package 名称列表，会自动搜索所有依赖的包。
    //包的域名 `@definejs/` 可加可不加，如果不加，则工具会自动补全。
    //这些种子包会给添加到 tempDir 目录中的 package.json 文件中的 dependencies 字段中。
    packages: [

    ],

    // //以下方式可以指定版本号，必须使用全名称，即包括域名 `@definejs/`。
    // packages: {
    //     '@definejs/api': '^0.1.0',
    // },

    // //当指定为 true 时，则使用 tempDir 目录中 package.json 文件中的 dependencies 字段。
    // //请确保 tempDir 目录中 package.json 文件存在。
    // packages: true,

    // //当指定为某个具体的 package.json 文件时，则使用里面的 dependencies 字段。
    // //请确保指定的 package.json 文件存在。
    // packages: './temp/default/package.json',



    //必选，需要导出的全局对象。
    globalExports: {
        name: 'KISP', 

        //可选，需要绑定到全局对象的快捷方法。
        bind: {

        },
    },


    //以下配置项不建议修改。
    //必选，下载和安装包所要存放的目录。
    tempDir: './temp/default/',

    //必选，构建输出的目录。
    outputDir: './output/default/',

    //可选，打包完成后需要复制到的目录，以便用于测试和体验。
    copyDir: './test/htdocs/f/',


    //以下配置项是必须的，不能修改。

    //域名。
    scope: '@definejs/',

    //模块管理器对应的包名。
    moduleManager: 'module-manager',

};
```


