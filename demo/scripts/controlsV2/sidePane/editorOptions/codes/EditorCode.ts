import { ButtonsCode } from './ButtonsCode';
import { CodeElement } from './CodeElement';
import { DarkModeCode } from './DarkModeCode';
import { DefaultFormatCode } from './DefaultFormatCode';
import { PluginsCode } from './PluginsCode';
import type { OptionState } from '../OptionState';

export class EditorCode extends CodeElement {
    private plugins: PluginsCode;
    private defaultFormat: DefaultFormatCode;
    private buttons: ButtonsCode;
    private darkMode: DarkModeCode;

    constructor(state: OptionState) {
        super();

        this.plugins = new PluginsCode(state);
        this.defaultFormat = new DefaultFormatCode(state.defaultFormat);
        this.buttons = new ButtonsCode();
        this.darkMode = new DarkModeCode();
    }

    getCode() {
        let defaultFormat = this.defaultFormat.getCode();
        let code = "let contentDiv = document.getElementById('contentDiv');\n";
        let darkMode = this.darkMode.getCode();

        code += `let plugins = ${this.plugins.getCode()};\n`;
        code += defaultFormat ? `let defaultSegmentFormat = ${defaultFormat};\n` : '';
        code += 'let options = {\n';
        code += this.indent('plugins: plugins,\n');
        code += defaultFormat ? this.indent('defaultSegmentFormat: defaultSegmentFormat,\n') : '';
        code += this.indent(`getDarkColor: ${darkMode},\n`);
        code += '};\n';
        code += this.buttons ? this.buttons.getCode() : '';

        return code;
    }
}
