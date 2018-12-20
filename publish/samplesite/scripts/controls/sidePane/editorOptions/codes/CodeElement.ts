import Import from './Import';

export default abstract class CodeElement {
    abstract getImports(): Import[];
    abstract getCode(): string;

    protected encode(src: string): string {
        return src.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    }

    protected indent(src: string): string {
        return src
            .split('\n')
            .map(line => (line == '' ? '' : '    ' + line + '\n'))
            .join('');
    }

    static mergeImport(imports: Import[]): string {
        let importMap: { [path: string]: { namedImports: string[]; defaultImport: string } } = {};

        imports.forEach(imp => {
            importMap[imp.path] = importMap[imp.path] || {
                namedImports: [],
                defaultImport: null,
            };

            if (imp.isDefault) {
                importMap[imp.path].defaultImport = imp.name;
            } else {
                importMap[imp.path].namedImports.push(imp.name);
            }
        });

        return Object.keys(importMap)
            .map(path => {
                let { defaultImport, namedImports } = importMap[path];
                let importStr = [
                    defaultImport || null,
                    namedImports.length > 0 ? `{ ${namedImports.join(', ')} }` : null,
                ]
                    .filter(item => !!item)
                    .join(', ');
                return `import ${importStr} from '${path}';\n`;
            })
            .join('');
    }
}
