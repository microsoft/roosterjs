import BuildInPluginState from '../../../BuildInPluginState';
import CodeElement from './CodeElement';
import DefaultFormatCode from './DefaultFormatCode';
import PluginsCode from './PluginsCode';

export default class EditorCode extends CodeElement {
    private plugins: PluginsCode;
    private defaultFormat: DefaultFormatCode;

    constructor(state: BuildInPluginState) {
        super();

        this.plugins = new PluginsCode(state);
        this.defaultFormat = new DefaultFormatCode(state.defaultFormat);
    }

    getImports() {
        let imports = [
            {
                name: 'Editor',
                path: 'roosterjs-editor-core',
                isDefault: false,
            },
            {
                name: 'EditorOptions',
                path: 'roosterjs-editor-core',
                isDefault: false,
            },
            ...this.plugins.getImports(),
        ];

        if (this.defaultFormat.getCode()) {
            imports = imports.concat(this.defaultFormat.getImports());
        }

        return imports;
    }

    getCode() {
        let defaultFormat = this.defaultFormat.getCode();
        let code =
            "let contentDiv = document.getElementById('contentDiv') as HTMLDivElement;\n";
        code += `let plugins = ${this.plugins.getCode()};\n`;
        code += defaultFormat
            ? `let defaultFormat: DefaultFormat = ${defaultFormat};\n`
            : '';
        code += 'let options: EditorOptions = {\n';
        code += this.indent('plugins: plugins,\n');
        code += defaultFormat
            ? this.indent('defaultFormat: defaultFormat,\n')
            : '';
        code += '};\n';
        code += 'let editor = new Editor(contentDiv, options);\n';

        return code;
    }
}
