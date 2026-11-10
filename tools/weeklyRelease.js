'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();
const ts = require(path.join(root, 'node_modules/typescript'));
const { buildConfig } = require(path.join(root, 'tools/buildTools/common'));
const printer = ts.createPrinter({ removeComments: true, newLine: ts.NewLineKind.LineFeed });
const groups = Object.keys(buildConfig);
const ranks = { none: 0, patch: 1, minor: 2, major: 3 };

function git(...args) {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
}

function readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function failDiagnostics(diagnostics) {
    const errors = diagnostics.filter(d => d.category === ts.DiagnosticCategory.Error);

    if (errors.length) {
        throw new Error(
            ts.formatDiagnosticsWithColorAndContext(errors, {
                getCanonicalFileName: name => name,
                getCurrentDirectory: () => root,
                getNewLine: () => '\n',
            })
        );
    }
}

function snapshot(sourceRoot) {
    const config = ts.getParsedCommandLineOfConfigFile(
        path.join(sourceRoot, 'packages/tsconfig.json'),
        { emitDeclarationOnly: true },
        {
            ...ts.sys,
            onUnRecoverableConfigFileDiagnostic: diagnostic => failDiagnostics([diagnostic]),
        }
    );

    if (!config) {
        throw new Error('Unable to read the package TypeScript configuration.');
    }

    failDiagnostics(config.errors);
    const program = ts.createProgram(config.fileNames, config.options);
    failDiagnostics(ts.getPreEmitDiagnostics(program));
    const declarations = {};
    const result = program.emit(
        undefined,
        (fileName, text) => {
            const relative = path.relative(config.options.outDir, fileName).replace(/\\/g, '/');

            if (!relative.endsWith('.d.ts')) {
                throw new Error(`Unexpected compiler output: ${relative}`);
            }

            const source = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true);
            const entries = {};

            function record(key, node) {
                const value = printer.printNode(ts.EmitHint.Unspecified, node, source);
                (entries[key] || (entries[key] = [])).push(value);
            }

            source.statements.forEach(statement => {
                if (
                    ts.isExportDeclaration(statement) &&
                    statement.exportClause &&
                    ts.isNamedExports(statement.exportClause)
                ) {
                    statement.exportClause.elements.forEach(element => {
                        record(
                            `export:${element.name.text}`,
                            ts.factory.updateExportDeclaration(
                                statement,
                                statement.decorators,
                                statement.modifiers,
                                statement.isTypeOnly,
                                ts.factory.createNamedExports([element]),
                                statement.moduleSpecifier
                            )
                        );
                    });
                } else {
                    const name = statement.name
                        ? statement.name.getText(source)
                        : ts.isVariableStatement(statement)
                        ? statement.declarationList.declarations
                              .map(d => d.name.getText(source))
                              .join(',')
                        : ts.isImportDeclaration(statement)
                        ? statement.importClause?.getText(source) ||
                          statement.moduleSpecifier.getText(source)
                        : ts.isExportDeclaration(statement)
                        ? statement.moduleSpecifier?.getText(source) || 'default'
                        : ts.SyntaxKind[statement.kind];

                    record(`${statement.kind}:${name}`, statement);
                }
            });

            declarations[relative] = entries;
        },
        undefined,
        true
    );

    failDiagnostics(result.diagnostics);
    if (result.emitSkipped || !Object.keys(declarations).length) {
        throw new Error('No declarations were emitted.');
    }

    return {
        commit: execFileSync('git', ['rev-parse', 'HEAD'], {
            cwd: sourceRoot,
            encoding: 'utf8',
        }).trim(),
        versions: readJson(path.join(sourceRoot, 'versions.json')),
        declarations,
    };
}

function bump(version, level) {
    if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version)) {
        throw new Error(`Release version requires manual handling: ${version}`);
    }

    const numbers = version.split('.').map(Number);
    if (!numbers.every(Number.isSafeInteger)) {
        throw new Error(`Invalid release version: ${version}`);
    }

    const index = ['major', 'minor', 'patch'].indexOf(level);
    if (index >= 0) {
        numbers[index]++;
        numbers.fill(0, index + 1);
    }

    return numbers.join('.');
}

