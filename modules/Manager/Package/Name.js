



module.exports = {


    parse(name, scope) { 

        let fullname = name.startsWith(scope) ? name : scope + name;

        return {
            'alias': fullname.slice(scope.length),          //短名称。 如 `dialog`。
            'name': fullname,       //全名。 如 `@definejs/dialog`。
        };
    },
};