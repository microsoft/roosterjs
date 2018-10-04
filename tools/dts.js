'use strict'
var fs = require('fs');
var path = require('path');
var exec = require('child_process').execSync;
var namePlaceholder = '__NAME__';
var regExportFrom = /export([^;]+)from\s+'([^']+)';/gm;
var regImportFrom = /import[^;]+from[^;]+;/gm;
var singleLineComment = /\/\/[^\n]*\n/g;
var multiLineComment = /(^\/\*(\*(?!\/)|[^*])*\*\/\s*)/m;

// 1. [export ][default |declare ](class|interface) <NAME>[ extends| implements <BASECLASS>] {...}
var regClassInterface = /(\/\*(\*(?!\/)|[^*])*\*\/\s*)?(export\s+)?(default\s+|declare\s+)?(interface|class)\s+([a-zA-Z0-9_]+(\s*<[^>]+>)?)((\s+extends|\s+implements)(\s+[0-9a-zA-Z_\.]+(\s*<[^>]+>)?))?\s*{/g;
// 2. [export ][default |declare ]function <NAME>(...)[: <TYPE>];
var regFunction = /(\/\*(\*(?!\/)|[^*])*\*\/\s*)?(export\s+)?(default\s+|declare\s+)?function\s+([a-zA-Z0-9_]+(\s*<[^>]+>)?)\s*(\([^;]+;)/g;
// 3. [export ][default |declare ]const enum <NAME> {...}
var regEnum = /(\/\*(\*(?!\/)|[^*])*\*\/\s*)?(export\s+)?(default\s+|declare\s+)?(const\s+)?enum\s+([a-zA-Z0-9_<>]+)\s*{/g;
// 4. [export ][default |declare ]type <NAME> = ...;
var regType = /(\/\*(\*(?!\/)|[^*])*\*\/\s*)?(export\s+)?(default\s+|declare\s+)?type\s+([0-9a-zA-Z_]+(\s*<[^>]+>)?)\s*=\s*/g;
// 5. [export ][default |declare ]const <NAME>: ...;
var regConst = /(\/\*(\*(?!\/)|[^*])*\*\/\s*)?(export\s+)?(default\s+|declare\s+)?const\s+([0-9a-zA-Z_<>]+)\s*:\s*/g;
// 6. export[ default] <NAME>|{NAMES};
var regExport = /(\/\*(\*(?!\/)|[^*])*\*\/\s*)?(export\s+)(default\s+([0-9a-zA-Z_]+)\s*,?)?(\s*{([^}]+)})?\s*;/g;

function enqueue(queue, filename, exports) {
    if (queue.find(function(v) {
        return v.filename == filename;
    })) {
        return;
    }
    queue.push({
        filename,
        exports,
        elements: {}
    });
}

function parseExports(exports) {
    var reg = /(([^\{\}]+)|\{([^\{\}]*)\})/;
    let match = reg.exec(exports);
    exports = match[2] || match[3] || '';
    if (exports == '*') {
        return null;
    } else {
        var exportArray = exports.split(',');
        var result = {};
        for (var i = 0; i < exportArray.length; i++) {
            if (exportArray[i].trim() == '') {
                continue;
            }
            var itemPair = exportArray[i].split(' as ');
            var name = itemPair[0].trim();
            var as = itemPair[1] ? itemPair[1].trim() : name;
            result[name] = as;
        }
        return result;
    }
}

function parseFrom(from, currentFileName, baseDir, projDir) {
    var importFileName;
    if (from[0] == '.') {
        var currentPath = path.dirname(currentFileName);
        importFileName = path.resolve(currentPath, from + '.d.ts');
    } else {
        importFileName = path.resolve(baseDir, from, 'lib/index.d.ts');
        if (!fs.existsSync(importFileName)) {
            importFileName = path.resolve(projDir, 'node_modules', from, 'lib/index.d.ts');
        }
        if (!fs.existsSync(importFileName)) {
            throw new Error(`Can\t resolve package name ${from} in file ${currentFileName}`);
        }
    }
    return importFileName;
}

function parsePair(content, startIndex, open, close, startLevel, until) {
    var level = startLevel;
    var index = startIndex;
    while (index < content.length) {
        if (content[index] == open) {
            level++;
        } else if (content[index] == close) {
            level--;
            if (level == 0 && !until) {
                break;
            }
        } else if (until && content[index] == until && level == 0) {
            break;
        }
        index++;
    }

    var result = content.substr(startIndex, index + 1 - startIndex);
    content = content.substr(0, startIndex) + content.substr(index + 1);
    return [result, content];
}

function getName(matches, nameIndex) {
    if (matches[3] && matches[4] && matches[4].trim() == 'default') {
        return 'default';
    } else {
        return matches[nameIndex].trim();
    }
}

function appendText(elements, name, text) {
    if (!elements[name]) {
        elements[name] = [];
    }

    elements[name].push(text);
}

function parseClasses(content, elements) {
    var matches;
    while (matches = regClassInterface.exec(content)) {
        var result = parsePair(content, matches.index + matches[0].length, '{', '}', 1);
        var classText = (matches[1] || '') + matches[5] + ' ' + namePlaceholder + (matches[7] || '') + (matches[8] || '') + ' {' + result[0];
        var name = getName(matches, 6);
        appendText(elements, name, classText);
        content = result[1];
    }
    return content.replace(regClassInterface, '');
}

function parseFunctions(content, elements) {
    var matches;
    while (matches = regFunction.exec(content)) {
        var functionText = (matches[1] || '') + 'function ' + namePlaceholder + (matches[6] || '') + matches[7];
        var name = getName(matches, 5);
        appendText(elements, name, functionText);
    }
    return content.replace(regFunction, '');
}

function parseEnum(content, elements) {
    var matches;
    while (matches = regEnum.exec(content)) {
        var result = parsePair(content, matches.index + matches[0].length, '{', '}', 1);
        var enumText = (matches[1] || '') + (matches[5] || '') + 'enum '+ namePlaceholder + ' {' + result[0];
        var name = getName(matches, 6);
        appendText(elements, name, enumText);
        content = result[1];
    }
    return content.replace(regEnum, '');
}

function parseType(content, elements) {
    var matches;
    while (matches = regType.exec(content)) {
        var result = parsePair(content, matches.index + matches[0].length, '{', '}', 0, ';');
        var typeText = (matches[1] || '') + 'type ' + namePlaceholder + (matches[6] || '') + ' = ' + result[0];
        var name = getName(matches, 5);
        appendText(elements, name, typeText);
        content = result[1];
    }

    return content.replace(regType, '');
}

function parseConst(content, elements) {
    var matches;
    while (matches = regConst.exec(content)) {
        var result = parsePair(content, matches.index + matches[0].length, '{', '}', 0, ';');
        var constText = (matches[1] || '') + 'const ' + namePlaceholder + ': ' + result[0];
        var name = getName(matches, 5);
        appendText(elements, name, constText);
        content = result[1];
    }

    return content.replace(regConst, '');
}

function parseExport(content, elements) {
    var matches;
    while (matches = regExport.exec(content)) {
        var defaultExport = matches[5];
        if (defaultExport) {
            elements['default'] = elements[defaultExport];
        }
    }

    return content.replace(regExport, '');
}

function parseExportFrom(content, currentFileName, queue, baseDir, projDir) {
    var matches;
    while (matches = regExportFrom.exec(content)) {
        var exports = parseExports(matches[1].trim());
        var fromFileName = parseFrom(matches[2].trim(), currentFileName, baseDir, projDir);
        enqueue(queue, fromFileName, exports);
    }
    return content.replace(regExportFrom, '');
}

function process(baseDir, queue, index, projDir) {
    var item = queue[index];
    var currentFileName = item.filename
    var file = fs.readFileSync(currentFileName);
    var content = file.toString();

    // 1. Remove single line comments
    content = content.replace(singleLineComment, '');

    // 2. Process 'export ... from ...;'
    content = parseExportFrom(content, currentFileName, queue, baseDir, projDir);

    // 3. Remove imports
    content = content.replace(regImportFrom, '');

    // 4. Parse classes and interfaces
    content = parseClasses(content, item.elements);

    // 5. Parse functions
    content = parseFunctions(content, item.elements);

    // 6. Parse enum
    content = parseEnum(content, item.elements);

    // 7. Parse type
    content = parseType(content, item.elements);

    // 8. Parse const
    content = parseConst(content, item.elements);

    // 9. Parse Export
    content = parseExport(content, item.elements);

    if (content.trim() != '') {
        throw new Error('File ' + currentFileName + ' contains unrecognized content:\r\n' + content);
    }
}

function output(filename, library, queue) {
    var version = JSON.stringify(require(path.join(__dirname, '..', 'package.json')).version).replace(/"/g, '');
    var content = '';
    content += `// Type definitions for roosterjs (Version ${version})\r\n`;
    content += '// Generated by dts tool from roosterjs\r\n';
    content += '// Project: https://github.com/Microsoft/roosterjs\r\n';
    content += '\r\n';

    if (library) {
        content += 'declare namespace ' + library + ' {\r\n';
    }

    for (var i = 0; i < queue.length; i++) {
        var exports = queue[i].exports;
        var elements = queue[i].elements;
        if (exports) {
            for (var name in exports){
                var alias = exports[name];
                var texts = null;
                if (elements[name]) {
                    texts = elements[name];
                } else {
                    for (var n in elements) {
                        if (n.indexOf(alias + '<') == 0) {
                            texts = elements[n];
                            break;
                        }
                    }
                    if (!texts) {
                        throw new Error('Name not found: ' + name + '; alias: ' + alias);
                    }
                }

                for (var text of texts) {
                    text = text.replace(namePlaceholder, alias);

                    if (library) {
                        content += '    ' + text.replace(/\r\n/g, '\r\n    ').trim() + '\r\n\r\n';
                    } else {
                        content += (multiLineComment.test(text) ?
                            text.replace(multiLineComment, '$1export ') :
                            'export ' + text) + '\r\n\r\n';
                    }
                }
            }
        }
    }

    if (library) {
        content += '}';
    }
    fs.writeFileSync(filename, content);

    // Test the .d.ts file
    var options = {
        stdio: 'inherit',
        cwd: __dirname
    };
    exec(`node ../node_modules/typescript/lib/tsc.js ` + filename + ' -outFile nul', options);
    console.log('Type definition file ' + filename + ' generated.');
}

// Param structure
// {
//      projDir: project dir,
//      baseDir: 'base dir, default is current dir',
//      library: 'library name, should be the same with "library" in webpack config
//      output:  'output file name, must be absolute path',
//      include: [
//          included root files, must be relative with baseDir'
//      ]
// }
function main(config) {
    if (!config) {
        throw new Error('config cannot be null');
    }
    if (!config.library) {
        throw new Error('library cannot be empty in config');
    }
    if (!config.include || config.include.length == 0) {
        throw new Error('config.include must contain include file array');
    }

    var projDir = config.projDir || __dirname;
    var baseDir = config.baseDir || __dirname;
    var library = config.library;
    var commonJsOutputName = (config.output || library) + '.d.ts';
    var amdOutputName = (config.output || library) + '-amd.d.ts';
    var include = config.include;
    var queue = [];

    for (var i = 0; i < include.length; i++) {
        var filename = path.resolve(baseDir, include[i]);
        enqueue(queue, filename);
    }

    for (var i = 0; i < queue.length; i++) {
        process(baseDir, queue, i, projDir);
    }
    output(commonJsOutputName, library, queue);
    output(amdOutputName, null, queue);
}

var projDir = path.resolve(__dirname, '..');
var baseDir = path.resolve(projDir, 'dist');
var targetDir = path.resolve(baseDir, 'roosterjs', 'dist');
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
}
main({
    projDir,
    baseDir,
    library: 'roosterjs',
    output: path.resolve(targetDir, 'rooster'),
    include: [
        'roosterjs/lib/index.d.ts'
    ]
});
