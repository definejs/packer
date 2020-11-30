const File = require('@definejs/file');

module.exports = {


    get(file) {
        let sample = File.read(file);
        sample = sample.replace('    //{code}', '{code}');

        return sample;
    }
};