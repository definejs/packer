
//针对移动端的配置。
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
        'mobile-app',
        'api',
        'emitter',
        'panel',
        'defaults',
        'mobile-alert',
        'mobile-confirm',
        'mobile-view',
        'toast',
        'package',
        'proxy',
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
    // packages: './temp/mobile/package.json',



    //必选，需要导出的全局对象。
    globalExports: {
        name: 'KISP',

        //可选，需要绑定到全局对象的快捷方法。
        bind: {
            alert: 'Mobile.Alert.show',        //显示一个简易的 alert 对话框。
            confirm: 'Mobile.Confirm.show',    //显示一个简易的 confirm 对话框。
            config: 'Defaults.config',  //设置或获取 definejs 内部模块的默认配置。 会与原有的配置作深度合并。
            data: 'AppModule.data',     //设置或获取应用层模块所关联的自定义数据。
            launch: 'Mobile.App.launch',       //启动应用。
            load: 'Package.load',       //加载指定的分包资源。
            panel: 'Panel.define',      //定义一个 panel。
            proxy: 'Proxy.response',    //设置 API 接口代理。
            route: 'Mobile.App.route',         //绑定应用层子模块的顶级事件。
            view: 'Mobile.View.define',        //定义一个 view。
        },
    },

    //可选，第三方库的配置。
    //默认情况下，工具在打包时会把第三方库的模块代码内联进来，定义成一个完整的模块，但这样会造成打包文件过大。
    //如果要把第三库从打包文件中剥离出去，需要手动指定它在 window 环境下对应的全局名称，
    //如在 npm 模块中 `jquery` 包对应的 window 环境的全局对象名为 `jQuery`。
    thirds: {
        // 'jquery': 'jQuery',                 //在 window 环境中的全局对象为 `jQuery`，而不是 `jquery`。
        // 'circular-json': 'CircularJSON',    //在 window 环境中的全局对象为 `CircularJSON`。
        'font-awesome': true,               //指定为 true，则仅拷贝而不进行模块包装定义。
    },

  
    //以下配置项不建议修改。
    //必选，下载和安装包所要存放的目录。
    tempDir: './temp/mobile/',

    //必选，构建输出的目录。
    outputDir: './output/mobile/',

    //可选，打包完成后需要复制到的目录，以便用于测试和体验。
    // copyDir: './test/htdocs/f/',

   
};