import { ButtonsCode } from './ButtonsCode';
import { CodeElement } from './CodeElement';
import { DefaultFormatCode } from './DefaultFormatCode';
import type { OptionState } from '../OptionState';

export class EditorCode extends CodeElement {
    //    private plugins: PluginsCode;
    private defaultFormat: DefaultFormatCode;
    private buttons: ButtonsCode;

    constructor(state: OptionState) {
        super();

        //        this.plugins = new PluginsCode(state);
        this.defaultFormat = new DefaultFormatCode(state.defaultFormat);
        this.buttons = new ButtonsCode();
    }

    getCode() {
        let defaultFormat = this.defaultFormat.getCode();
        let code = "let contentDiv = document.getElementById('contentDiv') as HTMLDivElement;\n";
        //        code += `let plugins = ${this.plugins.getCode()};\n`;
        code += defaultFormat ? `let defaultSegmentFormat = ${defaultFormat};\n` : '';
        code += 'let options: roosterjs.EditorOptions = {\n';
        //        code += this.indent('plugins: plugins,\n');
        code += defaultFormat ? this.indent('defaultSegmentFormat: defaultSegmentFormat,\n') : '';
        code += '};\n';
        code += 'let editor = new roosterjsContentModel.Editor(contentDiv, options);\n';
        code += this.buttons ? this.buttons.getCode() : '';

        return code;
    }
}
