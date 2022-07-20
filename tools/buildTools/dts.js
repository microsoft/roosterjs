'use strict';

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const mkdirp = require('mkdirp');
const {
    rootPath,
    distPath,
    roosterJsDistPath,
    mainPackageJson,
    nodeModulesPath,
    runNode,
    err,
    packages,
    roosterJsUiDistPath,
    packagesUI,
    getWebpackExternalCallback,
} = require('./common');

const namePlaceholder = '__NAME__';
const regExportFrom = /export([^;]+)from\s+'([^']+)';/gm;
const regImportFrom = /import\s+(?:type\s+)?([^;]*)\s+from\s+'([^']+)';/gm;
const singleLineComment = /\/\/[^\n]*\n/g;
const multiLineComment = /(^\/\*(\*(?!\/)|[^*])*\*\/\s*)/m;

// 1. [export ][default |declare ](class|interface) <NAME>[ extends| implements <BASE_CLASS>] {...}
const regClassInterface = /(\/\*(\*(?!\/)|[^*])*\*\/\s*)?(export\s+)?(default\s+|declare\s+)?(interface|class)\s+([a-zA-Z0-9_]+(\s*<[^>]+>)?)((\s+extends|\s+implements)(\s[0-9a-zA-Z_\.\s,]+(\s*<[^{]+>)?))?\s*{/g;
// 2. [export ][default |declare ]function <NAME>(...)[: <TYPE>];
const regFunction = /(\/\*(\*(?!\/)|[^*])*\*\/\s*)?(export\s+)?(default\s+|declare\s+)?function\s+([a-zA-Z0-9_]+(\s*<(?:[^>]|=>)+>)?)\s*(\([^;]+;)/g;
// 3. [export ][default |declare ]const enum <NAME> {...}
const regEnum = /(\/\*(\*(?!\/)|[^*])*\*\/\s*)?(export\s+)?(default\s+|declare\s+)?(const\s+)?enum\s+([a-zA-Z0-9_<>]+)\s*{/g;
// 4. [export ][default |declare ]type <NAME> = ...;
const regType = /(\/\*(\*(?!\/)|[^*])*\*\/\s*)?(export\s+)?(default\s+|declare\s+)?type\s+([0-9a-zA-Z_]+(\s*<[^>]+>)?)\s*=\s*/g;
// 5. [export ][default |declare ]const <NAME>: ...;
const regConst = /(\/\*(\*(?!\/)|[^*])*\*\/\s*)?(export\s+)?(default\s+|declare\s+)?const\s+([0-9a-zA-Z_<>]+)\s*:\s*/g;
// 6. export[ default] <NAME>|{NAMES};
const regExport = /(\/\*(\*(?!\/)|[^*])*\*\/\s*)?(export\s+)(default\s+([0-9a-zA-Z_]+)\s*,?)?(\s*{([^}]+)})?\s*;/g;

const AllowedCrossPackageImport = {
    'roosterjs-editor-types/lib/compatibleTypes': 'roosterjs-editor-types/lib/compatibleTypes.d.ts',
};

function enqueue(queue, filename, exports) {
    var existingItem = queue.find(v => v.filename == filename);
    if (existingItem) {
        if (exports && !existingItem.exports) {
            existingItem.exports = exports;
        }
    } else {
        queue.push({
            filename,
            exports,
            elements: {},
        });
    }
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

function defaultExternalHandler(_, __, callback) {
    callback();
}

function parseFrom(from, currentFileName, baseDir, projDir, externalHandler) {
    let importFileName;
    let replacedName;
    if (from.substr(0, 1) == '.') {
        var currentPath = path.dirname(currentFileName);
        importFileName = path.resolve(currentPath, from + '.d.ts');
    } else {
        (externalHandler || defaultExternalHandler)(null, from, (_, replacement) => {
            if (replacement) {
                replacedName = replacement;
            } else if (AllowedCrossPackageImport[from]) {
                importFileName = path.resolve(baseDir, AllowedCrossPackageImport[from]);
            } else {
                importFileName = path.resolve(baseDir, from, 'lib/index.d.ts');
                if (!fs.existsSync(importFileName)) {
                    importFileName = path.resolve(projDir, 'node_modules', from, 'lib/index.d.ts');
                }
                if (!fs.existsSync(importFileName)) {
                    err(`Can't resolve package name '${from}' in file '${currentFileName}'`);
                }
            }
        });
    }
    return [importFileName, replacedName];
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

function appendText(elements, name, text, comment) {
    if (!elements[name]) {
        elements[name] = [];
    }

    elements[name].push({
        published: false,
        text,
        comment,
    });
}

function parseClasses(content, elements) {
    var matches;
    while ((matches = regClassInterface.exec(content))) {
        var result = parsePair(content, matches.index + matches[0].length, '{', '}', 1);
        var classText =
            (matches[1] || '') +
            matches[5] +
            ' ' +
            namePlaceholder +
            (matches[7] || '') +
            (matches[8] || '') +
            ' {' +
            result[0];
        var name = getName(matches, 6);
        appendText(elements, name, classText, matches[1]);
        content = result[1];
    }
    return content.replace(regClassInterface, '');
}

function parseFunctions(content, elements) {
    var matches;
    while ((matches = regFunction.exec(content))) {
        var functionText =
            (matches[1] || '') + 'function ' + namePlaceholder + (matches[6] || '') + matches[7];
        var name = getName(matches, 5);
        appendText(elements, name, functionText, matches[1]);
    }
    return content.replace(regFunction, '');
}

function parseEnum(content, elements) {
    var matches;
    while ((matches = regEnum.exec(content))) {
        var result = parsePair(content, matches.index + matches[0].length, '{', '}', 1);
        var enumText =
            (matches[1] || '') + (matches[5] || '') + 'enum ' + namePlaceholder + ' {' + result[0];
        var name = getName(matches, 6);
        appendText(elements, name, enumText, matches[1]);
        content = result[1];
    }
    return content.replace(regEnum, '');
}

function parseType(content, elements) {
    var matches;
    while ((matches = regType.exec(content))) {
        var result = parsePair(content, matches.index + matches[0].length, '{', '}', 0, ';');
        var typeText =
            (matches[1] || '') + 'type ' + namePlaceholder + (matches[6] || '') + ' = ' + result[0];
        var name = getName(matches, 5);
        appendText(elements, name, typeText, matches[1]);
        content = result[1];
    }

    return content.replace(regType, '');
}

function parseConst(content, elements) {
    var matches;
    while ((matches = regConst.exec(content))) {
        var result = parsePair(content, matches.index + matches[0].length, '{', '}', 0, ';');
        var constText = (matches[1] || '') + 'const ' + namePlaceholder + ': ' + result[0];
        var name = getName(matches, 5);
        appendText(elements, name, constText, matches[1]);
        content = result[1];
    }

    return content.replace(regConst, '');
}

function parseExport(content, elements) {
    var matches;
    while ((matches = regExport.exec(content))) {
        var defaultExport = matches[5];
        if (defaultExport) {
            elements['default'] = { ...elements[defaultExport] };
        }
    }

    return content.replace(regExport, '');
}

function parseExportFrom(content, currentFileName, queue, baseDir, projDir) {
    var matches;
    while ((matches = regExportFrom.exec(content))) {
        var exports = parseExports(matches[1].trim());
        var [fromFileName] = parseFrom(matches[2].trim(), currentFileName, baseDir, projDir);
        enqueue(queue, fromFileName, exports);
    }
    return content.replace(regExportFrom, '');
}

function parseImportFrom(content, currentFileName, queue, baseDir, projDir, externalHandler) {
    var matches;
    let newContent = content;
    while ((matches = regImportFrom.exec(content))) {
        var [fromFileName, replacedName] = parseFrom(
            matches[2].trim(),
            currentFileName,
            baseDir,
            projDir,
            externalHandler
        );

        if (fromFileName) {
            enqueue(queue, fromFileName);
        } else {
            const imports = matches[1]
                .split(',')
                .map(x =>
                    x
                        .replace('{', '')
                        .replace('}', '')
                        .replace(/[\.\*\(\)\{\}\[\]\\]/g, '\\$&')
                        .trim()
                )
                .filter(x => !!x);
            imports.forEach(x => {
                newContent = newContent.replace(
                    new RegExp(`(\\W|^)(${x})(\\W|$)`, 'gm'),
                    '$1' + replacedName + '.$2$3'
                );
            });
        }
    }
    return newContent.replace(regImportFrom, '');
}

function parseEmptyExport(content) {
    return content.replace(/export \{\};/g, '');
}

function process(baseDir, queue, index, projDir, externalHandler) {
    var item = queue[index];
    var currentFileName = item.filename;
    var file = fs.readFileSync(currentFileName);
    var content = file.toString();

    // 1. Process 'export ... from ...;'
    content = parseExportFrom(content, currentFileName, queue, baseDir, projDir);

    // 2. Remove imports
    content = parseImportFrom(content, currentFileName, queue, baseDir, projDir, externalHandler);

    // 3. Parse all the public elements
    content = [
        parseClasses,
        parseFunctions,
        parseEnum,
        parseType,
        parseConst,
        parseExport,
        parseEmptyExport,
    ].reduce((c, func) => func(c, item.elements), content);

    // 4. Remove single line comments
    content = content.replace(singleLineComment, '');

    if (content.trim() != '') {
        err('File ' + currentFileName + ' contains unrecognized content:\r\n' + content);
    }
}

function publicElement(element) {
    return element.map(x => {
        x.published = true;
        return x.text;
    });
}

function generateDts(library, isAmd, queue) {
    var version = JSON.stringify(mainPackageJson.version).replace(/"/g, '');
    var content = '';
    content += `// Type definitions for roosterjs (Version ${version})\r\n`;
    content += '// Generated by dts tool from roosterjs\r\n';
    content += '// Project: https://github.com/Microsoft/roosterjs\r\n';
    content += '\r\n';

    if (!isAmd) {
        content += 'declare namespace ' + library + ' {\r\n';
    }

    for (var i = 0; i < queue.length; i++) {
        var { exports, elements, filename } = queue[i];
        if (exports) {
            for (var name in exports) {
                var alias = exports[name];
                var texts = null;
                if (elements[name]) {
                    texts = publicElement(elements[name]);
                } else {
                    for (var n in elements) {
                        if (n.indexOf(alias + '<') == 0) {
                            texts = publicElement(elements[n]);
                            break;
                        }
                    }
                    if (!texts) {
                        err(`Name not found: ${name}; alias: ${alias}; file: ${filename}`);
                    }
                }

                for (var text of texts) {
                    text = text.replace(namePlaceholder, alias);

                    if (!isAmd) {
                        content += '    ' + text.replace(/\r\n/g, '\r\n    ').trim() + '\r\n\r\n';
                    } else {
                        content +=
                            (multiLineComment.test(text)
                                ? text.replace(multiLineComment, '$1export ')
                                : 'export ' + text) + '\r\n\r\n';
                    }
                }
            }
        }
    }

    if (!isAmd) {
        content += '}';
    }

    // Check comments
    for (var i = 0; i < queue.length; i++) {
        var { filename, elements } = queue[i];

        for (var name in elements) {
            elements[name].forEach(({ published, text, comment }) => {
                var code = text.replace(namePlaceholder, name);
                if (!comment) {
                    err(`Exported element must have comment. File: ${filename} Code: ${code}`);
                } else if (published) {
                    if (comment.indexOf('@internal') >= 0) {
                        err(
                            `Public exported element must not mark as "@internal". File: ${filename} Code: ${code}`
                        );
                    }
                } else if (comment.indexOf('@internal') < 0) {
                    err(
                        `Local exported member must be marked as "@internal". File: ${filename} Code: ${code}`
                    );
                }
            });
        }
    }

    return content;
}

function createQueue(rootPath, baseDir, root, additionalFiles, externalHandler) {
    var queue = [];
    var i = 0;

    // First part, process exported members
    enqueue(queue, path.join(baseDir, root));
    for (; i < queue.length; i++) {
        process(baseDir, queue, i, rootPath, externalHandler);
    }

    // Second part, process "local exported" members (exported from a file, but not exported from index)
    (additionalFiles || []).forEach(f => enqueue(queue, path.join(baseDir, f)));
    for (; i < queue.length; i++) {
        process(baseDir, queue, i, rootPath, externalHandler);
    }

    return queue;
}

function dts(isAmd, isUi) {
    const targetPath = isUi ? roosterJsUiDistPath : roosterJsDistPath;
    const targetPackages = isUi ? packagesUI : ['roosterjs'];
    const startFileName = isUi ? 'roosterjs-react/lib/index.d.ts' : 'roosterjs/lib/index.d.ts';
    const libraryName = isUi ? 'roosterjsReact' : 'roosterjs';
    const targetFileName = isUi ? 'rooster-react' : 'rooster';
    const externalHandler = isUi ? getWebpackExternalCallback([]) : undefined;

    mkdirp.sync(targetPath);

    let tsFiles = [];

    targetPackages.forEach(packageName => {
        tsFiles = tsFiles.concat(
            glob
                .sync(
                    path.relative(rootPath, path.join(distPath, packageName, 'lib', '**', '*.d.ts'))
                )
                .map(x => path.relative(distPath, x))
        );
    });

    const dtsQueue = createQueue(rootPath, distPath, startFileName, tsFiles, externalHandler);
    const dtsContent = generateDts(libraryName, isAmd, dtsQueue);
    const fileName = `${targetFileName}${isAmd ? '-amd' : ''}.d.ts`;
    const fullFileName = path.join(targetPath, fileName);

    if (isUi) {
        const roosterjsDtsFileName = `rooster${isAmd ? '-amd' : ''}.d.ts`;
        fs.copyFileSync(
            path.join(roosterJsDistPath, roosterjsDtsFileName),
            path.join(targetPath, roosterjsDtsFileName)
        );
        fs.writeFileSync(
            fullFileName,
            `/// <reference path="./rooster${
                isAmd ? '-amd' : ''
            }" />\n/// <reference types="react" />\n\n` +
                "import * as FluentUIReact from '@fluentui/react/dist/react';\n\n" +
                dtsContent
        );
    } else {
        fs.writeFileSync(fullFileName, dtsContent);
    }

    if (!isAmd) {
        const typescriptPath = path.join(nodeModulesPath, 'typescript/lib/tsc.js');
        runNode(typescriptPath + ' ' + fullFileName + ' --noEmit', rootPath);
    }
}

module.exports = {
    dtsCommonJs: {
        message: `Generating type definition file (rooster.d.ts) for CommonJs...`,
        callback: () => dts(false /*isAmd*/, false /*isUi*/),
        enabled: options => options.dts,
    },
    dtsAmd: {
        message: `Generating type definition file (rooster-amd.d.ts) for AMD...`,
        callback: () => dts(true /*isAmd*/, false /*isUi*/),
        enabled: options => options.dts,
    },
    dtsCommonJsUi: {
        message: `Generating type definition file (rooster-react.d.ts) for CommonJs...`,
        callback: () => dts(false /*isAmd*/, true /*isUi*/),
        enabled: options => options.dts,
    },
    dtsAmdUi: {
        message: `Generating type definition file (rooster-react-amd.d.ts) for AMD...`,
        callback: () => dts(true /*isAmd*/, true /*isUi*/),
        enabled: options => options.dts,
    },
};
