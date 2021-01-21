
const $String = require('@definejs/string');
const Bind = require('./GlobalExports/Bind');
const Packages = require('./GlobalExports/Packages');
const RequirePackage = require('./GlobalExports/RequirePackage');


module.exports = {


    render(content, { name$id, globalExports, }) { 
        content = Bind.render(content, globalExports.bind);
        content = Packages.render(content, name$id);
        content = RequirePackage.render(content, globalExports.allowRequirePackage);

        
        //这个放在最后处理，因为别处可能用到 `{__GlobalExports_name__}` 模板串。
        content = $String.format(content, {
            '__GlobalExports_name__': globalExports.name,
        });



        return content;
    },
};