function prepare(baseline, output, apply) {
    const current = snapshot(root);
    const changed = git('diff', '--name-only', baseline.commit, 'HEAD', '--', 'packages')
        .split('\n')
        .filter(Boolean);
    const versions = { ...baseline.versions };
    const recommendations = {};

    if (
        Object.keys(baseline.versions.overrides || {}).length ||
        Object.keys(current.versions.overrides || {}).length
    ) {
        throw new Error('Per-package version overrides require manual release preparation.');
    }

    groups.forEach(group => {
        const previous = versions[group];
        bump(previous, 'none');
        const recommendation = { level: 'none', reasons: [] };
        recommendations[group] = recommendation;

        if (previous === '0.0.0') {
            recommendation.reasons.push('Not enabled for publishing (0.0.0); left unchanged.');
            return;
        }

        buildConfig[group].packages.forEach(packageName => {
            const prefix = `${packageName}/`;
            const files = new Set(
                [
                    ...Object.keys(baseline.declarations),
                    ...Object.keys(current.declarations),
                ].filter(file => file.startsWith(prefix))
            );

            files.forEach(file => {
                const before = baseline.declarations[file] || {};
                const after = current.declarations[file] || {};

                Object.keys(before).forEach(key => {
                    if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
                        recommendation.level = 'major';
                        recommendation.reasons.push(
                            `Changed or removed declaration: ${file} (${key}).`
                        );
                    }
                });
                Object.keys(after).forEach(key => {
                    if (!(key in before)) {
                        if (ranks[recommendation.level] < ranks.minor) {
                            recommendation.level = 'minor';
                        }
                        recommendation.reasons.push(`Added declaration: ${file} (${key}).`);
                    }
                });
            });

            if (
                changed.some(
                    file =>
                        file.startsWith(`packages/${packageName}/lib/`) ||
                        file === `packages/${packageName}/package.json`
                )
            ) {
                if (recommendation.level === 'none') {
                    recommendation.level = 'patch';
                }
                recommendation.reasons.push(
                    `Source or package configuration changed: ${packageName}.`
                );
            }
        });
    });

    groups.forEach(group => {
        if (
            versions[group] !== '0.0.0' &&
            buildConfig[group].dependsOnMain &&
            ranks[recommendations.main.level] > ranks[recommendations[group].level]
        ) {
            recommendations[group].level = recommendations.main.level;
            recommendations[group].reasons.push(
                'Conservatively inherit the main group dependency bump.'
            );
        }
    });

    const lines = [
        '## Recommended versions',
        '',
        '| Group | Released | Proposed | Recommendation |',
        '| --- | --- | --- | --- |',
    ];

    groups.forEach(group => {
        const recommendation = recommendations[group];
        versions[group] = bump(versions[group], recommendation.level);
        lines.push(
            `| ${group} | ${baseline.versions[group]} | ${versions[group]} | ${recommendation.level} |`
        );
    });
    lines.push(
        '',
        '## Review required',
        '',
        '- [ ] Review the included changes and SemVer recommendations.',
        '- [ ] Adjust versions.json on this branch if necessary, then rerun CI.',
        '- [ ] Confirm build, lint, and tests pass before marking ready and merging.',
        '',
        'These are conservative recommendations, not a compatibility guarantee. Changed or removed',
        'declarations suggest major; additions suggest minor; source-only changes suggest patch.',
        'All emitted declarations, including internal modules, are compared. Compatible changes can',
        'therefore be overclassified. Behavioral breaking changes and dependency impacts can be missed.',
        'Unchanged groups retain their released versions. No package is published by this workflow.',
        '',
        '## Evidence'
    );
    groups.forEach(group => {
        const reasons = recommendations[group].reasons;
        lines.push('', `### ${group}`, '');
        reasons.slice(0, 30).forEach(reason => lines.push(`- ${reason.replace(/[<>|`]/g, '')}`));
        if (!reasons.length) {
            lines.push('- No package source or declaration changes detected.');
        } else if (reasons.length > 30) {
            lines.push(
                `- ${reasons.length - 30} additional declaration/source changes; inspect the diff.`
            );
        }
    });
    const commits = git('log', '--format=%h %s', `${baseline.commit}..origin/master`)
        .split('\n')
        .filter(Boolean);
    lines.push('', '## Included commits', '');
    commits.slice(0, 100).forEach(commit => lines.push(`- ${commit.replace(/[<>]/g, '')}`));
    if (commits.length > 100) {
        lines.push(`- ${commits.length - 100} additional commits; inspect the branch comparison.`);
    }
    fs.writeFileSync(output, lines.join('\n') + '\n');
    if (apply) {
        fs.writeFileSync(
            path.join(root, 'versions.json'),
            JSON.stringify(versions, null, 4) + '\n'
        );
    }
}

const [command, input, output] = process.argv.slice(2);
if (!input || !output || !['snapshot', 'prepare', 'preview'].includes(command)) {
    throw new Error(
        'Usage: node tools/weeklyRelease.js <snapshot|prepare|preview> <input> <output>'
    );
}
if (command === 'snapshot') {
    fs.writeFileSync(output, JSON.stringify(snapshot(path.resolve(input))));
} else {
    prepare(readJson(input), output, command === 'prepare');
}
