import { ButtonsCode } from './ButtonsCode';
import { CodeElement } from './CodeElement';
import { DarkModeCode } from './DarkModeCode';
import { DefaultFormatCode } from './DefaultFormatCode';
import { LegacyPluginCode, PluginsCode } from './PluginsCode';
import type { OptionState } from '../OptionState';

export class EditorCode extends CodeElement {
    private plugins: PluginsCode;
    private legacyPlugins: LegacyPluginCode;
    private defaultFormat: DefaultFormatCode;
    private buttons: ButtonsCode;
    private darkMode: DarkModeCode;

    constructor(state: OptionState) {
        super();

        this.plugins = new PluginsCode();
        this.legacyPlugins = new LegacyPluginCode(state);
        this.defaultFormat = new DefaultFormatCode(state.defaultFormat);
        this.buttons = new ButtonsCode();
        this.darkMode = new DarkModeCode();
    }

    requireLegacyCode() {
        return this.legacyPlugins.getPluginCount() > 0 || !!this.darkMode;
    }

    getCode() {
        let defaultFormat = this.defaultFormat.getCode();
        let code = "let contentDiv = document.getElementById('contentDiv') as HTMLDivElement;\n";
        let darkMode = this.darkMode.getCode();

        const hasLegacyPlugin = this.legacyPlugins.getPluginCount() > 0;

        code += `let plugins = ${this.plugins.getCode()};\n`;
        code += hasLegacyPlugin ? `let legacyPlugins = ${this.legacyPlugins.getCode()};\n` : '';
        code += defaultFormat ? `let defaultSegmentFormat = ${defaultFormat};\n` : '';
        code += 'let options: roosterjs.EditorOptions = {\n';
        code += this.indent('plugins: plugins,\n');
        code += hasLegacyPlugin ? this.indent('legacyPlugins: legacyPlugins,\n') : '';
        code += defaultFormat ? this.indent('defaultSegmentFormat: defaultSegmentFormat,\n') : '';
        code += darkMode ? this.indent(`getDarkColor: ${darkMode},\n`) : '';
        code += '};\n';
        code += `let editor = new ${
            hasLegacyPlugin ? 'roosterjs.EditorAdapter' : 'roosterjsContentModel.Editor'
        }(contentDiv, options);\n`;
        code += this.buttons ? this.buttons.getCode() : '';

        return code;
    }
}
