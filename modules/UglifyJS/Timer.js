

let begin = 0;
let end = 0;

module.exports = {
    start() { 
        begin = new Date();
    },

    stop() { 

        end = new Date();

        return end - begin;
    },
};