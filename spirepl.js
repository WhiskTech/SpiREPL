#!/usr/bin/env node
var g = global;
var repl = require('repl');
var resolve = require('resolve');
var path = require('path');
g.require = function(name) {
    return require(resolve.sync(name, {basedir: path.dirname(file)}));
}
g.module = { exports: {} }
g.exports = g,module.exports;

var fs = require('fs');
var vm = require('vm');
var context = {};
var file = process.argv[2];
console.log('Welcome to SpiREPL!');
console.log('This REPL will automatically reload whenever you save ' + file + '.');
console.log('Have fun! (please note, no message is given out when the REPL reloads)')
var r = repl.start({});
var loads = 0;
function reload() {
    loads++;
    g.loads = loads;
    r.context = vm.createContext(g);
    fs.readFile(file, function(err, res) {
        if (err) {
            throw err;
        }
        try {
            vm.runInContext(res, r.context, res);
        }
        catch (error) {
            console.log('\n' + error.stack + '\n')
        }
    });
}

fs.watch(file, function(event, filename) {
    if (event == 'change') {
        reload();
    }
});
reload();
